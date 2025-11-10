import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index';
import { hashPassword, comparePassword, validateEmail, validatePassword } from '../utils/auth';
import { UserRole, JWTPayload } from '../types';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(server: FastifyInstance) {
  // Register
  server.post(
    '/register',
    {
      schema: {
        description: 'Register a new user',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const body = registerSchema.parse(request.body);

        // Validate email format
        if (!validateEmail(body.email)) {
          return reply.code(400).send({
            success: false,
            error: 'Invalid email format',
          });
        }

        // Validate password strength
        const passwordValidation = validatePassword(body.password);
        if (!passwordValidation.valid) {
          return reply.code(400).send({
            success: false,
            error: 'Password validation failed',
            message: passwordValidation.errors.join(', '),
          });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: body.email },
        });

        if (existingUser) {
          return reply.code(409).send({
            success: false,
            error: 'User already exists',
          });
        }

        // Hash password
        const hashedPassword = await hashPassword(body.password);

        // Create user
        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            role: UserRole.CUSTOMER,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
        });

        reply.code(201).send({
          success: true,
          message: 'User registered successfully',
          data: user,
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

  // Login
  server.post(
    '/login',
    {
      schema: {
        description: 'Login with email and password',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const body = loginSchema.parse(request.body);

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: body.email },
        });

        if (!user) {
          return reply.code(401).send({
            success: false,
            error: 'Invalid credentials',
          });
        }

        // Check if user is active
        if (!user.isActive) {
          return reply.code(403).send({
            success: false,
            error: 'Account is inactive',
          });
        }

        // Verify password
        const isValidPassword = await comparePassword(body.password, user.password);
        if (!isValidPassword) {
          return reply.code(401).send({
            success: false,
            error: 'Invalid credentials',
          });
        }

        // Generate JWT token
        const payload: JWTPayload = {
          userId: user.id,
          email: user.email,
          role: user.role as UserRole,
        };

        const token = server.jwt.sign(payload, {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            entity: 'User',
            entityId: user.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        });

        reply.send({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
          },
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

  // Get current user (protected route)
  server.get(
    '/me',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get current authenticated user',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId } = request.user as JWTPayload;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        });

        if (!user) {
          return reply.code(404).send({
            success: false,
            error: 'User not found',
          });
        }

        reply.send({
          success: true,
          data: user,
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
