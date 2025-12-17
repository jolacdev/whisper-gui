import { Variants } from 'motion/react';

// NOTE: https://motion.dev/docs/react-animation#variants

export const transcriptionLoaderVariants: Variants = {
  initial: { opacity: 0, scale: 0, y: -100 },
  mount: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
    y: 0,
  },
  unmount: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.3 },
    y: -100,
  },
};
