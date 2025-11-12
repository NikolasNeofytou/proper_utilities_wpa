import {
  Container,
  Title,
  Button,
  Group,
  Table,
  Badge,
  TextInput,
  Select,
  Modal,
  Stack,
  Text,
  NumberInput,
  ActionIcon,
  Menu,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { billService, propertyService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import type { Bill as ApiBill } from '../../services/api';

interface Bill extends ApiBill {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Property {
  id: string;
  name: string;
  address: string;
}

export default function BillingManagement() {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const createBillForm = useForm({
    initialValues: {
      propertyId: '',
      periodStart: new Date(),
      periodEnd: new Date(),
      dueDate: new Date(),
      totalAmount: 0,
      consumption: 0,
      rate: 0,
      taxes: 0,
      fees: 0,
    },
    validate: {
      propertyId: (value) => (value ? null : 'Property is required'),
      totalAmount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
      consumption: (value) => (value >= 0 ? null : 'Consumption cannot be negative'),
      rate: (value) => (value >= 0 ? null : 'Rate cannot be negative'),
    },
  });

  useEffect(() => {
    loadBills();
    loadProperties();
  }, []);

  const loadBills = async () => {
    setLoading(true);
    try {
      const response = await billService.getBills(1, 100);
      if (response.success && response.data) {
        setBills(response.data.items);
      }
    } catch (error) {
      console.error('Failed to load bills:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load bills',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const response = await propertyService.getProperties(1, 100);
      if (response.success && response.data) {
        setProperties(response.data.items);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  };

  const handleCreateBill = async (values: typeof createBillForm.values) => {
    try {
      const response = await billService.createBill({
        propertyId: values.propertyId,
        periodStart: values.periodStart.toISOString(),
        periodEnd: values.periodEnd.toISOString(),
        dueDate: values.dueDate.toISOString(),
        totalAmount: values.totalAmount,
        consumption: values.consumption,
        rate: values.rate,
        taxes: values.taxes,
        fees: values.fees,
      });

      if (response.success) {
        notifications.show({
          title: 'Success',
          message: 'Bill created successfully',
          color: 'green',
        });
        setCreateModalOpened(false);
        createBillForm.reset();
        loadBills();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create bill',
        color: 'red',
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'OVERDUE':
        return 'red';
      case 'CANCELLED':
        return 'gray';
      case 'DISPUTED':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.property?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Billing Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateModalOpened(true)}
        >
          Create Bill
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search bills..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by status"
          data={[
            { value: '', label: 'All Status' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'PAID', label: 'Paid' },
            { value: 'OVERDUE', label: 'Overdue' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'DISPUTED', label: 'Disputed' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
        />
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Bill Number</Table.Th>
            <Table.Th>Property</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Due Date</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center">Loading...</Text>
              </Table.Td>
            </Table.Tr>
          ) : filteredBills.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center">No bills found</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            filteredBills.map((bill) => (
              <Table.Tr key={bill.id}>
                <Table.Td>{bill.billNumber}</Table.Td>
                <Table.Td>{bill.property?.name || 'N/A'}</Table.Td>
                <Table.Td>
                  {bill.user ? `${bill.user.firstName} ${bill.user.lastName}` : 'N/A'}
                </Table.Td>
                <Table.Td>
                  {new Date(bill.dueDate).toLocaleDateString('el-GR')}
                </Table.Td>
                <Table.Td>
                  €{bill.totalAmount.toLocaleString('el-GR', { minimumFractionDigits: 2 })}
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusBadgeColor(bill.status)} variant="light">
                    {bill.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => navigate(`/bills/${bill.id}`)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
                        Cancel
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Modal
        opened={createModalOpened}
        onClose={() => {
          setCreateModalOpened(false);
          createBillForm.reset();
        }}
        title="Create New Bill"
        size="lg"
      >
        <form onSubmit={createBillForm.onSubmit(handleCreateBill)}>
          <Stack gap="md">
            <Select
              label="Property"
              placeholder="Select property"
              required
              data={properties.map((p) => ({
                value: p.id,
                label: `${p.name} - ${p.address}`,
              }))}
              {...createBillForm.getInputProps('propertyId')}
            />

            <Group grow>
              <DateInput
                label="Period Start"
                placeholder="Select date"
                required
                {...createBillForm.getInputProps('periodStart')}
              />
              <DateInput
                label="Period End"
                placeholder="Select date"
                required
                {...createBillForm.getInputProps('periodEnd')}
              />
            </Group>

            <DateInput
              label="Due Date"
              placeholder="Select date"
              required
              {...createBillForm.getInputProps('dueDate')}
            />

            <Group grow>
              <NumberInput
                label="Consumption (kWh)"
                placeholder="0"
                min={0}
                decimalScale={2}
                {...createBillForm.getInputProps('consumption')}
              />
              <NumberInput
                label="Rate (€/kWh)"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                {...createBillForm.getInputProps('rate')}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Taxes (€)"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                {...createBillForm.getInputProps('taxes')}
              />
              <NumberInput
                label="Fees (€)"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                {...createBillForm.getInputProps('fees')}
              />
            </Group>

            <NumberInput
              label="Total Amount (€)"
              placeholder="0.00"
              required
              min={0}
              decimalScale={2}
              {...createBillForm.getInputProps('totalAmount')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={() => setCreateModalOpened(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Bill</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
