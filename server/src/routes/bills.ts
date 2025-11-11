import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index';
import { JWTPayload, UserRole } from '../types';

// Validation schemas
const createBillSchema = z.object({
  propertyId: z.string(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  dueDate: z.string().datetime(),
  totalAmount: z.number().positive(),
  consumption: z.number().nonnegative().optional(),
  rate: z.number().positive().optional(),
  taxes: z.number().nonnegative().default(0),
  fees: z.number().nonnegative().default(0),
});

export default async function billRoutes(server: FastifyInstance) {
  // List bills
  server.get(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get all bills for the authenticated user',
        tags: ['Bills'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            status: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'DISPUTED'],
            },
            propertyId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;
        const { page = 1, limit = 10, status, propertyId } = request.query as any;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (role === UserRole.CUSTOMER) {
          where.userId = userId;
        }
        if (status) {
          where.status = status;
        }
        if (propertyId) {
          where.propertyId = propertyId;
        }

        const [bills, total] = await Promise.all([
          prisma.bill.findMany({
            where,
            include: {
              property: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                },
              },
              payments: {
                select: {
                  id: true,
                  amount: true,
                  paymentDate: true,
                  status: true,
                },
              },
            },
            skip,
            take: limit,
            orderBy: { dueDate: 'desc' },
          }),
          prisma.bill.count({ where }),
        ]);

        reply.send({
          success: true,
          data: {
            items: bills,
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

  // Get bill by ID
  server.get(
    '/:id',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get bill details by ID',
        tags: ['Bills'],
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

        const bill = await prisma.bill.findUnique({
          where: { id },
          include: {
            property: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            payments: true,
          },
        });

        if (!bill) {
          return reply.code(404).send({
            success: false,
            error: 'Bill not found',
          });
        }

        // Check permissions
        if (role === UserRole.CUSTOMER && bill.userId !== userId) {
          return reply.code(403).send({
            success: false,
            error: 'Forbidden',
          });
        }

        reply.send({
          success: true,
          data: bill,
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

  // Create bill (Admin/Manager only)
  server.post(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Create a new bill (Admin/Manager only)',
        tags: ['Bills'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['propertyId', 'periodStart', 'periodEnd', 'dueDate', 'totalAmount'],
          properties: {
            propertyId: { type: 'string' },
            periodStart: { type: 'string', format: 'date-time' },
            periodEnd: { type: 'string', format: 'date-time' },
            dueDate: { type: 'string', format: 'date-time' },
            totalAmount: { type: 'number' },
            consumption: { type: 'number' },
            rate: { type: 'number' },
            taxes: { type: 'number' },
            fees: { type: 'number' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;

        // Check if user is admin or manager
        if (role === UserRole.CUSTOMER) {
          return reply.code(403).send({
            success: false,
            error: 'Forbidden',
            message: 'Only admins and managers can create bills',
          });
        }

        const body = createBillSchema.parse(request.body);

        // Get property to get the owner
        const property = await prisma.property.findUnique({
          where: { id: body.propertyId },
        });

        if (!property) {
          return reply.code(404).send({
            success: false,
            error: 'Property not found',
          });
        }

        // Generate bill number
        const billCount = await prisma.bill.count();
        const billNumber = `BILL-${new Date().getFullYear()}-${String(billCount + 1).padStart(6, '0')}`;

        const bill = await prisma.bill.create({
          data: {
            ...body,
            billNumber,
            userId: property.ownerId,
            periodStart: new Date(body.periodStart),
            periodEnd: new Date(body.periodEnd),
            dueDate: new Date(body.dueDate),
          },
          include: {
            property: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        // Create notification for the user
        await prisma.notification.create({
          data: {
            userId: property.ownerId,
            title: 'New Bill Generated',
            message: `A new bill of €${bill.totalAmount} has been generated for ${property.name}`,
            type: 'BILL',
          },
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'CREATE',
            entity: 'Bill',
            entityId: bill.id,
            details: `Created bill ${bill.billNumber} for property ${property.name}`,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        });

        reply.code(201).send({
          success: true,
          message: 'Bill created successfully',
          data: bill,
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

  // Get bill statistics
  server.get(
    '/stats/overview',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get bill statistics overview',
        tags: ['Bills'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;

        const where = role === UserRole.CUSTOMER ? { userId } : {};

        const [total, pending, paid, overdue, totalAmount, paidAmount] = await Promise.all([
          prisma.bill.count({ where }),
          prisma.bill.count({ where: { ...where, status: 'PENDING' } }),
          prisma.bill.count({ where: { ...where, status: 'PAID' } }),
          prisma.bill.count({ where: { ...where, status: 'OVERDUE' } }),
          prisma.bill.aggregate({
            where,
            _sum: { totalAmount: true },
          }),
          prisma.bill.aggregate({
            where: { ...where, status: 'PAID' },
            _sum: { totalAmount: true },
          }),
        ]);

        reply.send({
          success: true,
          data: {
            total,
            pending,
            paid,
            overdue,
            totalAmount: totalAmount._sum.totalAmount || 0,
            paidAmount: paidAmount._sum.totalAmount || 0,
            unpaidAmount: (totalAmount._sum.totalAmount || 0) - (paidAmount._sum.totalAmount || 0),
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
}
