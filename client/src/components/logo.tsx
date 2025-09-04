"use client";

import Link from "next/link";

import SustiImage from "../../public/assets/images/susti-sunbear.svg";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  size: "large" | "small";
  className?: string;
}

const Logo = ({ size, className }: LogoProps) => {
  return (
    <div className="min-h-6">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5 }}
          key={size}
        >
          <Link href="/">
            <Image
              src={SustiImage}
              alt="Finance App Logo"
              className={className}
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Logo;
