import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover: React.FC<PopoverProps> = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  const wasOpenControlled = typeof open === 'boolean';

  const handleOpenChange = (newOpen: boolean) => {
    if (!wasOpenControlled) {
      setIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    if (wasOpenControlled) {
      setIsOpen(open!);
    }
  }, [open, wasOpenControlled]);

  return <PopoverContext.Provider value={{ isOpen, handleOpenChange }}>{children}</PopoverContext.Provider>;
};

interface PopoverContextType {
  isOpen: boolean;
  handleOpenChange: (newOpen: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

const usePopover = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover must be used within a Popover provider');
  }
  return context;
};

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  asChild,
  className,
  children,
  ...props
}) => {
  const { isOpen, handleOpenChange } = usePopover();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleOpenChange(!isOpen);
    props.onClick?.(event);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      'data-state': isOpen ? 'open' : 'closed',
    });
  }

  return (
    <button
      type="button"
      className={cn('focus:outline-none', className)}
      onClick={handleClick}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      {children}
    </button>
  );
};

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = 'center', sideOffset = 4, side = 'bottom', children, ...props }, ref) => {
    const { isOpen, handleOpenChange } = usePopover();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          handleOpenChange(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, handleOpenChange]);

    if (!isOpen) {
      return null;
    }

    const getAlignmentClasses = () => {
      const sideClass = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
      }[side];

      const alignClass = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
      }[align];

      return `${sideClass} ${alignClass}`;
    };

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          getAlignmentClasses(),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
