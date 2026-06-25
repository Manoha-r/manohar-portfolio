import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      // Fetch scrollTop of the active scrolling page container, or fall back to main document scroll
      const scrollTop = target.scrollTop ?? (document.documentElement?.scrollTop || document.body?.scrollTop);
      if (scrollTop > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Use capture: true to intercept scroll events bubbling from the nested container divs
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu on location change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 260, damping: 24 } 
    },
    exit: { 
      opacity: 0, 
      y: 15, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <>
      {/* Brand logo in the top-left corner (stays in the exact same place) */}
      <div className="fixed z-[60] top-[18px] left-6 md:left-8 transition-colors duration-300 pointer-events-auto">
        <Link href="/" className="font-bold text-xl tracking-tighter transition-colors group flex items-center">
          <span className="relative inline-flex flex-col overflow-hidden h-[1.3em] leading-[1.3em]">
            <span className="transition-transform duration-300 ease-out group-hover:-translate-y-full block text-white">
              MB<span className="text-primary">.</span>
            </span>
            <span className="absolute top-full left-0 transition-transform duration-300 ease-out group-hover:-translate-y-full block text-primary">
              MB<span className="text-white">.</span>
            </span>
          </span>
        </Link>
      </div>

      {/* Hamburger button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-[60] top-[13px] right-6 p-2.5 rounded-full bg-black/60 border border-white/10 text-white md:hidden hover:bg-black/80 hover:border-white/20 transition-all pointer-events-auto shadow-lg backdrop-blur-md"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-primary animate-[spin_0.2s_ease-out]" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Floating pill navigation centered at the top (morphs to full width on scroll, hidden on mobile) */}
      <header className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-center pointer-events-none">
        {/* Backdrop Background Shape (Only this expands smoothly!) */}
        <div className={cn(
          "absolute transition-all duration-500 ease-out hidden md:block",
          isScrolled 
            ? "top-0 left-0 w-full h-full rounded-none bg-black/85 border-b border-white/10 shadow-lg" 
            : "top-3 h-10 w-[550px] rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        )} />

        {/* Navigation Links (Stay in the exact same place, centered!) */}
        <nav className="relative z-10 hidden md:flex items-center justify-center pointer-events-auto h-full">
          <div className="flex items-center gap-5 px-4">
            {links.map((link) => {
              const isActive = location === link.href;
              const linkClassName = cn(
                "text-xs md:text-sm font-medium transition-colors relative py-1 flex-shrink-0 group",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              );
              
              const linkContent = (
                <span className="relative inline-flex flex-col overflow-hidden h-[1.25em] leading-[1.25em]">
                  <span className="transition-transform duration-300 ease-out group-hover:-translate-y-full block">
                    {link.label}
                  </span>
                  <span className="absolute top-full left-0 transition-transform duration-300 ease-out group-hover:-translate-y-full block text-primary">
                    {link.label}
                  </span>
                </span>
              );

              if (link.isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={linkClassName}
                  >
                    {linkContent}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClassName}
                >
                  {linkContent}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(0,113,227,0.8)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="fixed inset-0 z-50 md:hidden bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 pointer-events-auto"
          >
            {/* Subtle light effects in the background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-600/10 blur-[120px] pointer-events-none" />

            <div className="flex flex-col items-center gap-6 z-10">
              {links.map((link) => {
                const isActive = location === link.href;
                const linkClassName = cn(
                  "text-2xl font-bold tracking-tight transition-colors py-2 block text-center",
                  isActive ? "text-primary text-3xl font-extrabold" : "text-zinc-400 hover:text-white"
                );

                return (
                  <motion.div key={link.href} variants={itemVariants} className="overflow-hidden">
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={linkClassName}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={linkClassName}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
