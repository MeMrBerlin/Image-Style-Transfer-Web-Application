import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const DownloadButton = ({ styledCanvas, styleName, disabled }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!styledCanvas || disabled) return;

    try {
      setIsDownloading(true);

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        styledCanvas.toBlob(resolve, 'image/png');
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const styleSlug = styleName.toLowerCase().replace(/\s+/g, '_');
      link.download = `styled_${styleSlug}_${timestamp}.png`;
      link.href = url;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      toast({
        title: '✅ Download Complete!',
        description: 'Your styled image has been saved successfully.',
      });

      setIsDownloading(false);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: '❌ Download Failed',
        description: 'There was an error downloading your image.',
        variant: 'destructive',
      });
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center gap-3 ${
        disabled || isDownloading
          ? 'bg-gray-700 cursor-not-allowed opacity-50'
          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30'
      }`}
    >
      {isDownloading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download Styled Image</span>
        </>
      )}
    </motion.button>
  );
};

export default DownloadButton;