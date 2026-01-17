import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import StyleTransferService from '@/services/StyleTransferService';

// Components
import ImageUploader from './ImageUploader';
import StyleSelector from './StyleSelector';
import ProcessingIndicator from './ProcessingIndicator';
import ImageComparison from './ImageComparison';
import DownloadButton from './DownloadButton';

const StyleTransferApp = () => {
  // State Management
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedCanvas, setUploadedCanvas] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // Results
  const [styledImage, setStyledImage] = useState(null);
  const [styledCanvas, setStyledCanvas] = useState(null);
  
  // Status: 'idle' | 'loading_model' | 'processing_image' | 'complete' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);
  
  const { toast } = useToast();

  const handleImageUpload = (file, canvas) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setUploadedCanvas(canvas);
      // Reset results when new image uploaded
      setStyledImage(null);
      setStyledCanvas(null);
      setStatus('idle');
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    setErrorMessage(null);
  };

  const handleApplyStyle = async () => {
    if (!uploadedCanvas || !selectedStyle) {
      toast({
        title: 'Missing Requirements',
        description: 'Please upload an image and select a style first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setErrorMessage(null);
      
      // Phase 1: Load Model
      setStatus('loading_model');
      await StyleTransferService.loadModel(selectedStyle);

      // Phase 2: Process Image
      setStatus('processing_image');
      
      // Small delay to allow UI to update and render the processing state
      await new Promise(r => setTimeout(r, 100));

      const outputTensor = await StyleTransferService.transferStyle(
        uploadedCanvas,
        selectedStyle
      );

      // Convert result to canvas
      const resultCanvas = await StyleTransferService.tensorToCanvas(outputTensor);
      const dataUrl = resultCanvas.toDataURL('image/png');
      
      // Clean up tensor memory
      outputTensor.dispose();

      setStyledCanvas(resultCanvas);
      setStyledImage(dataUrl);
      setStatus('complete');

      toast({
        title: 'Success!',
        description: 'Artistic style transfer completed successfully.',
      });

    } catch (err) {
      console.error('Style Transfer Error:', err);
      setStatus('error');
      setErrorMessage(err.message || "Failed to process image. Please try again.");
      
      toast({
        title: 'Processing Failed',
        description: 'Could not apply style transfer. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16">
      <ProcessingIndicator status={status} />

      <div className="space-y-16">
        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageUploader onImageUpload={handleImageUpload} />
        </motion.section>

        {/* Style Selection */}
        {uploadedImage && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={handleStyleSelect}
              disabled={status === 'loading_model' || status === 'processing_image'}
            />
          </motion.section>
        )}

        {/* Action Button */}
        {uploadedImage && selectedStyle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <button
              onClick={handleApplyStyle}
              disabled={status === 'loading_model' || status === 'processing_image'}
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="flex items-center gap-3 relative z-10">
                <Wand2 className={`w-5 h-5 ${status !== 'idle' && status !== 'complete' && status !== 'error' ? 'animate-spin' : ''}`} />
                <span>
                  {status === 'idle' || status === 'complete' || status === 'error' ? 'Generate Artwork' : 'Processing...'}
                </span>
              </div>
            </button>

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/50"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errorMessage}</span>
                <button onClick={handleApplyStyle} className="ml-2 hover:text-white underline text-xs">
                  Retry
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Results Section */}
        {styledImage && status === 'complete' && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="space-y-8 pt-8 border-t border-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Masterpiece</h2>
              <button 
                onClick={() => document.getElementById('comparison-view').scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> View Comparison
              </button>
            </div>

            <div id="comparison-view">
              <ImageComparison
                originalImage={uploadedImage}
                styledImage={styledImage}
                styleName={selectedStyle}
              />
            </div>

            <div className="flex justify-center pt-4">
              <DownloadButton
                styledCanvas={styledCanvas}
                styleName={selectedStyle}
                disabled={false}
              />
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default StyleTransferApp;