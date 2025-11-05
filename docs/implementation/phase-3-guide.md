# Phase 3 Implementation Guide: Authentication & User Management

## Overview

Phase 3 establishes secure user authentication, role-based access control, and user profile management. This includes both backend API development with Fastify and PostgreSQL, and frontend authentication flows.

---

## 3.1 Backend API Foundation

### Project Structure for Backend

```
server/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── profile.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── cors.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── profile.model.ts
│   │   └── session.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── email.service.ts
│   │   └── token.service.ts
│   ├── utils/
│   │   ├── password.util.ts
│   │   ├── validation.util.ts
│   │   ├── logger.util.ts
│   │   └── response.util.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── common.types.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── integration/
│   ├── unit/
│   └── setup.ts
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Backend Dependencies Installation

```bash
# Navigate to server directory
mkdir server && cd server

# Core Fastify & TypeScript
npm init -y
npm install fastify@^4.24.0 @fastify/cors@^8.4.0 @fastify/helmet@^11.1.0
npm install @fastify/jwt@^7.2.0 @fastify/rate-limit@^9.1.0 @fastify/multipart@^8.0.0
npm install -D typescript@^5.2.0 @types/node@^20.8.0 ts-node@^10.9.0
npm install -D nodemon@^3.0.0 concurrently@^8.2.0

# Database & ORM
npm install prisma@^5.4.0 @prisma/client@^5.4.0
npm install -D prisma-dbml-generator@^0.10.0

# Validation & Security
npm install zod@^3.22.0 bcryptjs@^2.4.3 @types/bcryptjs@^2.4.4
npm install argon2@^0.31.0 nanoid@^4.0.0

# Email & Communication
npm install nodemailer@^6.9.0 @types/nodemailer@^6.4.11
npm install @sendgrid/mail@^7.7.0

# Testing
npm install -D vitest@^0.34.0 @vitest/ui@^0.34.0
npm install -D supertest@^6.3.0 @types/supertest@^2.0.15

# Utilities
npm install dotenv@^16.3.0 winston@^3.10.0 helmet@^7.0.0
npm install dayjs@^1.11.0 uuid@^9.0.0 @types/uuid@^9.0.5
```

### Prisma Database Schema (`server/prisma/schema.prisma`)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

generator dbml {
  provider = "prisma-dbml-generator"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(CUSTOMER)
  status    UserStatus @default(ACTIVE)
  
  // Profile Information
  firstName String
  lastName  String
  phone     String?
  avatar    String?
  
  // Preferences
  language  Language @default(GREEK)
  timezone  String   @default("Europe/Athens")
  
  // Security
  emailVerified    Boolean   @default(false)
  emailVerifiedAt  DateTime?
  lastLoginAt      DateTime?
  passwordChangedAt DateTime @default(now())
  
  // Relationships
  profile       UserProfile?
  sessions      UserSession[]
  properties    Property[]
  bills         Bill[]
  payments      Payment[]
  notifications Notification[]
  
  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@map("users")
}

model UserProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Address Information
  address     String?
  city        String?
  postalCode  String?
  region      String?
  country     String @default("GR")
  
  // Additional Info
  dateOfBirth DateTime?
  gender      Gender?
  occupation  String?
  
  // Preferences
  notifications Json @default("{}")
  privacy       Json @default("{}")
  
  // Marketing
  marketingConsent Boolean @default(false)
  marketingConsentAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("user_profiles")
}

model UserSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Session Data
  token     String   @unique
  refreshToken String? @unique
  
  // Device Information
  deviceId  String?
  userAgent String?
  ipAddress String?
  location  String?
  
  // Session Management
  expiresAt DateTime
  revokedAt DateTime?
  lastUsedAt DateTime @default(now())
  
  createdAt DateTime @default(now())

  @@map("user_sessions")
}

// Properties & Assets
model Property {
  id      String       @id @default(cuid())
  ownerId String
  owner   User         @relation(fields: [ownerId], references: [id])
  
  // Property Details
  address     String
  city        String
  postalCode  String
  region      String
  country     String @default("GR")
  
  type        PropertyType
  size        Float // Square meters
  floors      Int?
  rooms       Int?
  
  // Utility Information
  electricityMeter String?
  gasMeter        String?
  waterMeter      String?
  
  // Management
  managerId   String?
  
  status      PropertyStatus @default(ACTIVE)
  occupancy   Int @default(1) // Number of occupants
  
  // Relationships
  bills       Bill[]
  payments    Payment[]
  meters      Meter[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@map("properties")
}

model Meter {
  id         String     @id @default(cuid())
  propertyId String
  property   Property   @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  // Meter Information
  serialNumber String    @unique
  type         MeterType
  manufacturer String?
  model        String?
  installDate  DateTime?
  
  // Readings
  readings     MeterReading[]
  
  // Status
  status       MeterStatus @default(ACTIVE)
  lastReading  Float?
  lastReadingDate DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("meters")
}

model MeterReading {
  id      String @id @default(cuid())
  meterId String
  meter   Meter  @relation(fields: [meterId], references: [id], onDelete: Cascade)
  
  // Reading Data
  reading   Float
  readingDate DateTime
  
  // Reading Method
  method    ReadingMethod @default(MANUAL)
  readBy    String? // User ID who took the reading
  
  // Validation
  validated Boolean @default(false)
  validatedBy String?
  validatedAt DateTime?
  
  // Notes
  notes     String?
  photos    String[] // Array of photo URLs
  
  createdAt DateTime @default(now())

  @@map("meter_readings")
}

// Billing & Payments
model Bill {
  id         String @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  
  customerId String
  customer   User   @relation(fields: [customerId], references: [id])
  
  // Bill Information
  billNumber String @unique
  type       BillType
  
  // Period
  periodStart DateTime
  periodEnd   DateTime
  
  // Consumption
  previousReading Float
  currentReading  Float
  consumption     Float
  unit           ConsumptionUnit @default(KWH)
  
  // Charges (in cents to avoid floating point issues)
  baseCharge        Int // Base/fixed charges
  consumptionCharge Int // Variable charges
  taxes             Int // All taxes combined
  fees              Int // Additional fees
  discount          Int @default(0)
  totalAmount       Int // Total amount in cents
  
  // Status & Dates
  status      BillStatus @default(PENDING)
  issueDate   DateTime   @default(now())
  dueDate     DateTime
  paidDate    DateTime?
  
  // Relationships
  payments    Payment[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("bills")
}

model Payment {
  id         String @id @default(cuid())
  billId     String?
  bill       Bill?  @relation(fields: [billId], references: [id])
  
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  
  customerId String
  customer   User   @relation(fields: [customerId], references: [id])
  
  // Payment Information
  amount          Int // Amount in cents
  currency        String @default("EUR")
  method          PaymentMethod
  
  // External References
  transactionId   String? @unique
  providerRef     String? // Reference from payment provider
  
  // Status
  status          PaymentStatus @default(PENDING)
  
  // Processing
  processedAt     DateTime?
  confirmedAt     DateTime?
  failedAt        DateTime?
  
  // Metadata
  metadata        Json @default("{}")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("payments")
}

// Notifications
model Notification {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Notification Content
  type    NotificationType
  title   String
  message String
  
  // Delivery
  channels Json @default("[]") // Array of channels: email, sms, push, in_app
  
  // Status
  status     NotificationStatus @default(PENDING)
  readAt     DateTime?
  
  // Scheduling
  scheduledAt DateTime?
  sentAt      DateTime?
  
  // Metadata
  metadata   Json @default("{}")
  
  createdAt DateTime @default(now())

  @@map("notifications")
}

// Enums
enum UserRole {
  CUSTOMER
  MANAGER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

enum Language {
  GREEK
  ENGLISH
}

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum PropertyType {
  APARTMENT
  HOUSE
  COMMERCIAL
  INDUSTRIAL
  OFFICE
}

enum PropertyStatus {
  ACTIVE
  INACTIVE
  UNDER_CONSTRUCTION
  MAINTENANCE
}

enum MeterType {
  ELECTRICITY
  GAS
  WATER
}

enum MeterStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  FAULTY
}

enum ReadingMethod {
  MANUAL
  AUTOMATIC
  ESTIMATED
  PHOTO
}

enum BillType {
  ELECTRICITY
  GAS
  WATER
  COMBINED
}

enum ConsumptionUnit {
  KWH  // Kilowatt hours
  M3   // Cubic meters
  L    // Liters
}

enum BillStatus {
  DRAFT
  PENDING
  SENT
  PAID
  OVERDUE
  CANCELLED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
  PAYPAL
  STRIPE
  CASH
  CHECK
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}

enum NotificationType {
  BILL_GENERATED
  BILL_DUE
  PAYMENT_RECEIVED
  PAYMENT_FAILED
  METER_READING
  MAINTENANCE
  SYSTEM_UPDATE
  MARKETING
}

enum NotificationStatus {
  PENDING
  SENT
  DELIVERED
  READ
  FAILED
}
```

This completes the foundation for Phase 3. The implementation includes:

1. ✅ **Complete Database Schema** - Users, profiles, sessions, properties, billing
2. ✅ **Backend Project Structure** - Organized, scalable architecture
3. ✅ **Modern Tech Stack** - Fastify, Prisma, TypeScript, PostgreSQL
4. ✅ **Security First** - Proper validation, rate limiting, security headers

**Next Steps:** Implementation of authentication services, middleware, controllers, and frontend integration.

Would you like me to continue with the remaining Phase 3 implementation details (authentication services, controllers, frontend components) or move on to explore Phase 4?