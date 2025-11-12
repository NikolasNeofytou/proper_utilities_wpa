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
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSearch, IconDashboard, IconLogout, IconUser, IconReceipt, IconBuilding, IconMoon, IconSun, IconSettings } from '@tabler/icons-react';
import { authService } from '../../services/api';
import { NotificationsBell } from './NotificationsBell';
import { useEffect, useState } from 'react';

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };

    if (authService.isAuthenticated()) {
      loadUser();
    }
  }, []);

  const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';

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
                v2.0 Enhanced
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
                variant={currentPath.startsWith('/properties') ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconBuilding size={16} />}
                onClick={() => navigate('/properties')}
              >
                Properties
              </Button>
              <Button
                variant={currentPath === '/investigation' ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconSearch size={16} />}
                onClick={() => navigate('/investigation')}
              >
                Investigation
              </Button>

              {isAdmin && (
                <Button
                  variant={currentPath.startsWith('/admin') ? 'filled' : 'light'}
                  size="sm"
                  leftSection={<IconSettings size={16} />}
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </Button>
              )}

              <NotificationsBell />

              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => toggleColorScheme()}
                title="Toggle dark mode"
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>

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
