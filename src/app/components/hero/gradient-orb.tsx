import { motion } from 'motion/react';
import { cn } from '../ui/utils';

interface GradientOrbProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function GradientOrb({ className, variant = 'primary' }: GradientOrbProps) {
  // Light mode: Beautiful soft pastels with high saturation for vibrancy
  // Dark mode: Rich, saturated colors inspired by the downloaded file
  const gradientClasses = variant === 'primary'
    ? 'bg-gradient-to-br from-fuchsia-400/25 via-violet-400/20 to-cyan-300/25 dark:from-fuchsia-500/30 dark:via-violet-500/20 dark:to-cyan-400/20'
    : 'bg-gradient-to-br from-violet-300/20 via-purple-300/15 to-pink-300/20 dark:from-violet-600/25 dark:via-purple-500/15 dark:to-pink-500/20';

  return (
    <motion.div
      className={cn(
        'absolute w-[500px] h-[500px] rounded-full pointer-events-none',
        gradientClasses,
        'blur-3xl',
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.5, 0.7, 0.5],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  );
}
