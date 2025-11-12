import { Container, Title, Grid, Card, Text, Group, Badge, Stack, SimpleGrid } from '@mantine/core';
import { 
  IconUsers, 
  IconBuilding, 
  IconReceipt, 
  IconCash,
  IconChartBar,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown
} from '@tabler/icons-react';
import { MetricCard } from '../../components/business/MetricCard';
import { useEffect, useState } from 'react';
import { adminService, AdminStats } from '../../services/api';

interface RecentActivity {
  id: string;
  type: 'user' | 'property' | 'bill' | 'payment';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBills: 0,
    billsByStatus: {},
    totalRevenue: 0,
    recentPayments: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load stats from admin API
      const statsResponse = await adminService.getStats();
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      // Set placeholder recent activity (in the future, this would come from an API)
      setRecentActivity([
        {
          id: '1',
          type: 'user',
          description: 'New user registered: john.doe@example.com',
          timestamp: new Date().toISOString(),
          status: 'success',
        },
        {
          id: '2',
          type: 'payment',
          description: 'Payment received: €145.50',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'success',
        },
        {
          id: '3',
          type: 'bill',
          description: 'Overdue bill: Property #123',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'warning',
        },
      ]);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived stats
  const pendingPayments = stats.billsByStatus?.PENDING || 0;
  const overduePayments = stats.billsByStatus?.OVERDUE || 0;
  const paidBills = stats.billsByStatus?.PAID || 0;
  const activeProperties = stats.totalProperties; // All properties are active by default
  const occupancyRate = 92.5; // Placeholder, would need actual calculation

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Company Management Dashboard</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={<IconUsers size={24} />}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Active Properties"
          value={`${activeProperties}/${stats.totalProperties}`}
          icon={<IconBuilding size={24} />}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Total Bills"
          value={stats.totalBills.toString()}
          icon={<IconReceipt size={24} />}
          color="purple"
          loading={loading}
        />
        <MetricCard
          title="Total Revenue"
          value={`€${stats.totalRevenue.toLocaleString('el-GR', { minimumFractionDigits: 2 })}`}
          icon={<IconCash size={24} />}
          color="green"
          loading={loading}
        />
      </SimpleGrid>

      <Grid gutter="lg" mb="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Text fw={500}>Payment Status</Text>
                <IconChartBar size={20} />
              </Group>
            </Card.Section>

            <Stack gap="md" mt="md">
              <Group justify="space-between">
                <Group gap="xs">
                  <IconTrendingUp size={18} color="green" />
                  <Text size="sm">Paid Bills</Text>
                </Group>
                <Badge color="green" variant="light">
                  {paidBills}
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Group gap="xs">
                  <IconAlertCircle size={18} color="yellow" />
                  <Text size="sm">Pending Payments</Text>
                </Group>
                <Badge color="yellow" variant="light">
                  {pendingPayments}
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Group gap="xs">
                  <IconTrendingDown size={18} color="red" />
                  <Text size="sm">Overdue Payments</Text>
                </Group>
                <Badge color="red" variant="light">
                  {overduePayments}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Text fw={500}>Property Metrics</Text>
                <IconBuilding size={20} />
              </Group>
            </Card.Section>

            <Stack gap="md" mt="md">
              <Group justify="space-between">
                <Text size="sm">Occupancy Rate</Text>
                <Badge color="blue" variant="light">
                  {occupancyRate}%
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm">Active Properties</Text>
                <Badge color="green" variant="light">
                  {activeProperties}
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm">Inactive Properties</Text>
                <Badge color="gray" variant="light">
                  {stats.totalProperties - activeProperties}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Text fw={500}>Recent Activity</Text>
        </Card.Section>

        <Stack gap="sm" mt="md">
          {recentActivity.map((activity) => (
            <Group key={activity.id} justify="space-between" wrap="nowrap">
              <Group gap="xs">
                <Badge 
                  color={
                    activity.status === 'success' ? 'green' : 
                    activity.status === 'warning' ? 'yellow' : 'red'
                  }
                  variant="dot"
                />
                <Text size="sm">{activity.description}</Text>
              </Group>
              <Text size="xs" c="dimmed">
                {new Date(activity.timestamp).toLocaleTimeString('el-GR')}
              </Text>
            </Group>
          ))}
        </Stack>
      </Card>
    </Container>
  );
}
