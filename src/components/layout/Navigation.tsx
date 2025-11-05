import { forwardRef, useState } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import { Button } from '../ui';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  children?: NavigationItem[];
  active?: boolean;
  disabled?: boolean;
}

export interface NavigationProps extends HTMLAttributes<HTMLDivElement> {
  items: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  collapsed?: boolean;
  activeItemId?: string;
}

export interface NavigationItemProps extends HTMLAttributes<HTMLDivElement> {
  item: NavigationItem;
  collapsed?: boolean;
  active?: boolean;
  onItemClick?: (item: NavigationItem) => void;
  depth?: number;
}

export const Navigation = forwardRef<HTMLDivElement, NavigationProps>(
  ({
    items,
    onItemClick,
    collapsed = false,
    activeItemId,
    className = '',
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-1 p-2 ${className}`}
        {...props}
      >
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            active={item.id === activeItemId}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    );
  }
);

export const NavigationItem = forwardRef<HTMLDivElement, NavigationItemProps>(
  ({
    item,
    collapsed = false,
    active = false,
    onItemClick,
    depth = 0,
    className = '',
    ...props
  }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const isNested = depth > 0;

    const handleClick = () => {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      }
      
      if (item.onClick) {
        item.onClick();
      } else if (onItemClick) {
        onItemClick(item);
      }
    };

    const buttonClasses = `
      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
      ${active 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }
      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${isNested ? 'ml-6' : ''}
      ${collapsed ? 'justify-center px-2' : 'justify-start'}
    `;

    return (
      <div
        ref={ref}
        className={className}
        {...props}
      >
        <button
          className={buttonClasses}
          onClick={handleClick}
          disabled={item.disabled}
          title={collapsed ? item.label : undefined}
        >
          {/* Icon */}
          {item.icon && (
            <span className={`flex-shrink-0 ${collapsed ? '' : 'w-5 h-5'}`}>
              {item.icon}
            </span>
          )}

          {/* Label */}
          {!collapsed && (
            <span className="flex-1 text-left truncate">
              {item.label}
            </span>
          )}

          {/* Badge */}
          {!collapsed && item.badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {item.badge}
            </span>
          )}

          {/* Expand/Collapse Arrow */}
          {!collapsed && hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>

        {/* Children */}
        {!collapsed && hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavigationItem
                key={child.id}
                item={child}
                collapsed={collapsed}
                active={false}
                onItemClick={onItemClick}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

// Predefined navigation items for utility companies
export const customerNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Αρχική Σελίδα',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    href: '/dashboard',
  },
  {
    id: 'properties',
    label: 'Ακίνητα',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    href: '/properties',
  },
  {
    id: 'bills',
    label: 'Λογαριασμοί',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    children: [
      { id: 'bills-pending', label: 'Εκκρεμείς', href: '/bills/pending' },
      { id: 'bills-paid', label: 'Πληρωμένοι', href: '/bills/paid' },
      { id: 'bills-history', label: 'Ιστορικό', href: '/bills/history' },
    ],
  },
  {
    id: 'payments',
    label: 'Πληρωμές',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    href: '/payments',
  },
  {
    id: 'consumption',
    label: 'Κατανάλωση',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    href: '/consumption',
  },
  {
    id: 'profile',
    label: 'Προφίλ',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: '/profile',
  },
  {
    id: 'support',
    label: 'Υποστήριξη',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    children: [
      { id: 'support-faq', label: 'Συχνές Ερωτήσεις', href: '/support/faq' },
      { id: 'support-contact', label: 'Επικοινωνία', href: '/support/contact' },
      { id: 'support-tickets', label: 'Αιτήματα', href: '/support/tickets' },
    ],
  },
];

export const companyNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Κεντρική Σελίδα',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    href: '/admin/dashboard',
  },
  {
    id: 'customers',
    label: 'Πελάτες',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    children: [
      { id: 'customers-list', label: 'Λίστα Πελατών', href: '/admin/customers' },
      { id: 'customers-add', label: 'Νέος Πελάτης', href: '/admin/customers/add' },
    ],
  },
  {
    id: 'properties-mgmt',
    label: 'Διαχείριση Ακινήτων',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    href: '/admin/properties',
  },
  {
    id: 'billing',
    label: 'Χρέωση & Τιμολόγηση',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    children: [
      { id: 'billing-generate', label: 'Δημιουργία Λογαριασμών', href: '/admin/billing/generate' },
      { id: 'billing-rates', label: 'Τιμολογιακές Πολιτικές', href: '/admin/billing/rates' },
      { id: 'billing-reports', label: 'Αναφορές', href: '/admin/billing/reports' },
    ],
  },
  {
    id: 'analytics',
    label: 'Αναλυτικά Στοιχεία',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    href: '/admin/analytics',
  },
  {
    id: 'settings',
    label: 'Ρυθμίσεις',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    children: [
      { id: 'settings-company', label: 'Στοιχεία Εταιρείας', href: '/admin/settings/company' },
      { id: 'settings-users', label: 'Χρήστες', href: '/admin/settings/users' },
      { id: 'settings-system', label: 'Σύστημα', href: '/admin/settings/system' },
    ],
  },
];

Navigation.displayName = 'Navigation';
NavigationItem.displayName = 'NavigationItem';