import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Badge,
  Table,
  Loader,
  Alert,
  TextInput,
  Select,
  Pagination,
} from '@mantine/core';
import {
  IconReceipt,
  IconSearch,
  IconFilter,
  IconAlertCircle,
  IconEye,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { billService, type Bill } from '../services/api';

const Bills: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBills();
  }, [page, statusFilter]);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await billService.getBills(
        page,
        10,
        statusFilter || undefined
      );
      
      if (response.success && response.data) {
        setBills(response.data.items);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.error || 'Failed to load bills');
      }
    } catch (err) {
      setError('An error occurred while loading bills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'green';
      case 'PENDING':
        return 'blue';
      case 'OVERDUE':
        return 'red';
      case 'CANCELLED':
        return 'gray';
      case 'DISPUTED':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const filteredBills = bills.filter((bill) =>
    searchQuery
      ? bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bill.property?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={1} size="h2">
              <Group gap="sm">
                <IconReceipt size={32} />
                Bills
              </Group>
            </Title>
            <Text c="dimmed" size="lg">
              View and manage your utility bills
            </Text>
          </Stack>
        </Group>

        {/* Filters */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group grow>
            <TextInput
              placeholder="Search by bill number or property..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: '', label: 'All Statuses' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'PAID', label: 'Paid' },
                { value: 'OVERDUE', label: 'Overdue' },
                { value: 'DISPUTED', label: 'Disputed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Group>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {/* Bills Table */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          {loading ? (
            <Group justify="center" p="xl">
              <Loader size="lg" />
            </Group>
          ) : filteredBills.length === 0 ? (
            <Stack align="center" gap="md" py="xl">
              <IconReceipt size={48} stroke={1.5} color="gray" />
              <Text size="lg" c="dimmed">
                No bills found
              </Text>
              <Text size="sm" c="dimmed">
                {searchQuery || statusFilter
                  ? 'Try adjusting your filters'
                  : 'Bills will appear here once they are generated'}
              </Text>
            </Stack>
          ) : (
            <Stack gap="md">
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Bill Number</Table.Th>
                    <Table.Th>Property</Table.Th>
                    <Table.Th>Period</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredBills.map((bill) => (
                    <Table.Tr key={bill.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {bill.billNumber}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{bill.property?.name || 'N/A'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {formatDate(bill.periodStart)} - {formatDate(bill.periodEnd)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600}>
                          {formatCurrency(bill.totalAmount)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(bill.dueDate)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(bill.status)} variant="light">
                          {bill.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={<IconEye size={14} />}
                          onClick={() => navigate(`/bills/${bill.id}`)}
                        >
                          View
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <Group justify="center">
                  <Pagination
                    total={totalPages}
                    value={page}
                    onChange={setPage}
                  />
                </Group>
              )}
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  );
};

export default Bills;
