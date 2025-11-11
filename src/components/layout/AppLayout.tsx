import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell,
  Container,
  Title,
  Group,
  Flex,
  rem,
  Button,
  Badge,
  Menu,
} from '@mantine/core';
import { IconSearch, IconDashboard, IconLogout, IconUser, IconReceipt } from '@tabler/icons-react';
import { authService } from '../../services/api';

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Flex justify="space-between" align="center" h="100%" px="md">
            <Group>
              <Title
                order={1}
                size={rem(24)}
                fw={700}
                style={{
                  background:
                    'linear-gradient(45deg, var(--mantine-color-utility-blue-6), var(--mantine-color-utility-green-6))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                UtilityPro
              </Title>
              <Badge size="sm" variant="light" color="blue">
                Phase 3 Demo
              </Badge>
            </Group>

            <Group>
              <Button
                variant={currentPath === '/dashboard' ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconDashboard size={16} />}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={currentPath.startsWith('/bills') ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconReceipt size={16} />}
                onClick={() => navigate('/bills')}
              >
                Bills
              </Button>
              <Button
                variant={currentPath === '/investigation' ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconSearch size={16} />}
                onClick={() => navigate('/investigation')}
              >
                Investigation
              </Button>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="light" size="sm" leftSection={<IconUser size={16} />}>
                    Account
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item 
                    leftSection={<IconUser size={14} />}
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconLogout size={14} />}
                    color="red"
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
