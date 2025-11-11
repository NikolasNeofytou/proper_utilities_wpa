import React, { useState, useEffect } from 'react';
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
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconBolt,
  IconBuilding,
  IconUsers,
  IconCash,
  IconAlertTriangle,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../components/business/MetricCard';
import { billService, paymentService } from '../services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billStats, setBillStats] = useState<any>(null);
  const [paymentStats, setPaymentStats] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [billsResponse, paymentsResponse] = await Promise.all([
        billService.getBillStats(),
        paymentService.getPaymentStats(),
      ]);

      if (billsResponse.success && billsResponse.data) {
        setBillStats(billsResponse.data);
      }

      if (paymentsResponse.success && paymentsResponse.data) {
        setPaymentStats(paymentsResponse.data);
      }

      if (!billsResponse.success) {
        setError(billsResponse.error || 'Failed to load bill statistics');
      }
    } catch (err) {
      setError('An error occurred while loading dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate metrics from stats
  const metrics = [
    {
      title: 'Total Revenue',
      value: billStats ? formatCurrency(billStats.paidAmount) : '€0',
      subtitle: 'Collected payments',
      trend: { 
        direction: 'up' as const, 
        value: billStats ? Math.round((billStats.paidAmount / billStats.totalAmount) * 100) : 0,
        label: 'collection rate' 
      },
      icon: <IconCash size={24} />,
      color: 'utility-blue' as const,
    },
    {
      title: 'Total Bills',
      value: billStats?.total || 0,
      subtitle: `${billStats?.pending || 0} pending`,
      trend: { 
        direction: billStats?.overdue > 0 ? 'down' as const : 'stable' as const,
        value: billStats?.overdue || 0,
        label: 'overdue bills' 
      },
      icon: <IconBuilding size={24} />,
      color: 'utility-green' as const,
    },
    {
      title: 'Payments Received',
      value: paymentStats?.total || 0,
      subtitle: `${paymentStats?.completed || 0} completed`,
      trend: { 
        direction: 'up' as const, 
        value: paymentStats?.pending || 0,
        label: 'pending' 
      },
      icon: <IconUsers size={24} />,
      color: 'blue' as const,
    },
    {
      title: 'Outstanding Amount',
      value: billStats ? formatCurrency(billStats.unpaidAmount) : '€0',
      subtitle: 'To be collected',
      trend: { 
        direction: billStats && billStats.overdue > 0 ? 'up' as const : 'stable' as const,
        value: billStats?.overdue || 0,
        label: 'overdue' 
      },
      icon: <IconBolt size={24} />,
      color: billStats && billStats.unpaidAmount > 0 ? 'red' as const : 'green' as const,
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

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

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
          <Button variant="utility" size="md" onClick={() => navigate('/bills')}>
            View All Bills
          </Button>
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="yellow">
            {error}
          </Alert>
        )}

        {/* Metrics Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          {/* Bills Summary */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Title order={3} size="h4">
                  Bills Summary
                </Title>
                <Button variant="subtle" size="xs" onClick={() => navigate('/bills')}>
                  View All
                </Button>
              </Group>
              
              {billStats && (
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge color="blue" variant="light">Pending</Badge>
                      <Text size="sm">{billStats.pending} bills</Text>
                    </Group>
                    <Text size="sm" fw={600}>{formatCurrency(billStats.unpaidAmount - (billStats.overdue * (billStats.totalAmount / billStats.total || 0)))}</Text>
                  </Group>
                  
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge color="green" variant="light">Paid</Badge>
                      <Text size="sm">{billStats.paid} bills</Text>
                    </Group>
                    <Text size="sm" fw={600}>{formatCurrency(billStats.paidAmount)}</Text>
                  </Group>
                  
                  {billStats.overdue > 0 && (
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Badge color="red" variant="light">Overdue</Badge>
                        <Text size="sm">{billStats.overdue} bills</Text>
                      </Group>
                      <Text size="sm" fw={600} c="red">Action Required</Text>
                    </Group>
                  )}
                  
                  <Divider my="xs" />
                  
                  <Group justify="space-between">
                    <Text size="sm" fw={700}>Total</Text>
                    <Text size="sm" fw={700}>{formatCurrency(billStats.totalAmount)}</Text>
                  </Group>
                </Stack>
              )}
            </Stack>
          </Card>

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
        </SimpleGrid>

        {/* System Status */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="h4">
              System Status
            </Title>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
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
            </SimpleGrid>
            
            <Divider />
            
            <Group justify="center">
              <Badge color="green" variant="light" size="lg">
                <IconCheck size={14} />
                <Text ml={4}>All Systems Operational</Text>
              </Badge>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Dashboard;