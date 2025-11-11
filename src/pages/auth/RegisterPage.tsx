import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
  Alert,
  Group,
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { authService } from '../../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = (): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(formData.password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(formData.password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(formData.password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });

      if (response.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.error || response.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        ta="center"
        style={{
          fontWeight: 900,
        }}
      >
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component="button" onClick={() => navigate('/login')}>
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        {success && (
          <Alert icon={<IconCheck size={16} />} title="Success" color="green" mb="md">
            Account created successfully! Redirecting to login...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange('firstName')}
              disabled={loading || success}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange('lastName')}
              disabled={loading || success}
            />
          </Group>

          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            value={formData.email}
            onChange={handleChange('email')}
            disabled={loading || success}
          />

          <TextInput
            label="Phone (optional)"
            placeholder="+30 123 456 7890"
            mt="md"
            value={formData.phone}
            onChange={handleChange('phone')}
            disabled={loading || success}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={formData.password}
            onChange={handleChange('password')}
            disabled={loading || success}
            description="Must be at least 8 characters with uppercase, lowercase, and numbers"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            disabled={loading || success}
          />

          <Button fullWidth mt="xl" type="submit" loading={loading} disabled={success}>
            Create account
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
