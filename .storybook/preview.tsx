import type { Preview } from '@storybook/react';
import { MantineProvider } from '@mantine/core';
import { utilityProTheme } from '../src/theme';
import '../src/theme/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1b1e',
        },
        {
          name: 'gray',
          value: '#f8f9fa',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider theme={utilityProTheme}>
        <Story />
      </MantineProvider>
    ),
  ],
};

export default preview;
