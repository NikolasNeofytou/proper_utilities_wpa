import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';
import { IconCash, IconUsers, IconBuilding, IconBolt } from '@tabler/icons-react';

const meta = {
  title: 'Business/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '350px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Revenue: Story = {
  args: {
    title: 'Total Revenue',
    value: '€45,231',
    subtitle: 'This month',
    trend: { direction: 'up', value: 12, label: 'vs last month' },
    icon: <IconCash size={24} />,
    color: 'utility-blue',
  },
};

export const Customers: Story = {
  args: {
    title: 'Active Customers',
    value: 1234,
    subtitle: 'Total registered',
    trend: { direction: 'up', value: 5, label: 'new this week' },
    icon: <IconUsers size={24} />,
    color: 'utility-green',
  },
};

export const Properties: Story = {
  args: {
    title: 'Properties Managed',
    value: 89,
    subtitle: 'Buildings & Units',
    trend: { direction: 'stable', value: 0, label: 'no change' },
    icon: <IconBuilding size={24} />,
    color: 'blue',
  },
};

export const Energy: Story = {
  args: {
    title: 'Energy Consumption',
    value: '2.4 MWh',
    subtitle: 'Today',
    trend: { direction: 'down', value: 8, label: 'vs yesterday' },
    icon: <IconBolt size={24} />,
    color: 'green',
  },
};

export const TrendDown: Story = {
  args: {
    title: 'Usage Trend',
    value: '1.8 MWh',
    subtitle: 'Last 24 hours',
    trend: { direction: 'down', value: 15, label: 'decrease' },
    icon: <IconBolt size={24} />,
    color: 'red',
  },
};

export const NoTrend: Story = {
  args: {
    title: 'System Status',
    value: 'Operational',
    subtitle: 'All systems',
    icon: <IconBuilding size={24} />,
    color: 'gray',
  },
};

export const LargeNumber: Story = {
  args: {
    title: 'Total Transactions',
    value: 1234567,
    subtitle: 'All time',
    trend: { direction: 'up', value: 23, label: 'vs last year' },
    icon: <IconCash size={24} />,
    color: 'blue',
  },
};
