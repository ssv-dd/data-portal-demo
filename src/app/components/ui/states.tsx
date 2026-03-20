import { motion } from 'motion/react';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { fadeInUp } from '@/app/lib/motion';

interface StateContainerProps {
  className?: string;
  children: React.ReactNode;
}

function StateContainer({ className = '', children }: StateContainerProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <StateContainer className={className}>
      <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </StateContainer>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <StateContainer className={className}>
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6 text-muted-foreground" />}
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </StateContainer>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <StateContainer className={className}>
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </StateContainer>
  );
}
