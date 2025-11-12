import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../index';

// Schema for creating a new user (admin only)
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER']),
});

// Schema for updating user status
const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

// Schema for updating user role
const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER']),
});

export default async function adminRoutes(fastify: FastifyInstance) {
  // Get admin statistics
  fastify.get(
    '/stats',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;

      // Check if user is admin or manager
      if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
      }

      try {
        // Get total users count
        const totalUsers = await prisma.user.count();

        // Get total properties count
        const totalProperties = await prisma.property.count();

        // Get total bills count
        const totalBills = await prisma.bill.count();

        // Get bills by status
        const billsByStatus = await prisma.bill.groupBy({
          by: ['status'],
          _count: true,
        });

        // Calculate total revenue
        const totalRevenue = await prisma.payment.aggregate({
          where: {
            status: 'COMPLETED',
          },
          _sum: {
            amount: true,
          },
        });

        // Get recent payments (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPayments = await prisma.payment.count({
          where: {
            createdAt: {
              gte: sevenDaysAgo,
            },
            status: 'COMPLETED',
          },
        });

        return reply.send({
          success: true,
          data: {
            totalUsers,
            totalProperties,
            totalBills,
            billsByStatus: billsByStatus.reduce((acc, item) => {
              acc[item.status] = item._count;
              return acc;
            }, {} as Record<string, number>),
            totalRevenue: totalRevenue._sum.amount || 0,
            recentPayments,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to fetch admin statistics',
        });
      }
    }
  );

  // Get all users (admin only)
  fastify.get(
    '/users',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;

      // Check if user is admin or manager
      if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
      }

      try {
        const { page = 1, limit = 10, role, search } = request.query as any;

        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        const where: any = {};

        if (role) {
          where.role = role;
        }

        if (search) {
          where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [users, total] = await Promise.all([
          prisma.user.findMany({
            where,
            skip,
            take,
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              role: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          }),
          prisma.user.count({ where }),
        ]);

        return reply.send({
          success: true,
          data: users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / take),
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to fetch users',
        });
      }
    }
  );

  // Create new user (admin only)
  fastify.post(
    '/users',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;

      // Only admins can create users
      if (user.role !== 'ADMIN') {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Only administrators can create users',
        });
      }

      try {
        const body = createUserSchema.parse(request.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: body.email },
        });

        if (existingUser) {
          return reply.code(409).send({
            success: false,
            error: 'Conflict',
            message: 'User with this email already exists',
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Create user
        const newUser = await prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            role: body.role,
          },
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

        return reply.code(201).send({
          success: true,
          message: 'User created successfully',
          data: newUser,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            success: false,
            error: 'Validation Error',
            message: 'Invalid request data',
            details: error.errors,
          });
        }

        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to create user',
        });
      }
    }
  );

  // Update user status (admin only)
  fastify.patch(
    '/users/:id/status',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;
      const { id } = request.params as { id: string };

      // Only admins can update user status
      if (user.role !== 'ADMIN') {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Only administrators can update user status',
        });
      }

      try {
        const body = updateUserStatusSchema.parse(request.body);

        const updatedUser = await prisma.user.update({
          where: { id },
          data: { isActive: body.isActive },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        });

        return reply.send({
          success: true,
          message: 'User status updated successfully',
          data: updatedUser,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            success: false,
            error: 'Validation Error',
            message: 'Invalid request data',
            details: error.errors,
          });
        }

        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to update user status',
        });
      }
    }
  );

  // Update user role (admin only)
  fastify.patch(
    '/users/:id/role',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;
      const { id } = request.params as { id: string };

      // Only admins can update user roles
      if (user.role !== 'ADMIN') {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Only administrators can update user roles',
        });
      }

      try {
        const body = updateUserRoleSchema.parse(request.body);

        const updatedUser = await prisma.user.update({
          where: { id },
          data: { role: body.role },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        });

        return reply.send({
          success: true,
          message: 'User role updated successfully',
          data: updatedUser,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            success: false,
            error: 'Validation Error',
            message: 'Invalid request data',
            details: error.errors,
          });
        }

        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to update user role',
        });
      }
    }
  );

  // Delete user (admin only)
  fastify.delete(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;
      const { id } = request.params as { id: string };

      // Only admins can delete users
      if (user.role !== 'ADMIN') {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Only administrators can delete users',
        });
      }

      // Prevent self-deletion
      if (user.id === id) {
        return reply.code(400).send({
          success: false,
          error: 'Bad Request',
          message: 'Cannot delete your own account',
        });
      }

      try {
        await prisma.user.delete({
          where: { id },
        });

        return reply.send({
          success: true,
          message: 'User deleted successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to delete user',
        });
      }
    }
  );
}
