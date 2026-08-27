import { motion } from 'framer-motion';

interface LoginButtonProps {
  onClick?: () => void;
  scaleFactor?: number; // Optional scaling factor (useful for navbar scaling)
}

export default function LoginButton({ onClick, scaleFactor = 1 }: LoginButtonProps) {
  // Define animation states
  const buttonVariants = {
    initial: {
      y: 0,
      scale: 1,
    },
    hover: {
      y: -6,
      scale: 1.03,
      transition: { duration: 0.25, ease: 'easeOut' }
    },
    tap: {
      y: 4,
      scale: 0.98,
      transition: { duration: 0.1, ease: 'easeIn' }
    }
  };

  const shadowVariants = {
    initial: {
      y: 8,
      x: 8,
      scale: 1,
      opacity: 1
    },
    hover: {
      y: 12,
      x: 4,
      scale: 0.93,
      opacity: 0.85,
      transition: { duration: 0.25, ease: 'easeOut' }
    },
    tap: {
      y: 0,
      x: 0,
      scale: 0.95,
      opacity: 0.9,
      transition: { duration: 0.1, ease: 'easeIn' }
    }
  };

  const arrowVariants = {
    initial: {
      x: 0,
      scaleX: 1,
    },
    hover: {
      x: 8,
      scaleX: 1.05,
      transition: { duration: 0.25, ease: 'easeOut' }
    },
    tap: {
      x: 2,
      scaleX: 1.25, // Briefly stretches
      transition: { duration: 0.1, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative select-none cursor-pointer inline-block"
      style={{
        width: `${260 * scaleFactor}px`,
        height: `${96 * scaleFactor}px`,
        transform: `scale(${scaleFactor})`,
        transformOrigin: 'center center',
      }}
      onClick={onClick}
    >
      {/* Keyboard Focus Ring Wrapper */}
      <div className="absolute inset-0 rounded-[28px] focus-within:ring-4 focus-within:ring-brand-cyan focus-within:ring-offset-2 focus-within:ring-offset-[#071A26] transition-all">
        
        {/* Bottom Shadow Offset Layer */}
        <motion.div
          variants={shadowVariants}
          className="absolute inset-0 bg-black rounded-[28px] border-[6px] border-black pointer-events-none"
        />

        {/* Top Interactive Button Layer */}
        <motion.button
          variants={buttonVariants}
          aria-label="Login"
          className="absolute inset-0 bg-white border-[6px] border-black rounded-[28px] flex items-center justify-center gap-4 px-8 focus:outline-none"
        >
          {/* Centered LOGIN Text */}
          <span 
            className="text-black font-extrabold uppercase tracking-wide select-none"
            style={{
              fontSize: '32px',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            LOGIN
          </span>

          {/* Turquoise Right Chevron Arrow */}
          <motion.div variants={arrowVariants} className="flex items-center justify-center">
            <svg 
              width="22" 
              height="30" 
              viewBox="0 0 22 30" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="select-none pointer-events-none"
            >
              <path 
                d="M4 3L17 15L4 27" 
                stroke="#31D7E3" 
                strokeWidth="7" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
