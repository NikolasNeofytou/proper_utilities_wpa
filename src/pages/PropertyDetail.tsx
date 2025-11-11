import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Stack,
  Button,
  Loader,
  Center,
  Alert,
  Grid,
  Table,
  Modal,
  TextInput,
  NumberInput,
  Switch,
} from '@mantine/core';
import {
  IconBuilding,
  IconMapPin,
  IconArrowLeft,
  IconPlus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { propertyService, Property, Unit, CreateUnitRequest } from '../services/api/properties';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new unit
  const [unitData, setUnitData] = useState<CreateUnitRequest>({
    unitNumber: '',
    floor: undefined,
    area: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    isOccupied: false,
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.getProperty(id!);

      if (response.success && response.data) {
        setProperty(response.data);
      } else {
        setError(response.error || 'Failed to load property');
      }
    } catch (err) {
      setError('An error occurred while fetching property details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUnit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await propertyService.createUnit(id!, unitData);

      if (response.success) {
        setIsModalOpen(false);
        setUnitData({
          unitNumber: '',
          floor: undefined,
          area: undefined,
          bedrooms: undefined,
          bathrooms: undefined,
          isOccupied: false,
        });
        fetchProperty(); // Reload property
      } else {
        setError(response.error || 'Failed to create unit');
      }
    } catch (err) {
      setError('An error occurred while creating the unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return 'blue';
      case 'HOUSE':
        return 'green';
      case 'COMMERCIAL':
        return 'orange';
      case 'BUILDING':
        return 'purple';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !property) {
    return (
      <Container size="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error || 'Property not found'}
        </Alert>
        <Button mt="md" onClick={() => navigate('/properties')}>
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/properties')}
        mb="lg"
      >
        Back to Properties
      </Button>

      <Card shadow="sm" p="lg" mb="xl">
        <Group justify="space-between" mb="md">
          <Group>
            <IconBuilding size={32} />
            <div>
              <Title order={2}>{property.name}</Title>
              <Group mt={4}>
                <Badge color={getPropertyTypeColor(property.type)}>
                  {property.type}
                </Badge>
              </Group>
            </div>
          </Group>
        </Group>

        <Grid mt="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xs">
              <Group>
                <IconMapPin size={16} />
                <Text size="sm" fw={500}>
                  Address
                </Text>
              </Group>
              <Text size="sm" c="dimmed" pl={28}>
                {property.address}
              </Text>
              <Text size="sm" c="dimmed" pl={28}>
                {property.city}, {property.postalCode}
              </Text>
              <Text size="sm" c="dimmed" pl={28}>
                {property.country}
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Total Units: {property.totalUnits || property.units?.length || 0}
              </Text>
              <Text size="xs" c="dimmed">
                Created: {new Date(property.createdAt).toLocaleDateString()}
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Group justify="space-between" mb="md">
        <Title order={3}>Units</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          Add Unit
        </Button>
      </Group>

      {property.units && property.units.length > 0 ? (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit Number</Table.Th>
              <Table.Th>Floor</Table.Th>
              <Table.Th>Area (m²)</Table.Th>
              <Table.Th>Bedrooms</Table.Th>
              <Table.Th>Bathrooms</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {property.units.map((unit: Unit) => (
              <Table.Tr key={unit.id}>
                <Table.Td>
                  <Text fw={500}>{unit.unitNumber}</Text>
                </Table.Td>
                <Table.Td>{unit.floor || 'N/A'}</Table.Td>
                <Table.Td>{unit.area || 'N/A'}</Table.Td>
                <Table.Td>{unit.bedrooms || 'N/A'}</Table.Td>
                <Table.Td>{unit.bathrooms || 'N/A'}</Table.Td>
                <Table.Td>
                  <Badge color={unit.isOccupied ? 'green' : 'gray'}>
                    {unit.isOccupied ? 'Occupied' : 'Vacant'}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Center h={200}>
          <Stack align="center">
            <Text c="dimmed">No units added yet</Text>
            <Button
              leftSection={<IconPlus size={16} />}
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Add First Unit
            </Button>
          </Stack>
        </Center>
      )}

      {/* Create Unit Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Unit"
        size="md"
      >
        <Stack>
          <TextInput
            label="Unit Number"
            placeholder="e.g., 101, A1, etc."
            required
            value={unitData.unitNumber}
            onChange={(e) => setUnitData({ ...unitData, unitNumber: e.target.value })}
          />

          <NumberInput
            label="Floor"
            placeholder="Floor number"
            value={unitData.floor}
            onChange={(value) =>
              setUnitData({ ...unitData, floor: value === '' ? undefined : Number(value) })
            }
          />

          <NumberInput
            label="Area (m²)"
            placeholder="Unit area in square meters"
            value={unitData.area}
            onChange={(value) =>
              setUnitData({ ...unitData, area: value === '' ? undefined : Number(value) })
            }
          />

          <Group grow>
            <NumberInput
              label="Bedrooms"
              placeholder="Number of bedrooms"
              min={0}
              value={unitData.bedrooms}
              onChange={(value) =>
                setUnitData({ ...unitData, bedrooms: value === '' ? undefined : Number(value) })
              }
            />

            <NumberInput
              label="Bathrooms"
              placeholder="Number of bathrooms"
              min={0}
              value={unitData.bathrooms}
              onChange={(value) =>
                setUnitData({ ...unitData, bathrooms: value === '' ? undefined : Number(value) })
              }
            />
          </Group>

          <Switch
            label="Is Occupied"
            checked={unitData.isOccupied}
            onChange={(e) =>
              setUnitData({ ...unitData, isOccupied: e.currentTarget.checked })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUnit} loading={isSubmitting}>
              Create Unit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
