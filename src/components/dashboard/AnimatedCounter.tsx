import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ 
  value, 
  duration = 1, 
  className,
  suffix = "",
  prefix = ""
}: AnimatedCounterProps) => {
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0 
  });
  
  const display = useTransform(spring, (current) => 
    `${prefix}${Math.round(current).toLocaleString()}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
};

export default AnimatedCounter;
