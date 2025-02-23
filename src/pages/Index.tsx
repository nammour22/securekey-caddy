
import { motion } from "framer-motion";
import { IconKey, IconShield, IconLock } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-block p-2 rounded-xl bg-sage-100">
          <IconShield className="w-8 h-8 text-sage-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          SecureVault
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Your digital fortress for passwords. Simple, secure, and beautifully designed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
      >
        <Link to="/generate">
          <div className="glass-panel rounded-xl p-6 hover:scale-[1.02] transition-all cursor-pointer">
            <IconKey className="w-8 h-8 text-sage-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Password Generator
            </h2>
            <p className="text-gray-600">
              Create strong, unique passwords instantly
            </p>
          </div>
        </Link>

        <Link to="/vault">
          <div className="glass-panel rounded-xl p-6 hover:scale-[1.02] transition-all cursor-pointer">
            <IconLock className="w-8 h-8 text-sage-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Password Vault
            </h2>
            <p className="text-gray-600">
              Securely store and manage your passwords
            </p>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500">
          Built with security and simplicity in mind
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
