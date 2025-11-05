import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Card, Text, Group, ThemeIcon, Stack, Skeleton } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    label: string;
  };
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'utility-blue' | 'utility-green';
  loading?: boolean;
}

const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
  switch (direction) {
    case 'up':
      return <IconTrendingUp size={16} />;
    case 'down':
      return <IconTrendingDown size={16} />;
    case 'stable':
      return <IconMinus size={16} />;
    default:
      return <IconMinus size={16} />;
  }
};

const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
  switch (direction) {
    case 'up':
      return 'green';
    case 'down':
      return 'red';
    case 'stable':
      return 'gray';
    default:
      return 'gray';
  }
};

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({
    title,
    value,
    subtitle,
    trend,
    icon,
    color = 'blue',
    loading = false,
    ...props
  }, ref) => {
    const formatValue = (val: string | number) => {
      if (typeof val === 'number') {
        // Format numbers with Greek locale
        return val.toLocaleString('el-GR');
      }
      return val;
    };

    if (loading) {
      return (
        <Card ref={ref} shadow="sm" padding="lg" radius="md" withBorder {...props}>
          <Stack gap="md">
            <Group justify="space-between">
              <Skeleton height={16} width="60%" />
              <Skeleton height={32} width={32} radius="md" />
            </Group>
            <Stack gap="xs">
              <Skeleton height={24} width="40%" />
              <Skeleton height={12} width="30%" />
            </Stack>
          </Stack>
        </Card>
      );
    }

    return (
      <Card 
        ref={ref} 
        shadow="sm" 
        padding="lg" 
        radius="md" 
        withBorder
        style={{
          transition: 'box-shadow 150ms ease, transform 150ms ease',
          cursor: 'default',
        }}
        {...props}
      >
        <Stack gap="md">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text size="sm" c="dimmed" fw={500}>
                {title}
              </Text>
              
              <Group gap="xs" align="baseline">
                <Text size="xl" fw={700} c="dark">
                  {formatValue(value)}
                </Text>
                
                {trend && (
                  <Group gap={4} align="center">
                    <Text size="xs" c={getTrendColor(trend.direction)}>
                      {getTrendIcon(trend.direction)}
                    </Text>
                    <Text size="xs" c={getTrendColor(trend.direction)} fw={500}>
                      {trend.value}% {trend.label}
                    </Text>
                  </Group>
                )}
              </Group>
              
              {subtitle && (
                <Text size="sm" c="dimmed">
                  {subtitle}
                </Text>
              )}
            </Stack>

            {icon && (
              <ThemeIcon 
                size="xl" 
                radius="md" 
                variant="light" 
                color={color}
                style={{ flexShrink: 0 }}
              >
                {icon}
              </ThemeIcon>
            )}
          </Group>
        </Stack>
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';