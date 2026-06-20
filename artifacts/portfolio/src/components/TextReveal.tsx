import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  variant?: "chars" | "words";
}

export function TextReveal({ text, className = "", delay = 0, variant = "words" }: TextRevealProps) {
  // Check if this is the first load where the 3D intro cinematic is active
  const isFirstLoad = typeof window !== "undefined" && !sessionStorage.getItem("intro_played");
  const finalDelay = isFirstLoad ? delay + 3.25 : delay;

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: variant === "chars" ? 0.015 : 0.05,
        delayChildren: finalDelay
      },
    },
  };

  const charVariants = {
    hidden: {
      y: "115%",
      rotate: 2.5,
      opacity: 0,
    },
    visible: {
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as any, // easeOutQuint for custom silky animation
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as any, // easeOutQuint
      },
    },
  };

  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em] last:mr-0">
          <span
            className="inline-block overflow-hidden whitespace-nowrap"
            style={{ paddingBottom: "0.15em", marginBottom: "-0.15em" }}
          >
            {variant === "chars" ? (
              Array.from(word).map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={charVariants}
                  className="inline-block origin-bottom-left"
                >
                  {char}
                </motion.span>
              ))
            ) : (
              <motion.span
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            )}
          </span>
        </span>
      ))}
    </motion.span>
  );
}
