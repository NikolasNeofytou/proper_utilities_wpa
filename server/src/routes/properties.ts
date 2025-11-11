import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index';
import { JWTPayload, UserRole } from '../types';

// Validation schemas
const createPropertySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default('Greece'),
  type: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'BUILDING']),
  totalUnits: z.number().int().min(1).default(1),
});

const createUnitSchema = z.object({
  unitNumber: z.string().min(1),
  floor: z.number().int().optional(),
  area: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  isOccupied: z.boolean().default(false),
});

export default async function propertyRoutes(server: FastifyInstance) {
  // List properties
  server.get(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get all properties for the authenticated user',
        tags: ['Properties'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  items: { type: 'array' },
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;
        const { page = 1, limit = 10 } = request.query as any;

        const skip = (page - 1) * limit;

        // Admin/Manager can see all properties, customers only their own
        const where = role === UserRole.CUSTOMER ? { ownerId: userId } : {};

        const [properties, total] = await Promise.all([
          prisma.property.findMany({
            where,
            include: {
              units: {
                select: {
                  id: true,
                  unitNumber: true,
                  isOccupied: true,
                },
              },
              _count: {
                select: {
                  units: true,
                  bills: true,
                },
              },
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.property.count({ where }),
        ]);

        reply.send({
          success: true,
          data: {
            items: properties,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      } catch (error) {
        server.log.error(error);
        reply.code(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // Get property by ID
  server.get(
    '/:id',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get property details by ID',
        tags: ['Properties'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;
        const { id } = request.params as { id: string };

        const property = await prisma.property.findUnique({
          where: { id },
          include: {
            units: {
              include: {
                meters: {
                  select: {
                    id: true,
                    meterNumber: true,
                    type: true,
                    status: true,
                  },
                },
              },
            },
            owner: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        if (!property) {
          return reply.code(404).send({
            success: false,
            error: 'Property not found',
          });
        }

        // Check permissions
        if (role === UserRole.CUSTOMER && property.ownerId !== userId) {
          return reply.code(403).send({
            success: false,
            error: 'Forbidden',
          });
        }

        reply.send({
          success: true,
          data: property,
        });
      } catch (error) {
        server.log.error(error);
        reply.code(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // Create property
  server.post(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Create a new property',
        tags: ['Properties'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name', 'address', 'city', 'postalCode', 'type'],
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            postalCode: { type: 'string' },
            country: { type: 'string' },
            type: { type: 'string', enum: ['APARTMENT', 'HOUSE', 'COMMERCIAL', 'BUILDING'] },
            totalUnits: { type: 'number' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId } = request.user as JWTPayload;
        const body = createPropertySchema.parse(request.body);

        const property = await prisma.property.create({
          data: {
            ...body,
            ownerId: userId,
          },
          include: {
            units: true,
          },
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'CREATE',
            entity: 'Property',
            entityId: property.id,
            details: `Created property: ${property.name}`,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        });

        reply.code(201).send({
          success: true,
          message: 'Property created successfully',
          data: property,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            success: false,
            error: 'Validation error',
            message: error.errors.map((e) => e.message).join(', '),
          });
        }

        server.log.error(error);
        reply.code(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // Create unit for a property
  server.post(
    '/:id/units',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Create a new unit for a property',
        tags: ['Properties'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['unitNumber'],
          properties: {
            unitNumber: { type: 'string' },
            floor: { type: 'number' },
            area: { type: 'number' },
            bedrooms: { type: 'number' },
            bathrooms: { type: 'number' },
            isOccupied: { type: 'boolean' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;
        const { id } = request.params as { id: string };
        const body = createUnitSchema.parse(request.body);

        // Check if property exists and user has permission
        const property = await prisma.property.findUnique({
          where: { id },
        });

        if (!property) {
          return reply.code(404).send({
            success: false,
            error: 'Property not found',
          });
        }

        if (role === UserRole.CUSTOMER && property.ownerId !== userId) {
          return reply.code(403).send({
            success: false,
            error: 'Forbidden',
          });
        }

        const unit = await prisma.unit.create({
          data: {
            ...body,
            propertyId: id,
          },
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'CREATE',
            entity: 'Unit',
            entityId: unit.id,
            details: `Created unit ${unit.unitNumber} for property ${property.name}`,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        });

        reply.code(201).send({
          success: true,
          message: 'Unit created successfully',
          data: unit,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            success: false,
            error: 'Validation error',
            message: error.errors.map((e) => e.message).join(', '),
          });
        }

        server.log.error(error);
        reply.code(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );
}
