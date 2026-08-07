import React from 'react'
import { motion } from 'framer-motion'

export default function StepIndicator({ steps, currentStep, isRTL }) {
  return (
    <div className="flex items-start">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-shrink-0">
              <motion.div
                className={`step-${isActive ? 'active' : isCompleted ? 'completed' : 'pending'}`}
                animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 1.6, repeat: isActive ? Infinity : 0, repeatDelay: 0.6, ease: 'easeInOut' }}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-primary-700 dark:text-primary-400'
                    : isCompleted
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {label}
              </motion.span>
            </div>

            {!isLast && (
              <div className="flex-1 mx-2 sm:mx-3 mt-5 flex-shrink-0" aria-hidden="true">
                <div
                  className={`h-1 rounded-full transition-colors duration-500 ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
