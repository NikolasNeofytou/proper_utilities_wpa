# Frontend API Services

This directory contains the frontend API service layer that communicates with the backend API.

## Structure

```
src/services/api/
├── client.ts       # API client with authentication
├── auth.ts         # Authentication services
├── properties.ts   # Property management services
├── bills.ts        # Billing services
├── payments.ts     # Payment services
└── index.ts        # Exports all services
```

## API Client

The API client (`client.ts`) provides a centralized way to make HTTP requests to the backend API.

### Features

- **Token Management**: Automatically handles JWT tokens in localStorage
- **Request Interceptor**: Adds authentication headers to all requests
- **Error Handling**: Consistent error handling across all requests
- **TypeScript**: Fully typed responses and requests

### Usage

```typescript
import { apiClient } from '@/services/api/client';

// Get request
const response = await apiClient.get<User>('/auth/me');

// Post request
const response = await apiClient.post<LoginResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});
```

## Services

### Authentication Service

```typescript
import { authService } from '@/services/api';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

if (response.success && response.data) {
  console.log('Token:', response.data.token);
  console.log('User:', response.data.user);
}

// Register
const response = await authService.register({
  email: 'user@example.com',
  password: 'SecurePassword123',
  firstName: 'John',
  lastName: 'Doe',
});

// Get current user
const response = await authService.getCurrentUser();

// Logout
authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### Property Service

```typescript
import { propertyService } from '@/services/api';

// Get all properties (paginated)
const response = await propertyService.getProperties(1, 10);

if (response.success && response.data) {
  console.log('Properties:', response.data.items);
  console.log('Total:', response.data.total);
  console.log('Pages:', response.data.totalPages);
}

// Get single property
const response = await propertyService.getProperty('property-id');

// Create property
const response = await propertyService.createProperty({
  name: 'Apartment Building A',
  address: '123 Main Street',
  city: 'Athens',
  postalCode: '10001',
  type: 'BUILDING',
  totalUnits: 12,
});

// Create unit
const response = await propertyService.createUnit('property-id', {
  unitNumber: 'A101',
  floor: 1,
  area: 85.5,
  bedrooms: 2,
  bathrooms: 1,
  isOccupied: true,
});
```

### Bill Service

```typescript
import { billService } from '@/services/api';

// Get all bills (paginated, filtered)
const response = await billService.getBills(1, 10, 'PENDING', 'property-id');

// Get single bill
const response = await billService.getBill('bill-id');

// Create bill (Admin/Manager only)
const response = await billService.createBill({
  propertyId: 'property-id',
  periodStart: '2025-01-01T00:00:00Z',
  periodEnd: '2025-01-31T23:59:59Z',
  dueDate: '2025-02-15T23:59:59Z',
  totalAmount: 145.50,
  consumption: 450,
  rate: 0.32,
  taxes: 5.50,
  fees: 2.00,
});

// Get bill statistics
const response = await billService.getBillStats();

if (response.success && response.data) {
  console.log('Total bills:', response.data.total);
  console.log('Pending:', response.data.pending);
  console.log('Paid:', response.data.paid);
  console.log('Total amount:', response.data.totalAmount);
}
```

### Payment Service

```typescript
import { paymentService } from '@/services/api';

// Get all payments (paginated, filtered)
const response = await paymentService.getPayments(1, 10, 'COMPLETED', 'bill-id');

// Get single payment
const response = await paymentService.getPayment('payment-id');

// Create payment
const response = await paymentService.createPayment({
  billId: 'bill-id',
  amount: 145.50,
  paymentMethod: 'CREDIT_CARD',
  transactionId: 'TXN123456',
  notes: 'Payment via online portal',
});

// Get payment statistics
const response = await paymentService.getPaymentStats();

if (response.success && response.data) {
  console.log('Total payments:', response.data.total);
  console.log('Completed:', response.data.completed);
  console.log('Total amount:', response.data.totalAmount);
}
```

## TypeScript Types

All services are fully typed. Import types as needed:

```typescript
import type {
  User,
  LoginRequest,
  Property,
  Bill,
  Payment,
  APIResponse,
  PaginatedResponse,
} from '@/services/api';
```

## Error Handling

All API calls return an `APIResponse<T>` type:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

Handle errors consistently:

```typescript
const response = await authService.login(credentials);

if (response.success && response.data) {
  // Handle success
  console.log('User:', response.data.user);
} else {
  // Handle error
  console.error('Error:', response.error);
  console.error('Message:', response.message);
}
```

## Configuration

Set the API base URL in your `.env` file:

```bash
VITE_API_URL=http://localhost:3001/api/v1
```

If not set, it defaults to `http://localhost:3001/api/v1`.

## Authentication Flow

1. User logs in via `authService.login()`
2. Token is automatically stored in localStorage
3. Token is automatically included in all subsequent requests
4. Use `authService.logout()` to clear the token
5. Use `authService.isAuthenticated()` to check auth status

## Pagination

All list endpoints support pagination:

```typescript
// Parameters: page (default: 1), limit (default: 10, max: 100)
const response = await billService.getBills(2, 20);

if (response.success && response.data) {
  const { items, total, page, limit, totalPages } = response.data;
  
  console.log(`Page ${page} of ${totalPages}`);
  console.log(`Showing ${items.length} of ${total} items`);
}
```

## Filtering

List endpoints support various filters:

```typescript
// Bills - filter by status and property
await billService.getBills(1, 10, 'PENDING', 'property-id');

// Payments - filter by status and bill
await paymentService.getPayments(1, 10, 'COMPLETED', 'bill-id');
```

## Best Practices

1. **Always check `response.success`** before accessing `response.data`
2. **Handle errors gracefully** - display user-friendly messages
3. **Use TypeScript types** for better type safety
4. **Don't store sensitive data** in localStorage except the JWT token
5. **Clear token on logout** using `authService.logout()`
6. **Check authentication status** before making protected requests
