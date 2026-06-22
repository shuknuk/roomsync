import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface CircleExpandProps {
  isActive: boolean;
  origin: { x: number; y: number };
  onComplete?: () => void;
}

export function CircleExpand({ isActive, origin, onComplete }: CircleExpandProps) {
  const [shouldRender, setShouldRender] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              left: origin.x,
              top: origin.y,
              background: 'linear-gradient(135deg, #B89CFF 0%, #F4CCF5 100%)',
            }}
            initial={{
              width: 0,
              height: 0,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              width: '300vmax',
              height: '300vmax',
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (onComplete) {
                onComplete();
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
