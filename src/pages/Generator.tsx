
import { motion } from "framer-motion";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Generator = () => {
  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Link 
          to="/" 
          className="inline-flex items-center text-sage-500 hover:text-sage-600 mb-6"
        >
          <IconArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="glass-panel rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Password Generator
          </h1>
          <p className="text-gray-600 mb-6">
            Generate secure, random passwords with custom requirements.
          </p>
          
          {/* Password generator functionality will be implemented here */}
          <div className="text-center text-gray-500">
            Password generator coming soon...
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Generator;
