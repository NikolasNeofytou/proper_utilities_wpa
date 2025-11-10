import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Text, Stack, Group, Badge, Button } from '@mantine/core';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <Stack gap="md">
        <Text fw={600} size="lg">
          Basic Card
        </Text>
        <Text c="dimmed">
          This is a basic card component with some content inside.
        </Text>
      </Stack>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={700} size="xl">
            Card with Header
          </Text>
          <Badge color="blue" variant="light">
            New
          </Badge>
        </Group>
        <Text c="dimmed">
          A card component with a header section containing a title and badge.
        </Text>
        <Button variant="light" fullWidth>
          Learn More
        </Button>
      </Stack>
    ),
  },
};

export const NoBorder: Story = {
  args: {
    variant: 'outlined',
    children: (
      <Text>This card uses the outlined variant.</Text>
    ),
  },
};

export const WithShadow: Story = {
  args: {
    variant: 'elevated',
    children: (
      <Stack gap="md">
        <Text fw={600} size="lg">
          Card with Shadow
        </Text>
        <Text c="dimmed">
          This card uses the elevated variant with shadow.
        </Text>
      </Stack>
    ),
  },
};

export const PropertyCard: Story = {
  args: {
    children: (
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Apartment 12B
          </Text>
          <Badge color="green" variant="light">
            Active
          </Badge>
        </Group>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Monthly Bill
            </Text>
            <Text size="sm" fw={600}>
              €145.50
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Consumption
            </Text>
            <Text size="sm" fw={600}>
              450 kWh
            </Text>
          </Group>
        </Stack>
        <Button variant="light" fullWidth>
          View Details
        </Button>
      </Stack>
    ),
  },
};
