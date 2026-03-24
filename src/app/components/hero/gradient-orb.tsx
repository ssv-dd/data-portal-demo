import { motion } from 'motion/react';
import styled from 'styled-components';

interface GradientOrbProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary';
}

const OrbBase = styled(motion.div)<{ $variant: 'primary' | 'secondary' }>`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(64px);
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'linear-gradient(to bottom right, rgba(232, 121, 249, 0.25), rgba(167, 139, 250, 0.20), rgba(103, 232, 249, 0.25))'
      : 'linear-gradient(to bottom right, rgba(196, 181, 253, 0.20), rgba(216, 180, 254, 0.15), rgba(249, 168, 212, 0.20))'};
`;

export function GradientOrb({ className, style, variant = 'primary' }: GradientOrbProps) {
  return (
    <OrbBase
      className={className}
      style={style}
      $variant={variant}
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
