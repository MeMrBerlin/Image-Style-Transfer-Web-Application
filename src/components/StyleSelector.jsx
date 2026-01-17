import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Image as ImageIcon, Sparkles, Grid, Droplets, Zap } from 'lucide-react';
import StyleTransferService from '@/services/StyleTransferService';

// Map icons to styles for visual appeal
const STYLE_ICONS = {
  'watercolor': Droplets,
  'udnie': Zap,
  'mosaic': Grid,
  'pointillism': Sparkles,
  'starry-night': Sparkles,
  'oil-painting': Palette,
};

const GRADIENTS = {
  'watercolor': 'from-pink-400 via-purple-400 to-indigo-400',
  'udnie': 'from-orange-500 via-pink-500 to-purple-500',
  'mosaic': 'from-blue-500 via-cyan-500 to-teal-500',
  'pointillism': 'from-yellow-500 via-orange-500 to-red-500',
  'starry-night': 'from-indigo-600 via-blue-600 to-cyan-500',
  'oil-painting': 'from-amber-600 via-orange-600 to-red-600',
};

const StyleSelector = ({ selectedStyle, onStyleSelect, disabled }) => {
  const styles = StyleTransferService.getAvailableStyles();

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Choose Your Style</h2>
          <p className="text-sm text-gray-400">Select a neural style model</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style) => {
          const Icon = STYLE_ICONS[style.id] || ImageIcon;
          const gradient = GRADIENTS[style.id] || 'from-gray-600 to-gray-400';
          const isSelected = selectedStyle === style.id;

          return (
            <motion.button
              key={style.id}
              onClick={() => !disabled && onStyleSelect(style.id)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.97 } : {}}
              className={`relative group overflow-hidden rounded-xl transition-all duration-300 text-left ${
                isSelected
                  ? 'bg-gray-800 ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                  : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Header Gradient */}
              <div className={`h-24 w-full bg-gradient-to-br ${gradient} p-4 flex items-start justify-between relative overflow-hidden`}>
                <Icon className="w-8 h-8 text-white/90 z-10" />
                
                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute left-1/2 top-1/2 w-16 h-16 bg-black/10 rounded-full blur-xl" />
                
                {isSelected && (
                  <motion.div
                    layoutId="check"
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className={`font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {style.name}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {style.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;