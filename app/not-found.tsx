"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@base-ui/react/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="block text-9xl font-bold text-ocean-500 md:text-[12rem]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404
        </motion.span>
        <motion.h1
          className="mt-4 text-2xl font-semibold text-white md:text-3xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="mx-auto mt-2 max-w-md text-white/70"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/">
            <Button className="mt-8 rounded-xl bg-ocean-600 px-6 py-3 text-base font-medium text-white hover:bg-ocean-500">
              Back to home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
