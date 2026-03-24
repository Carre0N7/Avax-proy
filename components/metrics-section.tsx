"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const match = value.match(/^([^0-9.-]*)([0-9.]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const numStr = match ? match[2] : "0";
  const suffix = match ? match[3] : "";
  const endNum = parseFloat(numStr);
  const isFloat = numStr.includes(".");
  const decimals = isFloat ? numStr.split(".")[1].length : 0;

  useEffect(() => {
    if (!isInView) return;
    
    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(easeOut * endNum);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endNum);
        setHasAnimated(true);
      }
    };
    
    // Add a slight delay to the number counting based on the component's entry animation
    const timeout = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [endNum, isInView, delay]);

  const displayValue = hasAnimated ? value : ${prefix};

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="text-center relative group"
    >
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 md:text-5xl lg:text-6xl drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
        {displayValue}
      </div>
      <div className="relative z-10 mt-3 text-sm font-bold tracking-[0.2em] text-primary/80 uppercase">
        {label}
      </div>
    </motion.div>
  );
}

export function MetricsSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Parallax effect for the background video
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const stats = [
    { value: "10K+", label: "Heroes Minted" },
    { value: "50K+", label: "Battles Fought" },
    { value: "<0.01", label: "Avg Gas Fee" },
    { value: "500ms", label: "Finality" },
  ];

  return (
    <section ref={containerRef} className="relative flex items-center justify-center py-32 overflow-hidden border-y border-border/20 bg-black">
      {/* Background Video with Parallax */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 z-0 h-[140%] w-full bg-black/50"
      >
        <video 
          src="/metrics-bg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="relative z-10 h-full w-full object-cover opacity-60 mix-blend-screen"
        />
        {/* Fallback if video isn't loaded */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-sm text-white/40">
          <span className="mb-2 font-medium">Metrics Video Placeholder</span>
          <span>Save your new video as <strong>metrics-bg.mp4</strong> in the <strong>public</strong> folder.</span>
        </div>
      </motion.div>

      {/* Dark + Red Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-black/70 to-black" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-900/40 via-transparent to-red-900/40 mix-blend-multiply" />
      
      {/* Glowing Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] rounded-[100%] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <AnimatedStat 
              key={stat.label} 
              value={stat.value} 
              label={stat.label} 
              delay={0.1 * index} // Staggered animation
            />
          ))}
        </div>
      </div>
    </section>
  )
}
