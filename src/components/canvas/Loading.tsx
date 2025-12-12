import { motion } from "framer-motion";
import LOGO from "/images/retreever-icon.png";

const Loading: React.FC = () => {
  const logoSize = 80;
  const cornerRadius = 16;

  return (
    <div className="h-screen w-screen bg-surface-800 text-surface-300 flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">

        {/* smooth background glow (SVG Gaussian blur) */}
        <svg
          width={900}
          height={900}
          viewBox="0 0 900 900"
          className="absolute -z-10 pointer-events-none"
          style={{ left: "50%", transform: "translateX(-50%)", bottom: "35%" }}
          aria-hidden
        >
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#141516" stopOpacity="0.98" />
              <stop offset="40%" stopColor="#191a1c" stopOpacity="0.82" />
              <stop offset="80%" stopColor="#0f1011" stopOpacity="0.36" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <filter id="fg" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="72" result="b" />
            </filter>
          </defs>

          <circle cx={450} cy={450} r={340} fill="url(#g1)" filter="url(#fg)" />
        </svg>

        {/* logo with floating motion */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],  // gentle breathing
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: `${Math.round(cornerRadius * 0.78)}px`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
          }}
        >
          <img
            src={LOGO}
            alt="Retreever"
            draggable={false}
            style={{
              width: "72%",
              height: "72%",
              objectFit: "contain",
              zIndex: 2,
            }}
          />
        </motion.div>

        {/* label + dots */}
        <div className="flex flex-col items-center">
          <div className="text-sm tracking-wide text-surface-200/85 uppercase">
            Loading Retreever...
          </div>
          <div className="mt-3 flex items-center gap-2">
            <motion.span
              animate={{ y: [0, -6, 0], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              className="w-2 h-2 rounded-full bg-surface-200/70"
            />
            <motion.span
              animate={{ y: [0, -6, 0], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }}
              className="w-2 h-2 rounded-full bg-surface-200/70"
            />
            <motion.span
              animate={{ y: [0, -6, 0], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
              className="w-2 h-2 rounded-full bg-surface-200/70"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loading;
