import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Enter Collection Address',
      description:
        'Start by entering your Solana NFT collection address in the designated field.',
    },
    {
      number: 2,
      title: 'Point Camera at QR Code',
      description:
        'Once you have the collection address, click "Start Scanner" to activate your device camera.',
    },
    {
      number: 3,
      title: 'Scan the Physical QR Code',
      description: 'Point your camera at the QR code on the physical NFT card.',
    },
    {
      number: 4,
      title: 'Get Instant Verification',
      description:
        'The app instantly compares the scanned QR code against your collection address and displays the result.',
    },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-16 md:pt-24 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-2xl mx-auto z-10 relative px-4">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-display flex-1 text-center">
              How It Works
            </h1>
            <div className="w-10" />
          </div>

          {/* Introduction */}
          <div className="glass-card p-6 rounded-3xl text-center">
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Jocc NFT Validator uses Solana blockchain verification to
              authenticate physical NFTs instantly. Follow these simple steps to
              verify your NFT's authenticity.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="glass-card p-6 rounded-2xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20">
                      <span className="text-lg font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold font-display mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold font-display mb-4">
              Key Features
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Client-side verification - No server needed for validation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Instant results - Get verification status in milliseconds
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Secure - Works entirely on your device with no data sharing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Mobile-friendly - Use your smartphone camera for scanning
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/">
              <Button size="lg" className="text-base mb-4">
                Back to Scanner
              </Button>
            </Link>
          </div>
        </motion.div>
        <Footer />
      </main>
    </div>
  );
}
