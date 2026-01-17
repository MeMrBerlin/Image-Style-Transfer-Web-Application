import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, BrainCircuit, Loader2 } from 'lucide-react';

const ProcessingIndicator = ({ status }) => {
  // status: 'idle' | 'loading_model' | 'processing_image' | 'complete' | 'error'
  const isVisible = status === 'loading_model' || status === 'processing_image';

  const getPhaseInfo = () => {
    if (status === 'loading_model') {
      return {
        icon: BrainCircuit,
        title: "Loading Neural Model",
        description: "Fetching model weights from TensorFlow Hub...",
        color: "from-blue-500 to-indigo-500",
        progressColor: "bg-blue-500"
      };
    }
    return {
      icon: Sparkles,
      title: "Creating Masterpiece",
      description: "Applying artistic style transformation...",
      color: "from-purple-500 to-pink-500",
      progressColor: "bg-purple-500"
    };
  };

  const phase = getPhaseInfo();
  const Icon = phase.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${phase.color}`} />
            
            <div className="flex flex-col items-center gap-6 text-center relative z-10">
              
              {/* Icon Animation */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${phase.color} opacity-20 blur-xl absolute inset-0`}
                />
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                {status === 'loading_model' && (
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-2 -bottom-2 bg-gray-800 rounded-full p-1.5 border border-gray-700"
                  >
                    <Download className="w-4 h-4 text-blue-400" />
                  </motion.div>
                )}
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {phase.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-2">
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <motion.div
                    className={`h-full ${phase.progressColor}`}
                    initial={{ width: "0%" }}
                    animate={{ width: status === 'loading_model' ? "60%" : "100%" }}
                    transition={{ duration: status === 'loading_model' ? 2 : 3, ease: "easeInOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>{status === 'loading_model' ? 'INIT_TENSORS' : 'COMPUTING_GRAPH'}</span>
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {status === 'loading_model' ? 'EST: 2s' : 'EST: 3s'}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessingIndicator;