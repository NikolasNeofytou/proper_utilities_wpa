import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { authenticate } from './middleware/auth';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Create Fastify instance
const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Decorate server with authenticate method
server.decorate('authenticate', authenticate);

// Extend FastifyInstance type
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate;
  }
}

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false, // Disable for development
  });

  // JWT Authentication
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  });

  // Swagger documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'UtilityPro API',
        description: 'API documentation for UtilityPro utility management system',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}

// Register routes
async function registerRoutes() {
  // API prefix
  const apiPrefix = process.env.API_PREFIX || '/api/v1';

  // Auth routes
  server.register(authRoutes, { prefix: `${apiPrefix}/auth` });
}

// Health check route
server.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

// Root route
server.get('/', async () => {
  return {
    message: 'UtilityPro API Server',
    version: '1.0.0',
    docs: '/docs',
  };
});

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });

    console.log(`🚀 Server is running on http://${host}:${port}`);
    console.log(`📚 API Documentation available at http://${host}:${port}/docs`);
  } catch (err) {
    server.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  try {
    await server.close();
    await prisma.$disconnect();
    console.log('👋 Server closed gracefully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
start();

export default server;
