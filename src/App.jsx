import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import StyleTransferApp from '@/components/StyleTransferApp';
import Footer from '@/components/Footer'; // Import the new Footer component
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
          {/* Moved custom footer content to Footer.jsx component */}
          <Footer /> 
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default App;