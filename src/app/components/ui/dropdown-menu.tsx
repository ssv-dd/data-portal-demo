import React from 'react';

export { Menu as DropdownMenu } from '@doordash/prism-react';

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>;

export const DropdownMenuContent = ({ children }: { children: React.ReactNode; align?: string }) => <>{children}</>;

export const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const DropdownMenuItem = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) => <div onClick={onClick}>{children}</div>;

export const DropdownMenuSeparator = () => null;
