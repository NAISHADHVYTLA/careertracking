import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

const AnimatedCard = ({ children, delay = 0, className, ...props }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
