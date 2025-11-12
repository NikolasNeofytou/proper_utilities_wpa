// Export all API services
export * from './client';
export * from './auth';
export * from './properties';
export * from './bills';
export * from './payments';
export type { AdminStats, CreateUserRequest, UsersListResponse } from './admin';

// Export service instances
export { authService } from './auth';
export { propertyService } from './properties';
export { billService } from './bills';
export { paymentService } from './payments';
export { adminService } from './admin';

// Re-export specific types to avoid conflicts
export type { User } from './auth';
