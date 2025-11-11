import { useState, useEffect } from 'react';
import {
  Indicator,
  Menu,
  Button,
  Stack,
  Text,
  Badge,
  Group,
  ScrollArea,
  Divider,
  ActionIcon,
} from '@mantine/core';
import { IconBell, IconCheck, IconTrash } from '@tabler/icons-react';

export interface Notification {
  id: string;
  type: 'BILL' | 'PAYMENT' | 'ALERT' | 'MAINTENANCE' | 'ANNOUNCEMENT';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulated notifications - in production, this would fetch from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'BILL',
        title: 'New Bill Generated',
        message: 'Your electricity bill for November 2024 is ready',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'PAYMENT',
        title: 'Payment Received',
        message: 'Payment of €120.50 has been processed successfully',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'ALERT',
        title: 'Bill Overdue',
        message: 'Your October bill is overdue. Please make payment to avoid service interruption',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BILL':
        return 'blue';
      case 'PAYMENT':
        return 'green';
      case 'ALERT':
        return 'red';
      case 'MAINTENANCE':
        return 'orange';
      case 'ANNOUNCEMENT':
        return 'grape';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Menu shadow="md" width={360} position="bottom-end">
      <Menu.Target>
        <Indicator
          inline
          label={unreadCount}
          size={16}
          disabled={unreadCount === 0}
          color="red"
        >
          <ActionIcon variant="light" size="lg">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <Group justify="space-between" p="sm" pb={0}>
          <Text size="sm" fw={600}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Button
              variant="subtle"
              size="xs"
              onClick={handleMarkAllAsRead}
              leftSection={<IconCheck size={12} />}
            >
              Mark all read
            </Button>
          )}
        </Group>

        <Divider my="sm" />

        <ScrollArea h={400} type="auto">
          {notifications.length === 0 ? (
            <Stack align="center" p="xl">
              <IconBell size={32} stroke={1.5} style={{ opacity: 0.3 }} />
              <Text size="sm" c="dimmed">
                No notifications
              </Text>
            </Stack>
          ) : (
            <Stack gap={0}>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <Group
                    gap="sm"
                    p="sm"
                    style={{
                      backgroundColor: notification.isRead
                        ? 'transparent'
                        : 'var(--mantine-color-blue-0)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--mantine-color-gray-0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notification.isRead
                        ? 'transparent'
                        : 'var(--mantine-color-blue-0)';
                    }}
                  >
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Badge
                          size="xs"
                          color={getNotificationColor(notification.type)}
                        >
                          {notification.type}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {formatDate(notification.createdAt)}
                        </Text>
                      </Group>
                      <Text size="sm" fw={500}>
                        {notification.title}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {notification.message}
                      </Text>
                    </Stack>
                    <Stack gap={4}>
                      {!notification.isRead && (
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <IconCheck size={14} />
                        </ActionIcon>
                      )}
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete"
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Stack>
                  </Group>
                  {index < notifications.length - 1 && <Divider />}
                </div>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );
}
