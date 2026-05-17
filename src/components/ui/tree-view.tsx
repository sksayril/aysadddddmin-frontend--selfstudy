import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TreeItemProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TreeItem: React.FC<TreeItemProps> = ({
  label,
  children,
  defaultExpanded = false,
  className,
  onClick,
  isSelected = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const hasChildren = React.Children.count(children) > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  return (
    <div className={cn("select-none", className)}>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors min-w-0',
          isSelected ? 'bg-blue-50 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-800'
        )}
        onClick={handleClick}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
          )
        ) : (
          <div className="w-4 shrink-0" />
        )}
        <div className="text-sm truncate flex-1 min-w-0">{label}</div>
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-gray-200 pl-2 mt-1">
          {children}
        </div>
      )}
    </div>
  );
};