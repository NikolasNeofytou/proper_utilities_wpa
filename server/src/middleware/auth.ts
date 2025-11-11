import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload } from '../types';

// Extend Fastify Request type to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
  }
}

export function authorize(...roles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      const user = request.user as JWTPayload;

      if (!roles.includes(user.role)) {
        reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
      }
    } catch (err) {
      reply.code(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token',
      });
    }
  };
}
