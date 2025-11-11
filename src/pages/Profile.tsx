import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  TextInput,
  Loader,
  Alert,
  Divider,
  Avatar,
  Badge,
  Grid,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { authService, type User } from '../services/api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone || '',
        });
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('An error occurred while loading your profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // In a real implementation, you would call an API to update the profile
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setEditing(false);

      // Update local user state
      if (user) {
        setUser({
          ...user,
          ...formData,
        });
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      });
    }
    setEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error && !user) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
        <Button mt="md" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/dashboard')}
            >
              Back
            </Button>
            <Title order={1} size="h2">
              <Group gap="sm">
                <IconUser size={32} />
                My Profile
              </Group>
            </Title>
          </Group>
          {!editing && (
            <Button
              leftSection={<IconEdit size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Group>

        {/* Success Alert */}
        {success && (
          <Alert icon={<IconCheck size={16} />} title="Success" color="green">
            Your profile has been updated successfully!
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {/* Profile Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="lg">
            {/* Avatar and Basic Info */}
            <Group>
              <Avatar size={80} radius="md" color="blue">
                {getInitials(user.firstName, user.lastName)}
              </Avatar>
              <Stack gap="xs">
                <Group gap="sm">
                  <Text size="xl" fw={700}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Badge color={getRoleBadgeColor(user.role)} variant="light">
                    {user.role}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </Stack>
            </Group>

            <Divider />

            {/* Profile Details */}
            {editing ? (
              <Stack gap="md">
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="First Name"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="Email Address"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  leftSection={<IconMail size={16} />}
                  required
                />

                <TextInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  leftSection={<IconPhone size={16} />}
                />

                <Group justify="flex-end" mt="md">
                  <Button variant="light" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} loading={saving}>
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Stack gap="md">
                <Group gap="md">
                  <IconUser size={20} color="gray" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">
                      Full Name
                    </Text>
                    <Text size="sm" fw={500}>
                      {user.firstName} {user.lastName}
                    </Text>
                  </Stack>
                </Group>

                <Group gap="md">
                  <IconMail size={20} color="gray" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">
                      Email Address
                    </Text>
                    <Text size="sm" fw={500}>
                      {user.email}
                    </Text>
                  </Stack>
                </Group>

                {user.phone && (
                  <Group gap="md">
                    <IconPhone size={20} color="gray" />
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">
                        Phone Number
                      </Text>
                      <Text size="sm" fw={500}>
                        {user.phone}
                      </Text>
                    </Stack>
                  </Group>
                )}

                <Group gap="md">
                  <IconCalendar size={20} color="gray" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">
                      Member Since
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(user.createdAt)}
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Account Information */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="h4">
              Account Information
            </Title>
            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Account ID
                  </Text>
                  <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                    {user.id.slice(0, 8)}...
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Account Type
                  </Text>
                  <Badge color={getRoleBadgeColor(user.role)} variant="light">
                    {user.role}
                  </Badge>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Created At
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatDate(user.createdAt)}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Account Status
                  </Text>
                  <Badge color={user.isActive ? 'green' : 'red'} variant="light">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Security Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="h4">
              Security
            </Title>
            <Divider />

            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>
                    Password
                  </Text>
                  <Text size="xs" c="dimmed">
                    Last changed 30 days ago
                  </Text>
                </div>
                <Button variant="light" size="sm">
                  Change Password
                </Button>
              </Group>

              <Divider />

              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>
                    Two-Factor Authentication
                  </Text>
                  <Text size="xs" c="dimmed">
                    Add an extra layer of security
                  </Text>
                </div>
                <Button variant="light" size="sm">
                  Enable 2FA
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Profile;
