import { forwardRef, useState } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

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

