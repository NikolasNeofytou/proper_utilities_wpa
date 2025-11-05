# Phase 2 Implementation Guide: Core Infrastructure & Development Environment

## Overview

Phase 2 establishes the technical foundation for the UtilityPro PWA, setting up modern development tools, build processes, and core application structure. This phase is critical for maintainable, scalable development.

---

## 2.1 Development Environment Setup

### Project Structure Enhancement

```
proper_utilities_wpa/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── chromatic.yml
│       └── deploy.yml
├── .vscode/
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
├── docs/ (existing)
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/ (existing)
│   ├── theme/ (existing)
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── pages/
│   ├── layouts/
│   └── App.tsx
├── tests/
│   ├── __mocks__/
│   ├── setup.ts
│   └── utils/
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── commitlint.config.js
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### Core Dependencies Installation

```bash
# Core React & TypeScript
npm install react@^18.2.0 react-dom@^18.2.0
npm install -D typescript@^5.2.0 @types/react@^18.2.0 @types/react-dom@^18.2.0

# Build Tools
npm install -D vite@^4.4.0 @vitejs/plugin-react@^4.0.0
npm install -D @types/node

# UI Framework & Icons
npm install @mantine/core@^7.0.0 @mantine/hooks@^7.0.0 @mantine/notifications@^7.0.0
npm install @mantine/form@^7.0.0 @mantine/dates@^7.0.0 @mantine/charts@^7.0.0
npm install @tabler/icons-react@^2.40.0

# State Management
npm install zustand@^4.4.0
npm install @tanstack/react-query@^4.32.0 @tanstack/react-query-devtools@^4.32.0

# Routing
npm install react-router-dom@^6.15.0
npm install -D @types/react-router-dom

# Forms & Validation
npm install react-hook-form@^7.45.0 @hookform/resolvers@^3.2.0
npm install zod@^3.22.0

# HTTP Client
npm install axios@^1.5.0

# Date & Internationalization
npm install date-fns@^2.30.0 date-fns-tz@^2.0.0
npm install react-i18next@^13.2.0 i18next@^23.4.0

# PWA & Service Worker
npm install workbox-window@^7.0.0
npm install -D vite-plugin-pwa@^0.16.0 workbox-webpack-plugin@^7.0.0

# Testing
npm install -D vitest@^0.34.0 @vitest/ui@^0.34.0
npm install -D @testing-library/react@^13.4.0 @testing-library/jest-dom@^6.1.0
npm install -D @testing-library/user-event@^14.4.0
npm install -D jsdom@^22.1.0

# Code Quality
npm install -D eslint@^8.47.0 @typescript-eslint/eslint-plugin@^6.4.0
npm install -D @typescript-eslint/parser@^6.4.0 eslint-plugin-react@^7.33.0
npm install -D eslint-plugin-react-hooks@^4.6.0 eslint-plugin-jsx-a11y@^6.7.0
npm install -D prettier@^3.0.0 eslint-config-prettier@^9.0.0
npm install -D husky@^8.0.0 lint-staged@^14.0.0
npm install -D @commitlint/cli@^17.7.0 @commitlint/config-conventional@^17.7.0

# Development Tools
npm install -D @storybook/react@^7.4.0 @storybook/react-vite@^7.4.0
npm install -D chromatic@^6.20.0
```

### Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.utilityproapp\.gr\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'UtilityPro - Διαχείριση Κοινής Ωφέλειας',
        short_name: 'UtilityPro',
        description: 'Σύγχρονη πλατφόρμα διαχείρισης λογαριασμών και ακινήτων',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mantine: ['@mantine/core', '@mantine/hooks'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@theme/*": ["./src/theme/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint Configuration (`.eslintrc.js`)

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
  },
};
```

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 2.2 Testing Framework Setup

### Vitest Configuration (`vitest.config.ts`)

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.stories.tsx',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/types/',
        'vite.config.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
});
```

### Test Setup (`tests/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Setup and teardown for MSW (Mock Service Worker)
beforeAll(() => {
  // Setup MSW server
});

afterAll(() => {
  // Cleanup MSW server
});
```

### Test Utilities (`tests/utils/test-utils.tsx`)

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@theme';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 2.3 State Management Setup

### Zustand Store Structure

#### Authentication Store (`src/stores/authStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'manager';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'el' | 'en';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // API call will be implemented in Phase 3
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Σφάλμα σύνδεσης');
          }

          const { user, token } = await response.json();
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Άγνωστο σφάλμα',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

#### UI Store (`src/stores/uiStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'el' | 'en';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (language: 'el' | 'en') => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // State
      sidebarCollapsed: false,
      theme: 'light',
      language: 'el',
      notifications: [],

      // Actions
      toggleSidebar: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.setAttribute('data-mantine-color-scheme', 'dark');
        } else if (theme === 'light') {
          root.setAttribute('data-mantine-color-scheme', 'light');
        } else {
          // Auto theme - check system preference
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.setAttribute('data-mantine-color-scheme', isDark ? 'dark' : 'light');
        }
      },

      setLanguage: (language: 'el' | 'en') => {
        set({ language });
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = {
          ...notification,
          id,
          timestamp: new Date(),
        };
        
        set({
          notifications: [...get().notifications, newNotification],
        });

        // Auto remove after 5 seconds for non-error notifications
        if (notification.type !== 'error') {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },

      removeNotification: (id: string) => {
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
```

---

## 2.4 Routing Setup

### Router Configuration (`src/App.tsx`)

```typescript
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Notifications } from '@mantine/notifications';

import { theme } from '@theme';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';

// Layout Components
import { AuthLayout } from '@components/layout/AuthLayout';
import { CustomerLayout } from '@components/layout/CustomerLayout';
import { AdminLayout } from '@components/layout/AdminLayout';

// Page Components - will be created in subsequent phases
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { DashboardPage } from '@pages/customer/DashboardPage';
import { PropertiesPage } from '@pages/customer/PropertiesPage';
import { BillsPage } from '@pages/customer/BillsPage';
import { AdminDashboardPage } from '@pages/admin/DashboardPage';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorBoundary } from '@components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
      case 'manager':
        return <Navigate to="/admin/dashboard" replace />;
      case 'customer':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  const { setTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme on app start
    setTheme('light');
  }, [setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ErrorBoundary>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <AuthLayout>
                        <LoginPage />
                      </AuthLayout>
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <AuthLayout>
                        <RegisterPage />
                      </AuthLayout>
                    </PublicRoute>
                  }
                />

                {/* Customer Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerLayout>
                        <DashboardPage />
                      </CustomerLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/properties"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerLayout>
                        <PropertiesPage />
                      </CustomerLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bills/*"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerLayout>
                        <BillsPage />
                      </CustomerLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'manager']}>
                      <AdminLayout>
                        <AdminDashboardPage />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Default Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/unauthorized" element={<div>Μη εξουσιοδοτημένη πρόσβαση</div>} />
                <Route path="*" element={<div>Η σελίδα δε βρέθηκε</div>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 2.5 GitHub Actions CI/CD

### Main CI Pipeline (`.github/workflows/ci.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Test & Quality Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests with coverage
        run: npm run test:coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage/coverage-final.json
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Run accessibility tests
        run: npm run test:a11y
        continue-on-error: true

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security audit
        run: npm audit --audit-level moderate
        continue-on-error: true
      
      - name: Run dependency check
        uses: actions/dependency-check-action@main
        with:
          project: 'UtilityPro'
          path: '.'
          format: 'HTML'

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for staging
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}
          VITE_APP_ENV: staging
      
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          echo "Deploying to staging..."
          # Add actual deployment commands here

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for production
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}
          VITE_APP_ENV: production
      
      - name: Deploy to production
        run: |
          # Deploy to production environment
          echo "Deploying to production..."
          # Add actual deployment commands here
```

---

## Next Steps

With Phase 2 complete, you'll have:

1. ✅ **Modern Development Environment** - Vite, TypeScript, React 18
2. ✅ **Code Quality Tools** - ESLint, Prettier, Husky, Commitizen
3. ✅ **Testing Framework** - Vitest, Testing Library, MSW
4. ✅ **State Management** - Zustand stores for auth and UI
5. ✅ **Routing System** - Protected routes based on user roles
6. ✅ **PWA Foundation** - Service worker, manifest, offline capabilities
7. ✅ **CI/CD Pipeline** - Automated testing, linting, security, deployment

**Ready for Phase 3:** Authentication & User Management implementation with backend API development.

Would you like me to continue with Phase 3 implementation details, or would you prefer to focus on implementing Phase 2 first?