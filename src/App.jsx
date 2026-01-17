import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import StyleTransferApp from '@/components/StyleTransferApp';
import { Toaster } from '@/components/ui/toaster';
import { Palette, Sparkles, Download, Github } from 'lucide-react';

function App() {
  return (
    <>
      <Helmet>
        <title>AI Style Transfer - Transform Your Images Into Art</title>
        <meta
          name="description"
          content="Apply legendary artistic styles to your photos using TensorFlow.js and AI. Transform images with Van Gogh, Picasso, and other artistic styles in seconds."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-purple-500/30">
        
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <Hero />

          {/* Main App Section */}
          <main
            id="app-section"
            className="py-12 md:py-24 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-950"
          >
            <StyleTransferApp />
          </main>

          {/* Footer */}
          <footer className="bg-gray-950 border-t border-gray-800/60 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                
                {/* Brand */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">AI Style Transfer</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    Transform your photos into masterpieces using state-of-the-art TensorFlow.js models running entirely in your browser.
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-white font-semibold mb-6 tracking-wide">Capabilities</h3>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex items-center gap-3 group">
                      <div className="p-1 rounded bg-gray-800 group-hover:bg-purple-500/20 transition-colors">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      6 Neural Art Styles
                    </li>
                    <li className="flex items-center gap-3 group">
                      <div className="p-1 rounded bg-gray-800 group-hover:bg-blue-500/20 transition-colors">
                        <Github className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      TensorFlow Hub Integration
                    </li>
                    <li className="flex items-center gap-3 group">
                      <div className="p-1 rounded bg-gray-800 group-hover:bg-green-500/20 transition-colors">
                        <Download className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      Privacy-First (Local Processing)
                    </li>
                  </ul>
                </div>

                {/* Guide */}
                <div>
                  <h3 className="text-white font-semibold mb-6 tracking-wide">Quick Guide</h3>
                  <ol className="space-y-3 text-gray-400 text-sm">
                    <li className="flex gap-3">
                      <span className="font-mono text-purple-500">01</span>
                      Upload image (JPG/PNG/WebP)
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-purple-500">02</span>
                      Select one of 6 art styles
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-purple-500">03</span>
                      Wait for model inference
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-purple-500">04</span>
                      Download high-res artwork
                    </li>
                  </ol>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-800/60 text-center">
                <p className="text-gray-500 text-xs">
                  © 2026 AI Style Transfer. Powered by TensorFlow.js, React, and TailwindCSS.
                </p>
              </div>
            </div>
          </footer>
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default App;