import React from 'react';
import { Loader2 } from 'lucide-react';

// ==============================================================================================
// 
// START: MOTION SIMULATION & TYPES (Replacing 'motion/react' and interface)
// 
// ==============================================================================================

// Simple wrapper to simulate motion.div functionality without the external library.
// It applies the necessary classes for the inline CSS animation.
const motion = {
    div: ({ children, className, animate, transition, ...props }) => {
        // We look for 'rotate: 360' to apply the rotation class defined in the style block.
        const rotationClass = (animate && animate.rotate === 360) ? 'animate-spin-slow' : '';
        return <div className={`${className} ${rotationClass}`} {...props}>{children}</div>;
    },
    p: ({ children, className, ...props }) => <p className={className} {...props}>{children}</p>,
};

// ==============================================================================================
// 
// END: MOTION SIMULATION & TYPES
// 
// ==============================================================================================

export function LoadingSpinner({ size = 'md', text, theme = 'dark' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    // Inline style for animation definition
    <>
        <style>{`
            /* Define the keyframes for continuous rotation */
            @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            /* Apply the animation */
            .animate-spin-slow {
                animation: spin-slow 1s linear infinite;
            }
        `}</style>

        <motion.div
            className="flex flex-col items-center justify-center gap-3 p-4"
        >
            <motion.div
                animate={{ rotate: 360 }} // motion wrapper converts this to CSS class
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 className={`${sizeClasses[size]} text-blue-400`} />
            </motion.div>
            {text && (
                <motion.p
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
                >
                    {text}
                </motion.p>
            )}
        </motion.div>
    </>
  );
}
