import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(
      <MantineProvider>
        <Button>Click me</Button>
      </MantineProvider>
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders button with variant prop', () => {
    render(
      <MantineProvider>
        <Button variant="primary">Primary Button</Button>
      </MantineProvider>
    );

    expect(screen.getByText('Primary Button')).toBeInTheDocument();
  });

  it('renders disabled button', () => {
    render(
      <MantineProvider>
        <Button disabled>Disabled Button</Button>
      </MantineProvider>
    );

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });
});
