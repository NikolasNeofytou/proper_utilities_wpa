# UI/UX Design System & Component Library Plan

## Design System Overview

Our design system is built around accessibility, consistency, and modern aesthetics while respecting Greek cultural preferences. The system supports both customer-facing and administrative interfaces with a cohesive visual language.

## Component Library Decision: Mantine

After careful evaluation of modern React component libraries, **Mantine v7** has been selected as our primary UI library.

### Rationale for Mantine Selection

#### Technical Advantages
```typescript
// Mantine Benefits Assessment
{
  "components": {
    "count": "120+ components",
    "quality": "Production-ready with extensive testing",
    "customization": "Highly customizable with Styles API",
    "accessibility": "Built-in WCAG 2.1 AA compliance"
  },
  "developer_experience": {
    "typescript": "Full TypeScript support",
    "hooks": "70+ utility hooks included",
    "documentation": "Comprehensive with live examples",
    "performance": "CSS-in-CSS for zero runtime overhead"
  },
  "ecosystem": {
    "extensions": "Rich text editor, notifications, spotlight, carousel",
    "form_library": "@mantine/form for seamless integration",
    "dates": "@mantine/dates for date/time handling",
    "charts": "Integration with popular chart libraries"
  }
}
```

#### Comparison with Alternatives

| Feature | Mantine | shadcn/ui | React Spectrum | Material-UI |
|---------|---------|-----------|----------------|-------------|
| Components | 120+ | 30+ | 50+ | 100+ |
| Customization | Excellent | Excellent | Good | Good |
| Bundle Size | Medium | Small | Large | Large |
| TypeScript | Excellent | Excellent | Excellent | Good |
| Accessibility | Built-in | Built-in | Excellent | Good |
| Learning Curve | Easy | Medium | Medium | Easy |
| Maintenance | Active | Community | Adobe | Google |
| Greek Support | Full | Full | Limited | Full |

### Mantine Stack Configuration
```typescript
// Package Selection
{
  "core": "@mantine/core",           // Core components and theme
  "hooks": "@mantine/hooks",         // Utility hooks
  "form": "@mantine/form",           // Form management
  "dates": "@mantine/dates",         // Date/time components
  "notifications": "@mantine/notifications", // Toast notifications
  "modals": "@mantine/modals",       // Modal management
  "spotlight": "@mantine/spotlight", // Command palette
  "carousel": "@mantine/carousel",   // Image/content carousel
  "rte": "@mantine/tiptap",          // Rich text editor
  "charts": "@mantine/charts"        // Data visualization
}
```

## Design Tokens

### Color System
```css
/* Primary Brand Colors */
:root {
  /* Primary - Professional Blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;  /* Main brand color */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  
  /* Secondary - Energy Green */
  --color-secondary-50: #f0fdf4;
  --color-secondary-100: #dcfce7;
  --color-secondary-200: #bbf7d0;
  --color-secondary-300: #86efac;
  --color-secondary-400: #4ade80;
  --color-secondary-500: #22c55e;  /* Secondary brand color */
  --color-secondary-600: #16a34a;
  --color-secondary-700: #15803d;
  --color-secondary-800: #166534;
  --color-secondary-900: #14532d;
  
  /* Utility Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Semantic Colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  
  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-tertiary: #9ca3af;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1f2937;
    --color-bg-secondary: #111827;
    --color-bg-tertiary: #0f172a;
    
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-text-tertiary: #6b7280;
  }
}
```

### Typography Scale
```css
/* Font Families */
:root {
  /* Greek-optimized font stack */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  --font-family-mono: 'Fira Code', 'Monaco', 'Consolas', 'Ubuntu Mono', monospace;
  
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
}
```

### Spacing System
```css
/* 8px Grid System */
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
  --spacing-20: 5rem;    /* 80px */
  --spacing-24: 6rem;    /* 96px */
  
  /* Component Specific Spacing */
  --spacing-component-xs: var(--spacing-2);
  --spacing-component-sm: var(--spacing-3);
  --spacing-component-md: var(--spacing-4);
  --spacing-component-lg: var(--spacing-6);
  --spacing-component-xl: var(--spacing-8);
}
```

## Component Library Structure

### Core Components

#### 1. Layout Components
```typescript
// Layout system components
interface LayoutComponents {
  AppShell: {
    header: MantineHeader;
    navbar: MantineNavbar;
    aside: MantineAside;
    footer: MantineFooter;
    main: MantineMain;
  };
  
  Container: {
    sizes: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fluid: boolean;
    responsive: boolean;
  };
  
  Grid: {
    columns: number;
    gutter: ResponsiveSize;
    breakpoints: Breakpoint[];
  };
  
  Stack: {
    spacing: ResponsiveSize;
    align: 'stretch' | 'start' | 'center' | 'end';
  };
  
  Group: {
    spacing: ResponsiveSize;
    position: 'left' | 'center' | 'right' | 'apart';
  };
}

// Custom layout components for our domain
interface CustomLayoutComponents {
  DashboardLayout: {
    sidebar: boolean;
    breadcrumbs: boolean;
    notifications: boolean;
  };
  
  PropertyLayout: {
    propertySelector: boolean;
    unitGrid: boolean;
    quickActions: boolean;
  };
  
  BillingLayout: {
    periodSelector: boolean;
    summaryCards: boolean;
    actionPanel: boolean;
  };
}
```

#### 2. Form Components
```typescript
interface FormComponents {
  // Basic inputs
  TextInput: MantineTextInput & {
    validation: ValidationRule[];
    formatting: InputFormatter;
  };
  
  NumberInput: MantineNumberInput & {
    currency: boolean;
    percentage: boolean;
    units: string;
  };
  
  Select: MantineSelect & {
    searchable: boolean;
    clearable: boolean;
    multiSelect: boolean;
    asyncData: boolean;
  };
  
  DateInput: MantineDateInput & {
    locale: 'en' | 'el';
    timeZone: string;
    businessDays: boolean;
  };
  
  // Specialized inputs
  AddressInput: {
    streetValidation: boolean;
    postcodeValidation: boolean;
    googleMapsIntegration: boolean;
  };
  
  PhoneInput: {
    countryCode: string;
    validation: PhoneValidation;
    formatting: PhoneFormatter;
  };
  
  MeterReadingInput: {
    photoCapture: boolean;
    ocrValidation: boolean;
    previousReading: number;
  };
  
  PaymentMethodInput: {
    cardValidation: boolean;
    bankAccountValidation: boolean;
    secureTokenization: boolean;
  };
}
```

#### 3. Data Display Components
```typescript
interface DataDisplayComponents {
  // Tables and lists
  DataTable: {
    sorting: boolean;
    filtering: boolean;
    pagination: boolean;
    selection: boolean;
    export: ExportOptions[];
    virtualization: boolean;
  };
  
  PropertyGrid: {
    unitCards: UnitCard[];
    occupancyStatus: OccupancyIndicator;
    quickActions: QuickAction[];
  };
  
  BillSummary: {
    charges: ChargeBreakdown;
    consumption: ConsumptionChart;
    payments: PaymentHistory;
  };
  
  // Charts and analytics
  UsageChart: {
    timeRange: TimeRangeSelector;
    chartTypes: ('line' | 'bar' | 'area')[];
    comparison: ComparisonOptions;
  };
  
  RevenueChart: {
    aggregation: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    breakdown: 'property' | 'utility' | 'payment_method';
    forecasting: boolean;
  };
  
  KPIDashboard: {
    metrics: KPIMetric[];
    alerts: KPIAlert[];
    trends: TrendIndicator[];
  };
}
```

#### 4. Navigation Components
```typescript
interface NavigationComponents {
  MainNavigation: {
    userRole: UserRole;
    permissions: Permission[];
    breadcrumbs: boolean;
    search: boolean;
  };
  
  PropertySelector: {
    currentProperty: Property;
    availableProperties: Property[];
    quickSwitch: boolean;
  };
  
  BillingPeriodSelector: {
    currentPeriod: BillingPeriod;
    availablePeriods: BillingPeriod[];
    customRange: boolean;
  };
  
  QuickActions: {
    contextual: boolean;
    userRole: UserRole;
    shortcuts: Shortcut[];
  };
}
```

### Business-Specific Components

#### 1. Property Management
```typescript
interface PropertyComponents {
  PropertyCard: {
    basicInfo: PropertyBasicInfo;
    occupancyRate: number;
    revenueMetrics: RevenueMetrics;
    alerts: PropertyAlert[];
    quickActions: PropertyAction[];
  };
  
  UnitCard: {
    unitInfo: UnitInfo;
    occupancyStatus: OccupancyStatus;
    currentBill: BillSummary;
    lastPayment: PaymentSummary;
    alerts: UnitAlert[];
  };
  
  PropertyWizard: {
    steps: WizardStep[];
    validation: StepValidation[];
    persistence: AutoSave;
  };
  
  UnitEditor: {
    basicInfo: UnitBasicInfoForm;
    utilities: UtilityConnectionForm;
    occupancy: OccupancyForm;
    billing: BillingConfigForm;
  };
}
```

#### 2. Billing & Payments
```typescript
interface BillingComponents {
  BillGenerator: {
    formulaSelector: BillingFormulaSelector;
    periodSelector: BillingPeriodSelector;
    unitSelection: UnitSelectionGrid;
    previewPanel: BillPreviewPanel;
    executionStatus: ExecutionStatusTracker;
  };
  
  BillViewer: {
    billHeader: BillHeaderInfo;
    chargeBreakdown: ChargeBreakdownTable;
    consumptionChart: ConsumptionVisualization;
    paymentOptions: PaymentOptionsList;
    documents: DocumentDownloadPanel;
  };
  
  PaymentProcessor: {
    methodSelector: PaymentMethodSelector;
    amountInput: PaymentAmountInput;
    scheduleOptions: PaymentScheduleOptions;
    securityVerification: SecurityVerificationStep;
    confirmationScreen: PaymentConfirmation;
  };
  
  FormulaBuilder: {
    componentSelector: FormulaComponentSelector;
    rateEditor: RateEditorForm;
    calculationPreview: CalculationPreviewPanel;
    testRunner: FormulaTestRunner;
    versionControl: FormulaVersionControl;
  };
}
```

#### 3. Analytics & Reporting
```typescript
interface AnalyticsComponents {
  ReportBuilder: {
    dataSource: DataSourceSelector;
    dimensions: DimensionSelector;
    measures: MeasureSelector;
    filters: FilterBuilder;
    visualization: VisualizationOptions;
  };
  
  DashboardWidget: {
    widgetType: WidgetType;
    configuration: WidgetConfig;
    dataBinding: DataBinding;
    refreshSettings: RefreshSettings;
  };
  
  MetricsGrid: {
    kpis: KPIGrid;
    trendIndicators: TrendIndicatorGrid;
    alerts: AlertsGrid;
    comparisons: ComparisonGrid;
  };
}
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
```typescript
interface AccessibilityStandards {
  colorContrast: {
    normalText: 4.5; // minimum ratio
    largeText: 3.0;   // minimum ratio
    nonText: 3.0;     // UI elements
  };
  
  keyboardNavigation: {
    tabOrder: 'logical';
    focusIndicators: 'visible';
    skipLinks: 'provided';
    keyboardTraps: 'avoided';
  };
  
  screenReaders: {
    semanticHTML: boolean;
    ariaLabels: boolean;
    landmarks: boolean;
    headingStructure: boolean;
    altText: boolean;
  };
  
  userControl: {
    animations: 'reducible';
    autoplay: 'controllable';
    timeouts: 'extendable';
    flashing: 'limited';
  };
}
```

### Greek Language Support
```typescript
interface GreekLocalization {
  fonts: {
    primary: 'Inter'; // Excellent Greek character support
    fallback: 'system fonts with Greek support';
  };
  
  textDirection: 'ltr'; // Greek is left-to-right
  
  formatting: {
    numbers: {
      decimal: ',';      // European standard
      thousands: '.';    // European standard
      currency: '€';     // Euro symbol
    };
    dates: {
      format: 'dd/mm/yyyy'; // European format
      firstDayOfWeek: 1;    // Monday
    };
  };
  
  cultural: {
    colorAssociations: {
      success: 'green';
      warning: 'amber/orange';
      error: 'red';
      info: 'blue';
    };
    businessHours: {
      start: '08:00';
      end: '17:00';
      lunchBreak: '14:00-15:00';
    };
  };
}
```

## Component Theming System

### Mantine Theme Configuration
```typescript
// theme.ts
import { createTheme, MantineTheme } from '@mantine/core';

export const utilityProTheme: MantineTheme = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 8 },
  
  colors: {
    blue: [
      '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', 
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', 
      '#1e40af', '#1e3a8a'
    ],
    green: [
      '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', 
      '#4ade80', '#22c55e', '#16a34a', '#15803d', 
      '#166534', '#14532d'
    ],
  },
  
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Fira Code, Monaco, Consolas, Ubuntu Mono, monospace',
  
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.25rem', lineHeight: '2.5rem' },
      h2: { fontSize: '1.875rem', lineHeight: '2.25rem' },
      h3: { fontSize: '1.5rem', lineHeight: '2rem' },
      h4: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      h5: { fontSize: '1.125rem', lineHeight: '1.5rem' },
      h6: { fontSize: '1rem', lineHeight: '1.5rem' },
    },
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  breakpoints: {
    xs: '36em',   // 576px
    sm: '48em',   // 768px
    md: '62em',   // 992px
    lg: '75em',   // 1200px
    xl: '88em',   // 1408px
  },
  
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
      styles: (theme) => ({
        root: {
          fontWeight: 500,
          borderWidth: '1px',
        },
      }),
    },
    
    TextInput: {
      styles: (theme) => ({
        label: {
          fontWeight: 500,
          marginBottom: theme.spacing.xs,
        },
        input: {
          borderWidth: '1px',
          '&:focus': {
            borderColor: theme.colors.blue[6],
          },
        },
      }),
    },
    
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
        withBorder: true,
      },
    },
  },
});
```

### Custom Component Styles
```typescript
// Custom component styling with CSS Modules
interface ComponentStyles {
  // Dashboard styles
  '.dashboard-grid': {
    display: 'grid';
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))';
    gap: 'var(--spacing-6)';
  };
  
  '.metric-card': {
    backgroundColor: 'var(--color-bg-primary)';
    border: '1px solid var(--color-gray-200)';
    borderRadius: 'var(--spacing-3)';
    padding: 'var(--spacing-6)';
    transition: 'box-shadow 0.2s ease';
    
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)';
    };
  };
  
  // Form styles
  '.form-section': {
    marginBottom: 'var(--spacing-8)';
    
    '.section-title': {
      fontSize: 'var(--font-size-lg)';
      fontWeight: 'var(--font-weight-semibold)';
      marginBottom: 'var(--spacing-4)';
      color: 'var(--color-text-primary)';
    };
  };
  
  // Table styles
  '.data-table': {
    '.table-header': {
      backgroundColor: 'var(--color-bg-secondary)';
      fontWeight: 'var(--font-weight-medium)';
    };
    
    '.table-row': {
      '&:hover': {
        backgroundColor: 'var(--color-bg-tertiary)';
      };
    };
  };
}
```

## Responsive Design Strategy

### Breakpoint System
```typescript
interface ResponsiveBreakpoints {
  xs: '0px - 575px';    // Small phones
  sm: '576px - 767px';  // Large phones
  md: '768px - 991px';  // Small tablets
  lg: '992px - 1199px'; // Large tablets / Small desktops
  xl: '1200px+';        // Large desktops
}

// Component responsive behavior
interface ResponsiveBehavior {
  navigation: {
    xs: 'bottom_tabs';
    sm: 'hamburger_menu';
    md: 'sidebar_collapsed';
    lg: 'sidebar_expanded';
    xl: 'sidebar_expanded';
  };
  
  dashboard: {
    xs: 'single_column';
    sm: 'single_column';
    md: 'two_column';
    lg: 'three_column';
    xl: 'four_column';
  };
  
  tables: {
    xs: 'cards_view';
    sm: 'horizontal_scroll';
    md: 'responsive_columns';
    lg: 'full_table';
    xl: 'full_table';
  };
}
```

### Mobile-First Approach
```css
/* Mobile-first CSS approach */
.dashboard-grid {
  /* Mobile styles (default) */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Tablet and up */
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  /* Desktop and up */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

/* Touch-friendly interactive elements */
.interactive-element {
  min-height: 44px; /* iOS HIG minimum */
  min-width: 44px;
  padding: 0.75rem;
  
  @media (hover: hover) {
    &:hover {
      /* Mouse-specific hover styles */
    }
  }
  
  &:focus-visible {
    /* Keyboard focus styles */
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}
```

## Performance Optimization

### Bundle Optimization
```typescript
// Code splitting strategy for components
interface BundleOptimization {
  coreComponents: string[]; // Always loaded
  lazyComponents: {
    [route: string]: string[]; // Loaded per route
  };
  
  treeshaking: {
    mantineComponents: 'individual_imports';
    utilities: 'used_only';
    icons: 'subset_loading';
  };
  
  caching: {
    staticAssets: '1_year';
    components: '1_month';
    api_responses: '5_minutes';
  };
}

// Example lazy loading
const BillingFormula = lazy(() => 
  import('./components/BillingFormula').then(module => ({
    default: module.BillingFormula
  }))
);

const ReportBuilder = lazy(() =>
  import('./components/ReportBuilder').then(module => ({
    default: module.ReportBuilder
  }))
);
```

## Component Development Guidelines

### Component Structure
```typescript
// Standard component structure
interface ComponentStructure {
  // 1. Imports (grouped and ordered)
  externalLibraries: 'React, Mantine, etc.';
  utilities: 'Helper functions, constants';
  types: 'TypeScript interfaces';
  styles: 'CSS modules or styled components';
  
  // 2. Types and interfaces
  propTypes: ComponentProps;
  stateTypes: ComponentState;
  
  // 3. Component implementation
  component: FunctionComponent;
  
  // 4. Exports
  namedExports: ComponentExports;
  defaultExport: MainComponent;
}

// Example component template
interface ExampleComponentProps {
  title: string;
  data: DataType[];
  onAction?: (item: DataType) => void;
  loading?: boolean;
  className?: string;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  data,
  onAction,
  loading = false,
  className,
}) => {
  // Hooks
  const theme = useMantineTheme();
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
  
  // Event handlers
  const handleItemClick = useCallback((item: DataType) => {
    setSelectedItem(item);
    onAction?.(item);
  }, [onAction]);
  
  // Render
  return (
    <Card className={className}>
      <Card.Section>
        <Title order={2}>{title}</Title>
      </Card.Section>
      
      <LoadingOverlay visible={loading} />
      
      <Stack>
        {data.map((item) => (
          <ActionIcon
            key={item.id}
            onClick={() => handleItemClick(item)}
          >
            {item.name}
          </ActionIcon>
        ))}
      </Stack>
    </Card>
  );
};
```

### Testing Strategy
```typescript
// Component testing approach
interface TestingStrategy {
  unitTests: {
    framework: 'Jest + React Testing Library';
    coverage: 'minimum 80%';
    focus: 'component behavior, user interactions';
  };
  
  integrationTests: {
    framework: 'Cypress or Playwright';
    focus: 'user workflows, API integration';
  };
  
  visualTests: {
    framework: 'Storybook + Chromatic';
    focus: 'component appearance, responsive behavior';
  };
  
  accessibilityTests: {
    framework: 'axe-core + jest-axe';
    focus: 'WCAG compliance, keyboard navigation';
  };
}
```

## Documentation Standards

### Component Documentation
```typescript
// Storybook story example
export default {
  title: 'Components/PropertyCard',
  component: PropertyCard,
  parameters: {
    docs: {
      description: {
        component: 'A card component for displaying property information with occupancy metrics and quick actions.',
      },
    },
  },
  argTypes: {
    property: {
      description: 'Property data object',
      control: { type: 'object' },
    },
    onEdit: {
      description: 'Callback fired when edit action is triggered',
      action: 'edit',
    },
  },
} as Meta<typeof PropertyCard>;

export const Default: StoryObj<typeof PropertyCard> = {
  args: {
    property: {
      id: '1',
      name: 'Sunset Apartments',
      address: '123 Main St, Athens',
      totalUnits: 24,
      occupiedUnits: 22,
      monthlyRevenue: 15600,
    },
  },
};

export const LowOccupancy: StoryObj<typeof PropertyCard> = {
  args: {
    ...Default.args,
    property: {
      ...Default.args.property,
      occupiedUnits: 12,
      alerts: [
        { type: 'warning', message: 'Low occupancy rate' },
      ],
    },
  },
};
```

---

*Document Version: 1.0*  
*Last Updated: November 5, 2025*  
*Next Review: Development Phase Planning*