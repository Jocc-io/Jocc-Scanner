import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrScanner } from '@/components/qr-scanner';
import {
  CheckCircle2,
  XCircle,
  Search,
  ArrowLeft,
  QrCode,
  Focus,
  X,
  Lightbulb,
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

type AppStep = 'input' | 'scanning' | 'result';

interface ScanResult {
  isMatch: boolean;
  nftId?: string;
  rawText?: string;
}

export default function Home() {
  const { toast } = useToast();
  const [step, setStep] = useState<AppStep>('input');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionAddress.trim()) {
      toast({
        title: 'Address Required',
        description: 'Please enter a collection address to verify against.',
        variant: 'destructive',
      });
      return;
    }
    if (collectionAddress.trim().startsWith('0x')) {
      toast({
        title: 'Unsupported Network',
        description: 'This application only works on the Solana network.',
        variant: 'destructive',
      });
      return;
    }
    setStep('scanning');
  };

  const handleScan = (decodedText: string) => {
    // Expected format from NFTCard: "Collection: {collectionId} | ID: #{nftNumber}"
    // OR "Collection: {collectionId}"
    // Old format: "COLLECTION_ADDRESS #NFT_ID"

    let scannedAddress = '';
    let nftId = '';
    let isMatch = false;

    if (decodedText.startsWith('Collection: ')) {
      // New format: "Collection: <id> | ID: #<number>"
      const parts = decodedText.split(' | ID: #');
      scannedAddress = parts[0].replace('Collection: ', '').trim();
      if (parts.length >= 2) {
        nftId = parts[1].trim();
      }

      isMatch =
        scannedAddress.toLowerCase() === collectionAddress.trim().toLowerCase();
    } else {
      // Fallback to old format: "COLLECTION_ADDRESS #NFT_ID"
      const parts = decodedText.split(' #');
      if (parts.length >= 2) {
        scannedAddress = parts[0].trim();
        nftId = parts[1].trim();
        isMatch =
          scannedAddress.toLowerCase() ===
          collectionAddress.trim().toLowerCase();
      } else {
        // Format mismatch
        isMatch = false;
      }
    }

    setResult({
      isMatch,
      nftId,
      rawText: decodedText,
    });

    setStep('result');
  };

  const resetState = () => {
    setResult(null);
    setStep('input');
  };

  const scanAnother = () => {
    setResult(null);
    setStep('scanning');
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-start pt-16 lg:pt-32
    overflow-hidden relative">
      {/* Background ambient glow */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] 
      bg-primary/10 rounded-full blur-[120px] pointer-events-none"
      />

      <main className="w-full max-w-md mx-auto z-10 relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <motion.div
              key="step-input"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <span
                    className="text-6xl font-bold text-transparent bg-clip-text 
                     bg-gradient-to-r from-blue-400 via-purple-400 to-purple-700 ">
                    Jocc
                  </span>
                  <h1 className="text-2xl font-bold font-display text-gradient">
                    NFT Validator
                  </h1>
                  <p
                    className="text-muted-foreground text-xs md:text-sm max-w-[340px] md:max-w-[400px] 
                  mx-auto leading-relaxed">
                    Enter the collection address, <br />
                    then scan the NFT QR code to verify authenticity.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleStartScan}
                className="glass-card p-6 rounded-3xl space-y-6">
                <div className="space-y-3">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-foreground/80 ml-1">
                    Solana NFT Collection Address
                  </label>
                  <Input
                    id="address"
                    placeholder="e.g. 4RHERyDGjRL5.....C2ofS19TY8hhodR"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                    className="font-mono text-sm border-blue-500"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base group">
                  <QrCode className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Scanner
                </Button>
              </form>
            </motion.div>
          )}
          {/* Icons for QR Image Modal and How It Works */}
          <div className="flex fixed top-4 right-4 lg:top-32 lg:right-32 z-20 gap-2 lg:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImageModal(true)}
              className="hidden md:block p-2 lg:p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
              title="View QR Code Image">
              <Focus className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </motion.button>
            <Link href="/how-it-works">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 lg:p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                title="How It Works">
                <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </motion.button>
            </Link>
          </div>

          {/* Image Modal */}
          <AnimatePresence>
            {showImageModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowImageModal(false)}
                  className="fixed inset-0 bg-black/50 z-50"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed top-1/4 left-3/4 -translate-x-1/2 -translate-y-1/2 z-50 bg-background p-6 rounded-2xl">
                  <div className="relative">
                    <button
                      onClick={() => setShowImageModal(false)}
                      className="absolute -top-3 -right-3 p-2 rounded-full bg-destructive/20 hover:bg-destructive/30 transition-colors">
                      <X className="w-5 h-5 text-destructive" />
                    </button>
                    <img
                      src="/qr.png"
                      alt="QR Code Preview"
                      className="w-[300px] md:w-[300px] rounded-xl"
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* STEP 2: SCANNING */}
          {step === 'scanning' && (
            <motion.div
              key="step-scanning"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-6 h-full">
              <div className="flex items-center justify-between px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetState}
                  className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                  <h2 className="font-semibold font-display">Scan QR Code</h2>
                  <p className="text-xs text-muted-foreground truncate w-48 font-mono">
                    {collectionAddress.slice(0, 6)}...
                    {collectionAddress.slice(-4)}
                  </p>
                </div>
                <div className="w-10" /> {/* Spacer for alignment */}
              </div>

              <div className="flex-1 flex items-center justify-center py-8">
                <QrScanner onScan={handleScan} />
              </div>

              <div className="text-center glass-card mx-4 p-4 rounded-2xl mt-auto mb-8">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Point camera at the NFT's QR code
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && result && (
            <motion.div
              key="step-result"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
              <div className="relative">
                {/* Decorative glow behind icon */}
                <div
                  className={`absolute inset-0 blur-3xl opacity-50 rounded-full scale-150 ${result.isMatch ? 'bg-success' : 'bg-destructive'}`}
                />

                {result.isMatch ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}>
                    <CheckCircle2 className="w-32 h-32 text-[#16a34a] drop-shadow-[0_0_15px_rgba(22,163,74,0.5)] relative z-10" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}>
                    <XCircle className="w-32 h-32 text-destructive drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] relative z-10" />
                  </motion.div>
                )}
              </div>

              <div className="text-center space-y-4 px-4 glass-card w-full py-8 rounded-3xl">
                <h2
                  className={`text-3xl font-bold font-display ${result.isMatch ? 'text-[#4ade80]' : 'text-red-400'}`}>
                  {result.isMatch ? 'NFT Found' : 'Invalid Match'}
                </h2>

                {result.isMatch ? (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">
                      Success
                    </p>
                    <div className="mt-4 inline-block bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        Authenticated ID
                      </p>
                      <p className="text-2xl font-mono font-bold text-white">
                        #{result.nftId}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground/80 leading-relaxed max-w-[280px] mx-auto">
                    This NFT does not belong to the specified collection.
                  </p>
                )}

                {!result.isMatch && result.rawText && (
                  <div className="mt-4 p-3 bg-black/40 rounded-lg text-left overflow-hidden">
                    <p className="text-xs text-muted-foreground mb-1">
                      Scanned payload:
                    </p>
                    <p className="text-xs font-mono text-white/60 truncate">
                      {result.rawText}
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={scanAnother}
                  variant={result.isMatch ? 'success' : 'default'}>
                  Scan Another
                </Button>
                <Button size="lg" variant="ghost" onClick={resetState}>
                  Change Collection
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </main>
    </div>
  );
}
