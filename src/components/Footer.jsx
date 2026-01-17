import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="relative w-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-t border-gray-800 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-xl font-semibold text-white tracking-wider">
            Made with ❤️ by <span className="text-purple-400">Nishan</span>
          </p>

          <div className="flex space-x-6">
            <motion.a
              href="https://github.com/MeMrBerlin/Image-Style-Transfer-Web-Application"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-purple-500/30"
              whileHover={{ scale: 1.1, backgroundColor: '#8B5CF6' }} // Purple-600
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-6 h-6 group-hover:text-white transition-colors duration-300" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/nishan-das-62b7892a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-blue-500/30"
              whileHover={{ scale: 1.1, backgroundColor: '#3B82F6' }} // Blue-600
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-6 h-6 group-hover:text-white transition-colors duration-300" />
            </motion.a>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            © {currentYear} Nishan. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;