import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' } : {}}
    className={clsx('bg-white rounded-xl border border-gray-100 shadow-sm', className)}
    {...props}
  >
    {children}
  </motion.div>
);
export default Card;
