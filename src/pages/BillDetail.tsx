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
  Divider,
  Loader,
  Alert,
  Grid,
  Paper,
  Table,
  Modal,
  TextInput,
  Select,
  NumberInput,
} from '@mantine/core';
import {
  IconReceipt,
  IconArrowLeft,
  IconAlertCircle,
  IconDownload,
  IconCreditCard,
  IconCheck,
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { billService, paymentService, type Bill } from '../services/api';

const BillDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number | string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CREDIT_CARD');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (id) {
      loadBill();
    }
  }, [id]);

  const loadBill = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await billService.getBill(id!);
      
      if (response.success && response.data) {
        setBill(response.data);
      } else {
        setError(response.error || 'Failed to load bill');
      }
    } catch (err) {
      setError('An error occurred while loading bill details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bill || !paymentAmount) return;

    try {
      setPaymentLoading(true);
      setError(null);

      const response = await paymentService.createPayment({
        billId: bill.id,
        amount: Number(paymentAmount),
        paymentMethod: paymentMethod as any,
        transactionId: transactionId || undefined,
      });

      if (response.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentModalOpen(false);
          setPaymentSuccess(false);
          loadBill(); // Reload bill to see updated status
        }, 2000);
      } else {
        setError(response.error || 'Payment failed');
      }
    } catch (err) {
      setError('An error occurred while processing payment');
      console.error(err);
    } finally {
      setPaymentLoading(false);
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
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" p="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error && !bill) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
        <Button mt="md" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/bills')}>
          Back to Bills
        </Button>
      </Container>
    );
  }

  if (!bill) {
    return null;
  }

  const remainingAmount = bill.totalAmount - (bill.payments?.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0) || 0);
  const paidAmount = bill.payments?.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0) || 0;
  const canPay = bill.status === 'PENDING' || bill.status === 'OVERDUE';

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/bills')}
            >
              Back
            </Button>
            <Title order={1} size="h2">
              <Group gap="sm">
                <IconReceipt size={32} />
                {bill.billNumber}
              </Group>
            </Title>
            <Badge color={getStatusColor(bill.status)} size="lg" variant="light">
              {bill.status}
            </Badge>
          </Group>
          <Group>
            {canPay && remainingAmount > 0 && (
              <Button
                leftSection={<IconCreditCard size={16} />}
                color="green"
                onClick={() => {
                  setPaymentAmount(remainingAmount);
                  setPaymentModalOpen(true);
                }}
              >
                Pay Bill
              </Button>
            )}
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
            >
              Download PDF
            </Button>
          </Group>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        <Grid>
          {/* Bill Information */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              {/* Bill Details Card */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3} size="h4">
                    Bill Details
                  </Title>
                  <Divider />
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Property</Text>
                        <Text size="sm" fw={600}>{bill.property?.name || 'N/A'}</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Bill Period</Text>
                        <Text size="sm" fw={600}>
                          {formatDate(bill.periodStart)} - {formatDate(bill.periodEnd)}
                        </Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Issue Date</Text>
                        <Text size="sm" fw={600}>{formatDate(bill.issueDate)}</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Due Date</Text>
                        <Text size="sm" fw={600} c={bill.status === 'OVERDUE' ? 'red' : undefined}>
                          {formatDate(bill.dueDate)}
                        </Text>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>

              {/* Charges Breakdown */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3} size="h4">
                    Charges Breakdown
                  </Title>
                  <Divider />
                  
                  <Table>
                    <Table.Tbody>
                      {bill.consumption && (
                        <Table.Tr>
                          <Table.Td>
                            <Text size="sm">Consumption</Text>
                          </Table.Td>
                          <Table.Td align="right">
                            <Text size="sm" fw={500}>{bill.consumption} kWh</Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                      {bill.rate && (
                        <Table.Tr>
                          <Table.Td>
                            <Text size="sm">Rate</Text>
                          </Table.Td>
                          <Table.Td align="right">
                            <Text size="sm" fw={500}>{formatCurrency(bill.rate)}/kWh</Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                      <Table.Tr>
                        <Table.Td>
                          <Text size="sm">Taxes</Text>
                        </Table.Td>
                        <Table.Td align="right">
                          <Text size="sm" fw={500}>{formatCurrency(bill.taxes)}</Text>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <Text size="sm">Fees</Text>
                        </Table.Td>
                        <Table.Td align="right">
                          <Text size="sm" fw={500}>{formatCurrency(bill.fees)}</Text>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td colSpan={2}>
                          <Divider my="xs" />
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <Text size="lg" fw={700}>Total Amount</Text>
                        </Table.Td>
                        <Table.Td align="right">
                          <Text size="lg" fw={700} c="blue">
                            {formatCurrency(bill.totalAmount)}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>

              {/* Payment History */}
              {bill.payments && bill.payments.length > 0 && (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3} size="h4">
                      Payment History
                    </Title>
                    <Divider />
                    
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Payment Number</Table.Th>
                          <Table.Th>Method</Table.Th>
                          <Table.Th>Amount</Table.Th>
                          <Table.Th>Status</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {bill.payments.map((payment) => (
                          <Table.Tr key={payment.id}>
                            <Table.Td>
                              <Text size="sm">{formatDate(payment.paymentDate)}</Text>
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm" fw={500}>N/A</Text>
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm">N/A</Text>
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm" fw={600}>{formatCurrency(payment.amount)}</Text>
                            </Table.Td>
                            <Table.Td>
                              <Badge
                                color={payment.status === 'COMPLETED' ? 'green' : 'yellow'}
                                variant="light"
                              >
                                {payment.status}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Grid.Col>

          {/* Payment Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3} size="h4">
                  Payment Summary
                </Title>
                <Divider />
                
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Total Amount</Text>
                    <Text size="sm" fw={600}>{formatCurrency(bill.totalAmount)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Paid Amount</Text>
                    <Text size="sm" fw={600} c="green">{formatCurrency(paidAmount)}</Text>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text size="lg" fw={700}>Remaining</Text>
                    <Text size="lg" fw={700} c={remainingAmount > 0 ? 'red' : 'green'}>
                      {formatCurrency(remainingAmount)}
                    </Text>
                  </Group>
                </Stack>

                {remainingAmount === 0 && (
                  <Alert icon={<IconCheck size={16} />} title="Fully Paid" color="green">
                    This bill has been fully paid.
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Payment Modal */}
      <Modal
        opened={paymentModalOpen}
        onClose={() => !paymentLoading && setPaymentModalOpen(false)}
        title="Make Payment"
        size="md"
      >
        {paymentSuccess ? (
          <Stack align="center" gap="md" py="xl">
            <IconCheck size={64} color="green" />
            <Title order={3} c="green">Payment Successful!</Title>
            <Text c="dimmed">Your payment has been processed successfully.</Text>
          </Stack>
        ) : (
          <Stack gap="md">
            <NumberInput
              label="Payment Amount"
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={setPaymentAmount}
              min={0}
              max={remainingAmount}
              decimalScale={2}
              prefix="€"
              required
            />
            
            <Select
              label="Payment Method"
              placeholder="Select payment method"
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value || 'CREDIT_CARD')}
              data={[
                { value: 'CREDIT_CARD', label: 'Credit Card' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'CASH', label: 'Cash' },
                { value: 'ONLINE', label: 'Online Payment' },
              ]}
              required
            />

            <TextInput
              label="Transaction ID (Optional)"
              placeholder="Enter transaction reference"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => setPaymentModalOpen(false)}
                disabled={paymentLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                loading={paymentLoading}
                leftSection={<IconCreditCard size={16} />}
              >
                Process Payment
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default BillDetail;
