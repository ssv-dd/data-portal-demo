import React from 'react';

export { Select } from '@doordash/prism-react';

export const SelectTrigger = (_props: React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: string; id?: string }) => null;
export const SelectValue = (_props: { placeholder?: string }) => null;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = (_props: { value: string; children: React.ReactNode }) => null;
export const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectLabel = (_props: { children: React.ReactNode }) => null;
export const SelectSeparator = () => null;
export const SelectScrollUpButton = () => null;
export const SelectScrollDownButton = () => null;
