import React from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Group,
  Button,
  Card,
  Badge,
  Progress,
  Divider,
} from '@mantine/core';
import {
  IconBolt,
  IconBuilding,
  IconUsers,
  IconCash,
  IconAlertTriangle,
  IconCheck,
} from '@tabler/icons-react';
import { MetricCard } from '../components/business/MetricCard';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '€45,231',
      subtitle: 'This month',
      trend: { direction: 'up' as const, value: 12, label: 'vs last month' },
      icon: <IconCash size={24} />,
      color: 'utility-blue' as const,
    },
    {
      title: 'Active Customers',
      value: 1234,
      subtitle: 'Total registered',
      trend: { direction: 'up' as const, value: 5, label: 'new this week' },
      icon: <IconUsers size={24} />,
      color: 'utility-green' as const,
    },
    {
      title: 'Properties Managed',
      value: 89,
      subtitle: 'Buildings & Units',
      trend: { direction: 'stable' as const, value: 0, label: 'no change' },
      icon: <IconBuilding size={24} />,
      color: 'blue' as const,
    },
    {
      title: 'Energy Consumption',
      value: '2.4 MWh',
      subtitle: 'Today',
      trend: { direction: 'down' as const, value: 8, label: 'vs yesterday' },
      icon: <IconBolt size={24} />,
      color: 'green' as const,
    },
  ];

  const recentActivities = [
    {
      type: 'payment',
      message: 'Payment received from Apartment 12B',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      type: 'alert',
      message: 'High energy usage detected in Building A',
      time: '15 minutes ago',
      status: 'warning',
    },
    {
      type: 'billing',
      message: 'Monthly bills generated for 156 customers',
      time: '1 hour ago',
      status: 'success',
    },
    {
      type: 'maintenance',
      message: 'Scheduled maintenance completed for Unit 5C',
      time: '3 hours ago',
      status: 'success',
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="h2">
              Dashboard
            </Title>
            <Text c="dimmed" size="lg">
              Welcome back to UtilityPro. Here's what's happening with your utility management.
            </Text>
          </Stack>
          <Button variant="utility" size="md">
            Generate Report
          </Button>
        </Group>

        {/* Metrics Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          {/* Recent Activity */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Title order={3} size="h4">
                  Recent Activity
                </Title>
                <Button variant="subtle" size="xs">
                  View All
                </Button>
              </Group>
              
              <Stack gap="sm">
                {recentActivities.map((activity, index) => (
                  <Group key={index} wrap="nowrap" align="flex-start" gap="md">
                    <Badge
                      color={
                        activity.status === 'success' 
                          ? 'green' 
                          : activity.status === 'warning' 
                          ? 'yellow' 
                          : 'blue'
                      }
                      variant="light"
                      size="sm"
                    >
                      {activity.status === 'success' && <IconCheck size={12} />}
                      {activity.status === 'warning' && <IconAlertTriangle size={12} />}
                    </Badge>
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {activity.message}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {activity.time}
                      </Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* System Status */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={3} size="h4">
                System Status
              </Title>
              
              <Stack gap="lg">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      Server Performance
                    </Text>
                    <Text size="sm" c="green">
                      Excellent
                    </Text>
                  </Group>
                  <Progress value={95} color="green" size="sm" />
                </Stack>
                
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      Database Health
                    </Text>
                    <Text size="sm" c="green">
                      Good
                    </Text>
                  </Group>
                  <Progress value={88} color="green" size="sm" />
                </Stack>
                
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      API Response Time
                    </Text>
                    <Text size="sm" c="yellow">
                      Fair
                    </Text>
                  </Group>
                  <Progress value={72} color="yellow" size="sm" />
                </Stack>
                
                <Divider />
                
                <Group justify="center">
                  <Badge color="green" variant="light" size="lg">
                    <IconCheck size={14} />
                    <Text ml={4}>All Systems Operational</Text>
                  </Badge>
                </Group>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Dashboard;