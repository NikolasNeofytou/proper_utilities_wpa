import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Table,
  Button,
  Group,
  Badge,
  Alert,
  Loader,
  Center,
  Text,
  Pagination,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Stack,
} from '@mantine/core';
import {
  IconBuilding,
  IconPlus,
  IconEye,
  IconAlertCircle,
} from '@tabler/icons-react';
import { propertyService, Property, CreatePropertyRequest } from '../services/api/properties';

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreatePropertyRequest>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Cyprus',
    type: 'APARTMENT',
    totalUnits: 1,
  });

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.getProperties(page, 10);

      if (response.success && response.data) {
        setProperties(response.data.items);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.error || 'Failed to load properties');
      }
    } catch (err) {
      setError('An error occurred while fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await propertyService.createProperty(formData);

      if (response.success) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          address: '',
          city: '',
          postalCode: '',
          country: 'Cyprus',
          type: 'APARTMENT',
          totalUnits: 1,
        });
        fetchProperties(); // Reload list
      } else {
        setError(response.error || 'Failed to create property');
      }
    } catch (err) {
      setError('An error occurred while creating the property');
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

  return (
    <Container size="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} mb="xs">
            Properties
          </Title>
          <Text c="dimmed" size="sm">
            Manage your properties and units
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Property
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {properties.length === 0 ? (
        <Center h={300}>
          <Stack align="center">
            <IconBuilding size={48} stroke={1.5} style={{ opacity: 0.3 }} />
            <Text c="dimmed">No properties found</Text>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Your First Property
            </Button>
          </Stack>
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Units</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {properties.map((property) => (
                <Table.Tr key={property.id}>
                  <Table.Td>
                    <Text fw={500}>{property.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {property.address}, {property.city}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {property.postalCode}, {property.country}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getPropertyTypeColor(property.type)}>
                      {property.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text>{property.totalUnits || property._count?.units || 0}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconEye size={14} />}
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      View
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination value={page} onChange={setPage} total={totalPages} />
            </Group>
          )}
        </>
      )}

      {/* Create Property Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Property"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Property Name"
            placeholder="e.g., Sunshine Apartments"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextInput
            label="Address"
            placeholder="e.g., 123 Main Street"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Group grow>
            <TextInput
              label="City"
              placeholder="e.g., Nicosia"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />

            <TextInput
              label="Postal Code"
              placeholder="e.g., 1234"
              required
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </Group>

          <TextInput
            label="Country"
            placeholder="e.g., Cyprus"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />

          <Select
            label="Property Type"
            required
            data={[
              { value: 'APARTMENT', label: 'Apartment' },
              { value: 'HOUSE', label: 'House' },
              { value: 'COMMERCIAL', label: 'Commercial' },
              { value: 'BUILDING', label: 'Building' },
            ]}
            value={formData.type}
            onChange={(value) =>
              setFormData({ ...formData, type: value as any || 'APARTMENT' })
            }
          />

          <NumberInput
            label="Total Units"
            placeholder="Number of units"
            min={1}
            value={formData.totalUnits}
            onChange={(value) =>
              setFormData({ ...formData, totalUnits: Number(value) || 1 })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProperty} loading={isSubmitting}>
              Create Property
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
