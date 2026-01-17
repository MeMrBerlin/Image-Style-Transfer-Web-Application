import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ImageComparison = ({ originalImage, styledImage, styleName }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Original</h3>
          </div>
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-700 bg-gray-900">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Arrow Indicator */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Styled Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Styled {styleName && `(${styleName})`}
            </h3>
          </div>
          <div className="relative rounded-xl overflow-hidden border-2 border-purple-500 bg-gray-900 shadow-xl shadow-purple-500/30">
            {styledImage ? (
              <img
                src={styledImage}
                alt="Styled"
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-800">
                <p className="text-gray-500">Styled image will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageComparison;