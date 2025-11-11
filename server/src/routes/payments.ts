import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index';
import { JWTPayload, UserRole } from '../types';

// Validation schemas
const createPaymentSchema = z.object({
  billId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'ONLINE']),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export default async function paymentRoutes(server: FastifyInstance) {
  // List payments
  server.get(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get all payments for the authenticated user',
        tags: ['Payments'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            },
            billId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;
        const { page = 1, limit = 10, status, billId } = request.query as any;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (role === UserRole.CUSTOMER) {
          where.userId = userId;
        }
        if (status) {
          where.status = status;
        }
        if (billId) {
          where.billId = billId;
        }

        const [payments, total] = await Promise.all([
          prisma.payment.findMany({
            where,
            include: {
              bill: {
                select: {
                  id: true,
                  billNumber: true,
                  totalAmount: true,
                  dueDate: true,
                },
              },
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            skip,
            take: limit,
            orderBy: { paymentDate: 'desc' },
          }),
          prisma.payment.count({ where }),
        ]);

        reply.send({
          success: true,
          data: {
            items: payments,
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

  // Get payment by ID
  server.get(
    '/:id',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get payment details by ID',
        tags: ['Payments'],
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

        const payment = await prisma.payment.findUnique({
          where: { id },
          include: {
            bill: {
              include: {
                property: true,
              },
            },
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

        if (!payment) {
          return reply.code(404).send({
            success: false,
            error: 'Payment not found',
          });
        }

        // Check permissions
        if (role === UserRole.CUSTOMER && payment.userId !== userId) {
          return reply.code(403).send({
            success: false,
            error: 'Forbidden',
          });
        }

        reply.send({
          success: true,
          data: payment,
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

  // Create payment
  server.post(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Create a new payment',
        tags: ['Payments'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['billId', 'amount', 'paymentMethod'],
          properties: {
            billId: { type: 'string' },
            amount: { type: 'number' },
            paymentMethod: {
              type: 'string',
              enum: ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'ONLINE'],
            },
            transactionId: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId } = request.user as JWTPayload;
        const body = createPaymentSchema.parse(request.body);

        // Get the bill
        const bill = await prisma.bill.findUnique({
          where: { id: body.billId },
          include: {
            payments: true,
            property: true,
          },
        });

        if (!bill) {
          return reply.code(404).send({
            success: false,
            error: 'Bill not found',
          });
        }

        // Check if user owns the bill
        if (bill.userId !== userId) {
          return reply.code(403).send({
            success: false,
            error: 'Forbidden',
            message: 'You can only pay your own bills',
          });
        }

        // Calculate total paid amount
        const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = bill.totalAmount - totalPaid;

        if (body.amount > remainingAmount) {
          return reply.code(400).send({
            success: false,
            error: 'Invalid payment amount',
            message: `Payment amount exceeds remaining bill amount (€${remainingAmount})`,
          });
        }

        // Generate payment number
        const paymentCount = await prisma.payment.count();
        const paymentNumber = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(6, '0')}`;

        // Create payment
        const payment = await prisma.payment.create({
          data: {
            ...body,
            paymentNumber,
            userId,
            status: 'COMPLETED',
          },
          include: {
            bill: true,
          },
        });

        // Update bill status if fully paid
        const newTotalPaid = totalPaid + body.amount;
        if (newTotalPaid >= bill.totalAmount) {
          await prisma.bill.update({
            where: { id: bill.id },
            data: { status: 'PAID' },
          });
        }

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            title: 'Payment Successful',
            message: `Payment of €${body.amount} for bill ${bill.billNumber} was successful`,
            type: 'PAYMENT',
          },
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'CREATE',
            entity: 'Payment',
            entityId: payment.id,
            details: `Payment of €${body.amount} for bill ${bill.billNumber}`,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        });

        reply.code(201).send({
          success: true,
          message: 'Payment created successfully',
          data: payment,
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

  // Get payment statistics
  server.get(
    '/stats/overview',
    {
      onRequest: [server.authenticate],
      schema: {
        description: 'Get payment statistics overview',
        tags: ['Payments'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      try {
        const { userId, role } = request.user as JWTPayload;

        const where = role === UserRole.CUSTOMER ? { userId } : {};

        const [total, completed, pending, failed, totalAmount] = await Promise.all([
          prisma.payment.count({ where }),
          prisma.payment.count({ where: { ...where, status: 'COMPLETED' } }),
          prisma.payment.count({ where: { ...where, status: 'PENDING' } }),
          prisma.payment.count({ where: { ...where, status: 'FAILED' } }),
          prisma.payment.aggregate({
            where: { ...where, status: 'COMPLETED' },
            _sum: { amount: true },
          }),
        ]);

        reply.send({
          success: true,
          data: {
            total,
            completed,
            pending,
            failed,
            totalAmount: totalAmount._sum.amount || 0,
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
