import React, { createContext, useContext, useState } from 'react';

interface CollapsibleContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextType>({ open: false, setOpen: () => {} });

export function Collapsible({ open, defaultOpen, onOpenChange, children, ...props }: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = open !== undefined ? open : internalOpen;
  const toggle = (val: boolean) => {
    if (open === undefined) setInternalOpen(val);
    onOpenChange?.(val);
  };
  return (
    <CollapsibleContext.Provider value={{ open: isOpen, setOpen: toggle }}>
      <div {...props}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(CollapsibleContext);
  return <button onClick={() => setOpen(!open)} {...props}>{children}</button>;
}

export function CollapsibleContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(CollapsibleContext);
  if (!open) return null;
  return <div {...props}>{children}</div>;
}
