import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Stack,
  Card,
  SimpleGrid,
  Badge,
  ThemeIcon,
  Accordion,
  Paper,
  Timeline,
  List,
  Alert,
  Progress,
} from '@mantine/core';
import {
  IconCode,
  IconComponents,
  IconPalette,
  IconBuildingStore,
  IconChartLine,
  IconInfoCircle,
  IconCheck,
  IconClock,
  IconRocket,
  IconDatabase,
  IconBolt,
  IconSettings,
  IconSearch,
} from '@tabler/icons-react';
import { MetricCard } from '../components/business/MetricCard';
import { Button as CustomButton } from '../components/ui/Button';

const Investigation: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>('components');

  // Project statistics
  const projectStats = {
    totalFiles: 15,
    components: 8,
    pages: 2,
    linesOfCode: 1200,
    completion: 65,
  };

  // Architecture overview
  const architectureLayers = [
    {
      name: 'Application Layer',
      description: 'Main App.tsx with routing and layout',
      files: ['App.tsx', 'main.tsx'],
      status: 'completed',
      color: 'green',
    },
    {
      name: 'Page Layer',
      description: 'Dashboard and feature pages',
      files: ['Dashboard.tsx', 'Investigation.tsx'],
      status: 'in-progress',
      color: 'blue',
    },
    {
      name: 'Component Layer',
      description: 'Reusable UI and business components',
      files: ['Button.tsx', 'MetricCard.tsx', 'PropertyCard.tsx', 'BillViewer.tsx'],
      status: 'completed',
      color: 'green',
    },
    {
      name: 'Theme Layer',
      description: 'Design system and styling',
      files: ['mantine-theme.ts', 'globals.css'],
      status: 'completed',
      color: 'green',
    },
    {
      name: 'Configuration Layer',
      description: 'Build tools and TypeScript setup',
      files: ['vite.config.ts', 'tsconfig.json', 'package.json'],
      status: 'completed',
      color: 'green',
    },
  ];

  // Feature showcase
  const featureShowcase = [
    {
      title: 'Component System',
      description: 'Professional Mantine-based components',
      icon: IconComponents,
      demo: 'components',
      color: 'blue',
    },
    {
      title: 'Theme System',
      description: 'Custom utility company branding',
      icon: IconPalette,
      demo: 'theme',
      color: 'violet',
    },
    {
      title: 'Business Logic',
      description: 'Utility management functionality',
      icon: IconBuildingStore,
      demo: 'business',
      color: 'green',
    },
    {
      title: 'Data Visualization',
      description: 'Metrics and analytics dashboard',
      icon: IconChartLine,
      demo: 'data',
      color: 'orange',
    },
  ];

  const ComponentDemo = () => (
    <Stack gap="md">
      <Title order={4}>Interactive Component Library</Title>
      <Text c="dimmed">
        Our custom components built on top of Mantine's professional system
      </Text>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card withBorder p="md">
          <Stack gap="sm">
            <Text fw={500}>Button Variants</Text>
            <Group gap="sm">
              <CustomButton variant="primary" size="sm">Primary</CustomButton>
              <CustomButton variant="secondary" size="sm">Secondary</CustomButton>
              <CustomButton variant="utility" size="sm">Utility</CustomButton>
              <CustomButton variant="success" size="sm">Success</CustomButton>
              <CustomButton variant="danger" size="sm">Danger</CustomButton>
            </Group>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack gap="sm">
            <Text fw={500}>MetricCard Showcase</Text>
            <MetricCard
              title="Revenue"
              value="€45,231"
              subtitle="This month"
              trend={{ direction: 'up', value: 12, label: 'vs last month' }}
              icon={<IconBolt size={20} />}
              color="utility-green"
            />
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );

  const ThemeDemo = () => (
    <Stack gap="md">
      <Title order={4}>Design System Colors</Title>
      <Text c="dimmed">
        Custom utility company color palette optimized for the Greek market
      </Text>
      
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Paper p="md" style={{ background: 'var(--mantine-color-utility-blue-5)', color: 'white' }}>
          <Text fw={500}>Utility Blue</Text>
          <Text size="sm">#2563eb</Text>
        </Paper>
        <Paper p="md" style={{ background: 'var(--mantine-color-utility-green-5)', color: 'white' }}>
          <Text fw={500}>Utility Green</Text>
          <Text size="sm">#22c55e</Text>
        </Paper>
        <Paper p="md" style={{ background: 'var(--mantine-color-gray-8)', color: 'white' }}>
          <Text fw={500}>Professional Gray</Text>
          <Text size="sm">#1f2937</Text>
        </Paper>
        <Paper p="md" style={{ background: 'var(--mantine-color-orange-5)', color: 'white' }}>
          <Text fw={500}>Alert Orange</Text>
          <Text size="sm">#f97316</Text>
        </Paper>
      </SimpleGrid>

      <Alert icon={<IconInfoCircle size={16} />} color="blue">
        Our theme includes Greek-optimized font stacks and accessibility-first design principles
      </Alert>
    </Stack>
  );

  const BusinessDemo = () => (
    <Stack gap="md">
      <Title order={4}>Utility Management Features</Title>
      <Text c="dimmed">
        Core functionality that competes with traditional Greek utility companies
      </Text>
      
      <List
        spacing="md"
        size="sm"
        center
        icon={
          <ThemeIcon color="green" size={24} radius="xl">
            <IconCheck size={16} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <Text fw={500}>Automated Billing System</Text>
          <Text size="sm" c="dimmed">Smart calculation with real-time usage tracking</Text>
        </List.Item>
        <List.Item>
          <Text fw={500}>Property Management Dashboard</Text>
          <Text size="sm" c="dimmed">Comprehensive building and unit oversight</Text>
        </List.Item>
        <List.Item>
          <Text fw={500}>Customer Portal</Text>
          <Text size="sm" c="dimmed">Self-service payments and notifications</Text>
        </List.Item>
        <List.Item>
          <Text fw={500}>Analytics & Reporting</Text>
          <Text size="sm" c="dimmed">Energy consumption patterns and cost analysis</Text>
        </List.Item>
        <List.Item>
          <Text fw={500}>Mobile-First PWA</Text>
          <Text size="sm" c="dimmed">Works offline, installs like native app</Text>
        </List.Item>
      </List>
    </Stack>
  );

  const DataDemo = () => (
    <Stack gap="md">
      <Title order={4}>Real-Time Analytics Dashboard</Title>
      <Text c="dimmed">
        Live metrics showing how we're disrupting the utility industry
      </Text>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <MetricCard
          title="Monthly Revenue"
          value="€45,231"
          subtitle="Current month performance"
          trend={{ direction: 'up', value: 12, label: 'vs last month' }}
          icon={<IconBolt size={20} />}
          color="utility-green"
        />
        <MetricCard
          title="Active Customers"
          value={1234}
          subtitle="Growing customer base"
          trend={{ direction: 'up', value: 8, label: 'new this week' }}
          icon={<IconBuildingStore size={20} />}
          color="utility-blue"
        />
        <MetricCard
          title="Properties Managed"
          value={89}
          subtitle="Buildings and units"
          trend={{ direction: 'stable', value: 0, label: 'this month' }}
          icon={<IconDatabase size={20} />}
          color="blue"
        />
        <MetricCard
          title="Energy Efficiency"
          value="94.2%"
          subtitle="System performance"
          trend={{ direction: 'up', value: 2, label: 'improvement' }}
          icon={<IconRocket size={20} />}
          color="green"
        />
      </SimpleGrid>
    </Stack>
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="md" align="center" ta="center">
          <ThemeIcon size="xl" radius="xl" variant="gradient" gradient={{ from: 'utility-blue', to: 'utility-green' }}>
            <IconSearch size={28} />
          </ThemeIcon>
          <Title 
            order={1} 
            size="h1"
            style={{
              background: 'linear-gradient(45deg, var(--mantine-color-utility-blue-6), var(--mantine-color-utility-green-6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Frontend Investigation Dashboard
          </Title>
          <Text size="lg" c="dimmed" maw={600}>
            Interactive exploration of our UtilityPro PWA - the technology that will undercut traditional Greek utility companies
          </Text>
        </Stack>

        {/* Project Overview */}
        <Card withBorder p="xl">
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={2}>Project Overview</Title>
                <Text c="dimmed">Professional React PWA with TypeScript and Mantine UI</Text>
              </Stack>
              <Badge size="lg" variant="gradient" gradient={{ from: 'utility-blue', to: 'utility-green' }}>
                {projectStats.completion}% Complete
              </Badge>
            </Group>
            
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
              <Stack gap="xs" align="center">
                <Text size="xl" fw={700} c="utility-blue">{projectStats.totalFiles}</Text>
                <Text size="sm" c="dimmed">Total Files</Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xl" fw={700} c="utility-green">{projectStats.components}</Text>
                <Text size="sm" c="dimmed">Components</Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xl" fw={700} c="blue">{projectStats.pages}</Text>
                <Text size="sm" c="dimmed">Pages</Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xl" fw={700} c="orange">{projectStats.linesOfCode}+</Text>
                <Text size="sm" c="dimmed">Lines of Code</Text>
              </Stack>
            </SimpleGrid>

            <Progress value={projectStats.completion} size="lg" radius="md" />
          </Stack>
        </Card>

        {/* Architecture Timeline */}
        <Card withBorder p="xl">
          <Stack gap="lg">
            <Title order={2}>Architecture Layers</Title>
            <Timeline active={4} bulletSize={24} lineWidth={2}>
              {architectureLayers.map((layer, index) => (
                <Timeline.Item
                  key={index}
                  bullet={
                    <ThemeIcon size={24} radius="xl" color={layer.color}>
                      {layer.status === 'completed' ? <IconCheck size={12} /> : <IconClock size={12} />}
                    </ThemeIcon>
                  }
                  title={layer.name}
                >
                  <Text c="dimmed" size="sm" mb="xs">
                    {layer.description}
                  </Text>
                  <Group gap="xs">
                    {layer.files.map((file, fileIndex) => (
                      <Badge key={fileIndex} size="sm" variant="light" color={layer.color}>
                        {file}
                      </Badge>
                    ))}
                  </Group>
                </Timeline.Item>
              ))}
            </Timeline>
          </Stack>
        </Card>

        {/* Interactive Feature Showcase */}
        <Card withBorder p="xl">
          <Stack gap="lg">
            <Title order={2}>Interactive Feature Exploration</Title>
            
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
              {featureShowcase.map((feature, index) => (
                <Card
                  key={index}
                  withBorder
                  p="md"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    backgroundColor: activeDemo === feature.demo ? 'var(--mantine-color-gray-0)' : undefined,
                    borderColor: activeDemo === feature.demo ? `var(--mantine-color-${feature.color}-3)` : undefined,
                  }}
                  onClick={() => setActiveDemo(activeDemo === feature.demo ? null : feature.demo)}
                >
                  <Stack gap="sm" align="center" ta="center">
                    <ThemeIcon size="lg" radius="md" color={feature.color} variant="light">
                      <feature.icon size={20} />
                    </ThemeIcon>
                    <Text fw={500} size="sm">{feature.title}</Text>
                    <Text size="xs" c="dimmed">{feature.description}</Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            {/* Demo Content */}
            {activeDemo && (
              <Card withBorder p="lg" mt="md">
                {activeDemo === 'components' && <ComponentDemo />}
                {activeDemo === 'theme' && <ThemeDemo />}
                {activeDemo === 'business' && <BusinessDemo />}
                {activeDemo === 'data' && <DataDemo />}
              </Card>
            )}
          </Stack>
        </Card>

        {/* Technology Stack */}
        <Card withBorder p="xl">
          <Stack gap="lg">
            <Title order={2}>Technology Stack</Title>
            <Text c="dimmed">Modern frontend technologies powering our utility disruption</Text>
            
            <Accordion defaultValue="frontend">
              <Accordion.Item value="frontend">
                <Accordion.Control icon={<IconCode size={20} />}>
                  Frontend Framework
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="sm">
                    <Group>
                      <Badge color="blue">React 18</Badge>
                      <Badge color="blue">TypeScript 5</Badge>
                      <Badge color="blue">Vite 4</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Modern React with TypeScript for type safety and Vite for lightning-fast development
                    </Text>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="ui">
                <Accordion.Control icon={<IconComponents size={20} />}>
                  UI Framework
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="sm">
                    <Group>
                      <Badge color="cyan">Mantine 7</Badge>
                      <Badge color="cyan">Tabler Icons</Badge>
                      <Badge color="cyan">Custom Theme</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Professional component library with utility company branding and accessibility
                    </Text>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="build">
                <Accordion.Control icon={<IconSettings size={20} />}>
                  Build & Dev Tools
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="sm">
                    <Group>
                      <Badge color="green">ESLint</Badge>
                      <Badge color="green">Prettier</Badge>
                      <Badge color="green">Husky</Badge>
                      <Badge color="green">PWA Plugin</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Professional development workflow with code quality and PWA capabilities
                    </Text>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Card>

        {/* Call to Action */}
        <Paper 
          p="xl" 
          radius="lg"
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-utility-blue-0) 0%, var(--mantine-color-utility-green-0) 100%)',
            border: '1px solid var(--mantine-color-gray-2)',
          }}
        >
          <Stack gap="lg" align="center" ta="center">
            <Title order={3}>Ready to Disrupt Greek Utilities?</Title>
            <Text c="dimmed" maw={600}>
              Our frontend demonstrates the superior user experience and technology that will 
              undercut traditional utility companies. The foundation is solid and professional.
            </Text>
            <Group>
              <CustomButton variant="utility" size="lg">
                Continue to Backend
              </CustomButton>
              <CustomButton variant="outline" size="lg">
                Add More Features
              </CustomButton>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Investigation;