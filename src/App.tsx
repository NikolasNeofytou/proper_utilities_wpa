import React, { useState } from 'react';
import {
  AppShell,
  Container,
  Title,
  Group,
  Flex,
  rem,
  Button,
  Badge,
} from '@mantine/core';
import { IconSearch, IconDashboard } from '@tabler/icons-react';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'investigation'>('dashboard');

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Flex 
            justify="space-between" 
            align="center" 
            h="100%" 
            px="md"
          >
            <Group>
              <Title 
                order={1} 
                size={rem(24)} 
                fw={700}
                style={{
                  background: 'linear-gradient(45deg, var(--mantine-color-utility-blue-6), var(--mantine-color-utility-green-6))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                UtilityPro
              </Title>
              <Badge size="sm" variant="light" color="blue">
                Phase 2 Demo
              </Badge>
            </Group>
            
            <Group>
              <Button
                variant={currentPage === 'dashboard' ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconDashboard size={16} />}
                onClick={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={currentPage === 'investigation' ? 'filled' : 'light'}
                size="sm"
                leftSection={<IconSearch size={16} />}
                onClick={() => setCurrentPage('investigation')}
              >
                Investigation
              </Button>
            </Group>
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'investigation' && <Investigation />}
      </AppShell.Main>
    </AppShell>
  );
};

export default App;