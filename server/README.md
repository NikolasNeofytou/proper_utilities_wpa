# UtilityPro API Server

Backend API server for the UtilityPro utility management system built with Fastify, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Fastify
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **API Documentation:** Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp ../.env.example ../.env
# Edit .env with your database credentials
```

3. Generate Prisma Client:
```bash
npm run db:generate
```

4. Run database migrations:
```bash
npm run db:migrate
```

## Development

Start the development server:
```bash
npm run server
```

The server will be available at `http://localhost:3001`

### Available Scripts

- `npm run server` - Start development server with hot reload
- `npm run server:build` - Build TypeScript to JavaScript
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio GUI

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3001/docs`
- API Root: `http://localhost:3001/`
- Health Check: `http://localhost:3001/health`

## Database Schema

The database includes the following main entities:

### User Management
- **User**: User accounts with roles (ADMIN, MANAGER, CUSTOMER)

### Property Management
- **Property**: Properties and buildings
- **Unit**: Individual units within properties
- **Meter**: Utility meters (electricity, water, gas, heating)
- **MeterReading**: Meter readings over time

### Billing & Payments
- **Bill**: Monthly utility bills
- **Payment**: Payment records and transactions

### Support & Communication
- **Notification**: System notifications for users
- **SupportTicket**: Customer support tickets
- **AuditLog**: System audit trail

## API Endpoints

### Authentication (`/api/v1/auth`)

#### POST `/api/v1/auth/register`
Register a new user account.

#### POST `/api/v1/auth/login`
Authenticate and receive JWT token.

#### GET `/api/v1/auth/me`
Get current authenticated user (protected).

### Properties (`/api/v1/properties`)

#### GET `/api/v1/properties`
List all properties for the authenticated user (paginated).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

#### GET `/api/v1/properties/:id`
Get property details by ID including units and meters.

#### POST `/api/v1/properties`
Create a new property.

**Request Body:**
```json
{
  "name": "Apartment Building A",
  "address": "123 Main Street",
  "city": "Athens",
  "postalCode": "10001",
  "country": "Greece",
  "type": "BUILDING",
  "totalUnits": 12
}
```

#### POST `/api/v1/properties/:id/units`
Create a new unit for a property.

**Request Body:**
```json
{
  "unitNumber": "A101",
  "floor": 1,
  "area": 85.5,
  "bedrooms": 2,
  "bathrooms": 1,
  "isOccupied": true
}
```

### Bills (`/api/v1/bills`)

#### GET `/api/v1/bills`
List all bills for the authenticated user (paginated).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status (PENDING, PAID, OVERDUE, CANCELLED, DISPUTED)
- `propertyId` (string): Filter by property ID

#### GET `/api/v1/bills/:id`
Get bill details by ID including payments.

#### POST `/api/v1/bills`
Create a new bill (Admin/Manager only).

**Request Body:**
```json
{
  "propertyId": "clxxxx...",
  "periodStart": "2025-01-01T00:00:00Z",
  "periodEnd": "2025-01-31T23:59:59Z",
  "dueDate": "2025-02-15T23:59:59Z",
  "totalAmount": 145.50,
  "consumption": 450,
  "rate": 0.32,
  "taxes": 5.50,
  "fees": 2.00
}
```

#### GET `/api/v1/bills/stats/overview`
Get bill statistics (total, pending, paid, overdue, amounts).

### Payments (`/api/v1/payments`)

#### GET `/api/v1/payments`
List all payments for the authenticated user (paginated).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status (PENDING, COMPLETED, FAILED, REFUNDED)
- `billId` (string): Filter by bill ID

#### GET `/api/v1/payments/:id`
Get payment details by ID.

#### POST `/api/v1/payments`
Create a new payment.

**Request Body:**
```json
{
  "billId": "clxxxx...",
  "amount": 145.50,
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN123456",
  "notes": "Payment via online portal"
}
```

#### GET `/api/v1/payments/stats/overview`
Get payment statistics (total, completed, pending, failed, amounts).


**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+30 123 456 7890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "clxxxx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

#### POST `/api/v1/auth/login`
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxxxx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    }
  }
}
```

#### GET `/api/v1/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "createdAt": "2025-11-10T12:00:00.000Z"
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### User Roles

- **CUSTOMER**: Regular users with access to their own data
- **MANAGER**: Property managers with additional permissions
- **ADMIN**: Full system access

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt
- JWT authentication with configurable expiration
- Role-based access control (RBAC)
- CORS protection
- Helmet security headers
- Audit logging for all operations
- Input validation with Zod

## Database Migrations

Create a new migration:
```bash
npm run db:migrate
```

Push schema changes without creating a migration:
```bash
npm run db:push
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | 3001 |
| `HOST` | Server host | 0.0.0.0 |
| `NODE_ENV` | Environment | development |
| `LOG_LEVEL` | Logging level | info |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `API_PREFIX` | API route prefix | /api/v1 |

## Project Structure

```
server/
├── src/
│   ├── routes/         # API route handlers
│   │   └── auth.ts     # Authentication routes
│   ├── middleware/     # Custom middleware
│   │   └── auth.ts     # Authentication middleware
│   ├── services/       # Business logic services
│   ├── models/         # Database models (via Prisma)
│   ├── utils/          # Utility functions
│   │   └── auth.ts     # Auth utilities
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts    # Common types
│   └── index.ts        # Server entry point
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Future Enhancements

- Additional API endpoints for properties, bills, payments
- WebSocket support for real-time notifications
- Rate limiting and request throttling
- API versioning
- Comprehensive test suite
- Performance monitoring and metrics
- Caching layer (Redis)

## License

This project is part of the UtilityPro PWA system.
