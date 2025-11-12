import { 
  Container, 
  Title, 
  Table, 
  Group, 
  Button, 
  Badge, 
  TextInput, 
  Select,
  Modal,
  Stack,
  Text,
  ActionIcon,
  Menu
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconDots, 
  IconEdit, 
  IconTrash,
  IconBan,
  IconCheck
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { adminService, User } from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [addModalOpened, setAddModalOpened] = useState(false);

  const addUserForm = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'CUSTOMER' as 'ADMIN' | 'MANAGER' | 'CUSTOMER',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      firstName: (value) => (value.length > 0 ? null : 'First name is required'),
      lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters'),
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({
        page: 1,
        limit: 100,
      });

      if (response.success && response.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load users',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (values: typeof addUserForm.values) => {
    try {
      const response = await adminService.createUser(values);
      
      if (response.success) {
        notifications.show({
          title: 'Success',
          message: 'User created successfully',
          color: 'green',
        });
        setAddModalOpened(false);
        addUserForm.reset();
        loadUsers();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create user',
        color: 'red',
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await adminService.updateUserStatus(userId, isActive);
      
      if (response.success) {
        notifications.show({
          title: 'Success',
          message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
          color: 'green',
        });
        loadUsers();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update user status',
        color: 'red',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'red';
      case 'MANAGER':
        return 'blue';
      case 'CUSTOMER':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>User Management</Title>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
        >
          Add User
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search users..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by role"
          data={[
            { value: '', label: 'All Roles' },
            { value: 'ADMIN', label: 'Admin' },
            { value: 'MANAGER', label: 'Manager' },
            { value: 'CUSTOMER', label: 'Customer' },
          ]}
          value={roleFilter}
          onChange={setRoleFilter}
          clearable
        />
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created</Table.Th>
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
          ) : filteredUsers.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center">No users found</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            filteredUsers.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{`${user.firstName} ${user.lastName}`}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.phone || '-'}</Table.Td>
                <Table.Td>
                  <Badge color={getRoleBadgeColor(user.role)} variant="light">
                    {user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={user.isActive ? 'green' : 'gray'} variant="light">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {new Date(user.createdAt).toLocaleDateString('el-GR')}
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={user.isActive ? <IconBan size={14} /> : <IconCheck size={14} />}
                        onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item 
                        color="red" 
                        leftSection={<IconTrash size={14} />}
                      >
                        Delete
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
        opened={addModalOpened}
        onClose={() => {
          setAddModalOpened(false);
          addUserForm.reset();
        }}
        title="Add New User"
        size="md"
      >
        <form onSubmit={addUserForm.onSubmit(handleAddUser)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="user@example.com"
              required
              {...addUserForm.getInputProps('email')}
            />
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                required
                {...addUserForm.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                required
                {...addUserForm.getInputProps('lastName')}
              />
            </Group>
            <TextInput
              label="Phone"
              placeholder="+30 123 456 7890"
              {...addUserForm.getInputProps('phone')}
            />
            <Select
              label="Role"
              placeholder="Select role"
              required
              data={[
                { value: 'CUSTOMER', label: 'Customer' },
                { value: 'MANAGER', label: 'Manager' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              {...addUserForm.getInputProps('role')}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              {...addUserForm.getInputProps('password')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setAddModalOpened(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
