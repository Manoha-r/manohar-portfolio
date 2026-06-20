import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
  { href: "/resume.pdf", label: "Resume", isExternal: true },
];

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <>
      {/* Brand logo in the top-left corner (stays in the exact same place) */}
      <div className="fixed z-[60] top-[18px] left-6 md:left-8 transition-colors duration-300">
        <Link href="/" className="font-bold text-xl tracking-tighter transition-colors group flex items-center">
          <span className="relative inline-flex flex-col overflow-hidden h-[1.3em] leading-[1.3em]">
            <span className="transition-transform duration-300 ease-out group-hover:-translate-y-full block">
              MB<span className="text-primary">.</span>
            </span>
            <span className="absolute top-full left-0 transition-transform duration-300 ease-out group-hover:-translate-y-full block text-primary">
              MB<span className="text-white">.</span>
            </span>
          </span>
        </Link>
      </div>

      {/* Floating pill navigation centered at the top (morphs to full width on scroll) */}
      <header className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-center pointer-events-none">
        {/* Backdrop Background Shape (Only this expands smoothly!) */}
        <div className={cn(
          "absolute transition-all duration-500 ease-out",
          isScrolled 
            ? "top-0 left-0 w-full h-full rounded-none bg-black/85 border-b border-white/10 shadow-lg" 
            : "top-3 h-10 w-[94%] sm:w-[550px] rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        )} />

        {/* Navigation Links (Stay in the exact same place, centered!) */}
        <nav className="relative z-10 flex items-center justify-center pointer-events-auto h-full">
          <div className="flex items-center gap-3 sm:gap-5 px-4">
            {links.map((link) => {
              const isActive = location === link.href;
              const linkClassName = cn(
                "text-[10px] sm:text-xs md:text-sm font-medium transition-colors relative py-1 flex-shrink-0 group",
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
    </>
  );
}
