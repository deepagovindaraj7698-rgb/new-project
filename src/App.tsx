import React, { useState, useRef } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  Camera, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  Globe, 
  Mic, 
  ShieldAlert, 
  Upload, 
  Zap,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { processIntent, IntentResult } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!input && !image) return;
    
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await processIntent(input, image || undefined);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setInput('');
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header / Grid Structure */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] flex items-center justify-center rounded-sm">
            <Zap className="text-[#E4E3E0] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tighter leading-none">BridgeAI</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Universal Intent Engine v1.0</p>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-mono uppercase tracking-wider opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
          <div>Latency: 240ms</div>
          <div>Core: Gemini 3.0</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-89px)]">
        {/* Left Column: Input */}
        <section className="lg:col-span-5 border-r border-[#141414] p-8 flex flex-col gap-8">
          <div className="space-y-2">
            <span className="font-serif italic text-xs uppercase opacity-50 tracking-widest">Step 01</span>
            <h2 className="text-3xl font-bold tracking-tighter uppercase">Capture Intent</h2>
            <p className="text-sm opacity-70 max-w-md">
              Input messy, unstructured data. Text, images, or documents. Our engine will bridge the gap to structured systems.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the situation, request, or observation..."
                className="w-full h-48 bg-transparent border border-[#141414] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] transition-all resize-none placeholder:opacity-30"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-sm"
                  title="Upload Image"
                >
                  <Camera size={16} />
                </button>
                <button 
                  className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-sm opacity-30 cursor-not-allowed"
                  title="Voice Input (Coming Soon)"
                >
                  <Mic size={16} />
                </button>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />

            <AnimatePresence>
              {image && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative aspect-video border border-[#141414] overflow-hidden group"
                >
                  <img src={image} alt="Input" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-1 bg-[#141414] text-[#E4E3E0] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleProcess}
              disabled={isProcessing || (!input && !image)}
              className={cn(
                "w-full py-4 bg-[#141414] text-[#E4E3E0] uppercase font-bold tracking-widest flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                isProcessing && "animate-pulse"
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  Bridge Intent
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            
            {result && (
              <button 
                onClick={reset}
                className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity text-center"
              >
                Clear and Start New Session
              </button>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-[#141414] border-dashed">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest opacity-40 font-mono">Encryption</p>
                <p className="text-[11px] font-bold">AES-256 Enabled</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest opacity-40 font-mono">Compliance</p>
                <p className="text-[11px] font-bold">GDPR / HIPAA Ready</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Output */}
        <section className="lg:col-span-7 bg-[#F0EFED] p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!result && !isProcessing && !error && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20"
              >
                <Globe size={80} strokeWidth={1} />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">Waiting for Input</h3>
                  <p className="max-w-xs text-sm">The bridge is idle. Provide unstructured data to begin the transformation process.</p>
                </div>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-2 border-[#141414] border-dashed rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="animate-pulse" size={32} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-tighter">Analyzing Neural Patterns</h3>
                  <div className="flex gap-1 justify-center">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-[#141414] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <ShieldAlert size={64} className="text-red-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase text-red-600">Processing Failure</h3>
                  <p className="text-sm max-w-sm">{error}</p>
                </div>
                <button 
                  onClick={handleProcess}
                  className="px-6 py-2 border border-[#141414] uppercase text-xs font-bold tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-all"
                >
                  Retry Connection
                </button>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Result Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414] pb-6">
                  <div className="space-y-1">
                    <span className="font-serif italic text-xs uppercase opacity-50 tracking-widest">Output Report</span>
                    <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Intent Resolved</h2>
                  </div>
                  <div className="flex gap-2">
                    <div className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#141414]",
                      result.priority === 'Critical' ? "bg-red-600 text-white border-red-600" : "bg-transparent"
                    )}>
                      Priority: {result.priority}
                    </div>
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#141414] bg-[#141414] text-[#E4E3E0]">
                      {result.category}
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-3">
                  <h4 className="font-serif italic text-xs uppercase opacity-50 tracking-widest">Executive Summary</h4>
                  <p className="text-lg leading-snug font-medium">{result.summary}</p>
                </div>

                {/* Structured Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-serif italic text-xs uppercase opacity-50 tracking-widest">Extracted Entities</h4>
                    <div className="border border-[#141414] divide-y divide-[#141414]">
                      {Object.entries(result.structuredData).map(([key, value]) => (
                        <div key={key} className="p-3 flex justify-between items-start gap-4">
                          <span className="text-[10px] uppercase font-mono opacity-50 shrink-0">{key}</span>
                          <span className="text-xs font-bold text-right">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-serif italic text-xs uppercase opacity-50 tracking-widest">System Triggers</h4>
                    <div className="space-y-2">
                      {result.recommendedActions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white border border-[#141414] shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                          <span className="text-xs font-medium">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ethical Guardrails */}
                <div className="p-6 bg-[#141414] text-[#E4E3E0] space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Ethical AI Guardrail</h4>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed italic">
                    {result.ethicalConsiderations}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="flex justify-end gap-4 pt-4">
                  <button className="px-6 py-3 border border-[#141414] uppercase text-[10px] font-bold tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center gap-2">
                    <FileText size={14} />
                    Export JSON
                  </button>
                  <button className="px-6 py-3 bg-[#141414] text-[#E4E3E0] uppercase text-[10px] font-bold tracking-widest hover:bg-opacity-90 transition-all flex items-center gap-2">
                    <Zap size={14} />
                    Execute Workflow
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Status Rail */}
      <footer className="border-t border-[#141414] bg-[#141414] text-[#E4E3E0] px-6 py-2 flex justify-between items-center overflow-hidden">
        <div className="flex gap-8 text-[9px] uppercase tracking-[0.2em] font-mono whitespace-nowrap">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Engine: Active
          </div>
          <div>Model: Gemini-3-Flash</div>
          <div className="hidden sm:block">Region: Asia-Southeast1</div>
          <div className="hidden md:block">Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
        </div>
        <div className="text-[9px] font-mono opacity-50">
          © 2026 BridgeAI Systems
        </div>
      </footer>
    </div>
  );
}
