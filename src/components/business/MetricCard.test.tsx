import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MetricCard } from '../business/MetricCard';
import { IconCash } from '@tabler/icons-react';

describe('MetricCard', () => {
  it('renders metric card with title and value', () => {
    render(
      <MantineProvider>
        <MetricCard
          title="Total Revenue"
          value="€45,231"
          subtitle="This month"
          icon={<IconCash size={24} />}
          color="blue"
        />
      </MantineProvider>
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('€45,231')).toBeInTheDocument();
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('renders metric card with trend information', () => {
    render(
      <MantineProvider>
        <MetricCard
          title="Active Customers"
          value={1234}
          subtitle="Total registered"
          trend={{ direction: 'up', value: 5, label: 'vs last month' }}
          icon={<IconCash size={24} />}
          color="green"
        />
      </MantineProvider>
    );

    expect(screen.getByText('Active Customers')).toBeInTheDocument();
    // Number is formatted with locale separator (1,234 or 1.234)
    expect(screen.getByText(/1[.,]234/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });
});
