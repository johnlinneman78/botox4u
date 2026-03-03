'use client'

import { motion } from 'framer-motion'
import React from 'react'

const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

export function StaggeredGrid({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            className={className}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    )
}
