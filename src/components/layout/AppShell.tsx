import { forwardRef } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  navbar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
  withBorder?: boolean;
  navbarOffsetBreakpoint?: string;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  height?: number;
  withBorder?: boolean;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  width?: number;
  collapsed?: boolean;
  withBorder?: boolean;
  breakpoint?: string;
}

export interface MainProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  ({
    children,
    navbar,
    header,
    footer,
    aside,
    withBorder: _withBorder = true,
    navbarOffsetBreakpoint: _navbarOffsetBreakpoint = 'md',
    className = '',
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={`min-h-screen bg-gray-50 ${className}`}
        {...props}
      >
        {header}
        
        <div className="flex">
          {navbar}
          
          <div className="flex-1 flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            {footer}
          </div>
          
          {aside}
        </div>
      </div>
    );
  }
);

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({
    children,
    height = 64,
    withBorder = true,
    className = '',
    ...props
  }, ref) => {
    return (
      <header
        ref={ref}
        className={`
          bg-white shadow-sm z-40 sticky top-0
          ${withBorder ? 'border-b border-gray-200' : ''}
          ${className}
        `}
        style={{ height }}
        {...props}
      >
        <div className="h-full px-4 flex items-center justify-between">
          {children}
        </div>
      </header>
    );
  }
);

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({
    children,
    width = 280,
    collapsed = false,
    withBorder = true,
    breakpoint: _breakpoint = 'md',
    className = '',
    ...props
  }, ref) => {
    return (
      <nav
        ref={ref}
        className={`
          bg-white h-screen sticky top-0 overflow-y-auto
          ${withBorder ? 'border-r border-gray-200' : ''}
          ${collapsed ? 'w-16' : ''}
          ${className}
        `}
        style={{ width: collapsed ? 64 : width }}
        {...props}
      >
        <div className="h-full flex flex-col">
          {children}
        </div>
      </nav>
    );
  }
);

export const Main = forwardRef<HTMLElement, MainProps>(
  ({
    children,
    className = '',
    ...props
  }, ref) => {
    return (
      <main
        ref={ref}
        className={`flex-1 ${className}`}
        {...props}
      >
        {children}
      </main>
    );
  }
);

export const Footer = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({
    children,
    className = '',
    ...props
  }, ref) => {
    return (
      <footer
        ref={ref}
        className={`bg-white border-t border-gray-200 p-4 ${className}`}
        {...props}
      >
        {children}
      </footer>
    );
  }
);

AppShell.displayName = 'AppShell';
Header.displayName = 'Header';
Navbar.displayName = 'Navbar';
Main.displayName = 'Main';
Footer.displayName = 'Footer';