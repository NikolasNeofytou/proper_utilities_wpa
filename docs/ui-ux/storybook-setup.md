# Storybook Setup Guide for UtilityPro PWA

## Overview

Storybook provides an isolated environment for developing, testing, and documenting UI components. This guide covers setting up Storybook for the UtilityPro design system with Greek localization support.

## Installation & Configuration

### 1. Install Storybook Dependencies

```bash
# Install Storybook CLI and core packages
npm install -D @storybook/react @storybook/react-vite @storybook/addon-essentials
npm install -D @storybook/addon-a11y @storybook/addon-docs @storybook/addon-controls
npm install -D @storybook/addon-viewport @storybook/addon-backgrounds

# Install additional addons for our use case
npm install -D @storybook/addon-measure @storybook/addon-outline
npm install -D storybook-addon-designs chromatic
```

### 2. Storybook Configuration Files

#### `.storybook/main.ts`
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    'storybook-addon-designs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    // Customize Vite config for Storybook
    return {
      ...config,
      define: {
        ...config.define,
        global: 'globalThis',
      },
    };
  },
};

export default config;
```

#### `.storybook/preview.ts`
```typescript
import type { Preview } from '@storybook/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../src/theme';
import '../src/theme/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray', value: '#f9fafb' },
        { name: 'dark', value: '#101113' },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'el',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'el', title: 'Ελληνικά' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
```

### 3. Component Story Examples

#### Button Stories (`src/components/ui/Button.stories.tsx`)
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Το βασικό στοιχείο κουμπιού με υποστήριξη για διάφορες παραλλαγές και καταστάσεις.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'],
      description: 'Η εμφάνιση του κουμπιού',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Το μέγεθος του κουμπιού',
    },
    isLoading: {
      control: 'boolean',
      description: 'Εμφανίζει κατάσταση φόρτωσης',
    },
    disabled: {
      control: 'boolean',
      description: 'Απενεργοποιεί το κουμπί',
    },
    children: {
      control: 'text',
      description: 'Το περιεχόμενο του κουμπιού',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Κύριο Κουμπί',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Δευτερεύον Κουμπί',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Περίγραμμα Κουμπί',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Αποθήκευση',
    isLoading: true,
    loadingText: 'Αποθήκευση...',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Λήψη Αρχείου',
    leftSection: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Κύριο</Button>
      <Button variant="secondary">Δευτερεύον</Button>
      <Button variant="outline">Περίγραμμα</Button>
      <Button variant="ghost">Διαφανές</Button>
      <Button variant="danger">Κίνδυνος</Button>
      <Button variant="success">Επιτυχία</Button>
    </div>
  ),
};
```

#### PropertyCard Stories (`src/components/business/PropertyCard.stories.tsx`)
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { PropertyCard } from './PropertyCard';
import type { Property } from './PropertyCard';

const mockProperty: Property = {
  id: '1',
  address: 'Πατησίων 123, Αθήνα 11251',
  type: 'apartment',
  size: 85,
  tenants: 3,
  status: 'active',
  monthlyConsumption: {
    electricity: 450,
    gas: 125,
    water: 18,
  },
  lastBillAmount: 187.45,
  lastBillDate: '2024-01-15',
  nextBillDate: '2024-02-15',
  manager: 'Μαρία Παπαδοπούλου',
};

const meta: Meta<typeof PropertyCard> = {
  title: 'Business Components/PropertyCard',
  component: PropertyCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Κάρτα εμφάνισης πληροφοριών ακινήτου με στοιχεία κατανάλωσης και χρέωσης.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    property: {
      description: 'Τα στοιχεία του ακινήτου προς εμφάνιση',
    },
    showActions: {
      control: 'boolean',
      description: 'Εμφάνιση κουμπιών ενεργειών',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    property: mockProperty,
    showActions: true,
  },
};

export const WithoutActions: Story = {
  args: {
    property: mockProperty,
    showActions: false,
  },
};

export const CommercialProperty: Story = {
  args: {
    property: {
      ...mockProperty,
      address: 'Ερμού 45, Θεσσαλονίκη 54624',
      type: 'commercial',
      size: 150,
      tenants: 0,
      status: 'active',
      monthlyConsumption: {
        electricity: 850,
        gas: 200,
        water: 35,
      },
      lastBillAmount: 324.80,
      manager: undefined,
    },
    showActions: true,
  },
};

export const PendingStatus: Story = {
  args: {
    property: {
      ...mockProperty,
      status: 'pending',
      lastBillAmount: 0,
    },
    showActions: true,
  },
};

export const MaintenanceStatus: Story = {
  args: {
    property: {
      ...mockProperty,
      status: 'maintenance',
      monthlyConsumption: {
        electricity: 0,
        gas: 0,
        water: 5,
      },
    },
    showActions: true,
  },
};

export const PropertyGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <PropertyCard property={mockProperty} />
      <PropertyCard 
        property={{
          ...mockProperty,
          id: '2',
          address: 'Κολοκοτρώνη 67, Πάτρα 26221',
          type: 'house',
          size: 120,
          tenants: 4,
          status: 'active',
        }} 
      />
      <PropertyCard 
        property={{
          ...mockProperty,
          id: '3',
          address: 'Μητροπόλεως 12, Βόλος 38221',
          type: 'commercial',
          size: 200,
          tenants: 0,
          status: 'pending',
        }} 
      />
    </div>
  ),
};
```

### 4. Documentation Pages

#### Design System Overview (`src/stories/DesignSystem.stories.mdx`)
```mdx
import { Meta } from '@storybook/addon-docs';

<Meta title="Design System/Overview" />

# UtilityPro Design System

Το σύστημα σχεδιασμού του UtilityPro παρέχει ένα συνεπές και προσβάσιμο σετ από στοιχεία UI για την ανάπτυξη εφαρμογών διαχείρισης κοινής ωφέλειας.

## Αρχές Σχεδιασμού

### Προσβασιμότητα (Accessibility)
- Συμμόρφωση με WCAG 2.1 AA
- Υποστήριξη πλοήγησης με πληκτρολόγιο
- Κατάλληλες αναλογίες αντίθεσης χρωμάτων
- Υποστήριξη screen readers

### Ελληνική Γλώσσα
- Βελτιστοποιημένη τυπογραφία για ελληνικούς χαρακτήρες
- Μορφοποίηση αριθμών και ημερομηνιών σε ελληνικό format
- Μεταφρασμένα κείμενα διεπαφής
- Υποστήριξη RTL για μελλοντική επέκταση

### Responsive Design
- Mobile-first προσέγγιση
- Ευέλικτο grid σύστημα
- Κατάλληλα touch targets για mobile συσκευές
- Προσαρμοστικές εικόνες και media

## Χρώματα

Το χρωματικό σχήμα βασίζεται στα χρώματα της ελληνικής σημαίας και παρέχει:
- Κύριο χρώμα (μπλε): #3b82f6
- Δευτερεύον χρώμα (πράσινο): #22c55e
- Γραμμή γκρι για ουδετερότητα
- Σημαντικά χρώματα για καταστάσεις (επιτυχία, προειδοποίηση, σφάλμα)

## Τυπογραφία

Χρησιμοποιούμε την γραμματοσειρά Inter για:
- Εξαιρετική αναγνωσιμότητα σε όλα τα μεγέθη
- Υποστήριξη ελληνικών χαρακτήρων
- Βελτιστοποίηση για οθόνες

## Στοιχεία

### Βασικά Στοιχεία (UI Components)
- Button: Κουμπιά με διάφορες παραλλαγές
- Card: Κάρτες για ομαδοποίηση περιεχομένου
- Input: Πεδία εισαγωγής με validation
- Badge: Ετικέτες κατάστασης και ταξινόμησης

### Επιχειρησιακά Στοιχεία (Business Components)
- PropertyCard: Εμφάνιση στοιχείων ακινήτου
- BillViewer: Προβολή λογαριασμών
- MetricCard: Μετρήσεις dashboard

### Layout Στοιχεία
- AppShell: Κύρια διάταξη εφαρμογής
- Navigation: Σύστημα πλοήγησης
- Header/Footer: Κεφαλίδες και υποσέλιδα
```

### 5. Accessibility Testing Stories

#### A11y Testing (`src/stories/Accessibility.stories.tsx`)
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Input, Card } from '../components/ui';

const meta: Meta = {
  title: 'Testing/Accessibility',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Δοκιμές προσβασιμότητας για τα στοιχεία του συστήματος.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-access',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;

export const KeyboardNavigation: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2>Πλοήγηση με Πληκτρολόγιο</h2>
      <div className="flex gap-4">
        <Button>Πρώτο Κουμπί</Button>
        <Button variant="secondary">Δεύτερο Κουμπί</Button>
        <Button variant="outline">Τρίτο Κουμπί</Button>
      </div>
      <Input label="Όνομα" placeholder="Εισάγετε το όνομά σας" />
      <Input label="Email" type="email" placeholder="example@email.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Χρησιμοποιήστε Tab για να πλοηγηθείτε μεταξύ των στοιχείων.',
      },
    },
  },
};

export const ColorContrast: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2>Δοκιμή Αντίθεσης Χρωμάτων</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="primary">Κύριο Κουμπί</Button>
        <Button variant="secondary">Δευτερεύον Κουμπί</Button>
        <Button variant="success">Επιτυχία</Button>
        <Button variant="danger">Κίνδυνος</Button>
      </div>
    </div>
  ),
};

export const ScreenReaderContent: StoryObj = {
  render: () => (
    <Card>
      <h2 id="billing-section">Λογαριασμοί Ρεύματος</h2>
      <div aria-labelledby="billing-section">
        <p>Εκκρεμείς λογαριασμοί: 2</p>
        <Button aria-describedby="pay-help">Πληρωμή Λογαριασμών</Button>
        <div id="pay-help" className="sr-only">
          Θα ανακατευθυνθείτε στην σελίδα πληρωμών
        </div>
      </div>
    </Card>
  ),
};
```

### 6. Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "storybook:test": "test-storybook",
    "chromatic": "chromatic --project-token=your-project-token"
  }
}
```

### 7. GitHub Actions for Visual Testing

#### `.github/workflows/chromatic.yml`
```yaml
name: Chromatic Visual Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  chromatic-deployment:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
```

## Usage Guidelines

### 1. Writing Stories
- Use Greek language in story names and descriptions
- Include accessibility testing in your stories
- Provide multiple variants and edge cases
- Document component props thoroughly

### 2. Documentation
- Write component descriptions in Greek
- Include usage examples and best practices
- Document accessibility requirements
- Provide design guidelines and rationale

### 3. Testing
- Test keyboard navigation paths
- Verify color contrast ratios
- Check screen reader compatibility
- Validate responsive behavior

### 4. Maintenance
- Keep stories updated with component changes
- Review accessibility compliance regularly
- Update documentation as features evolve
- Monitor visual regression tests

## Benefits

1. **Component Documentation**: Centralized documentation for all UI components
2. **Design Review**: Visual testing and approval process
3. **Accessibility Testing**: Automated a11y compliance checking
4. **Cross-browser Testing**: Consistent behavior across browsers
5. **Team Collaboration**: Shared component library for designers and developers
6. **Quality Assurance**: Visual regression testing prevents UI bugs

This Storybook setup provides a comprehensive environment for developing, documenting, and testing the UtilityPro design system with proper Greek localization and accessibility support.