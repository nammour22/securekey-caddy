import { motion } from "framer-motion";
import { IconArrowLeft, IconCopy, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SavedPassword {
  id: number;
  account: string;
  password: string;
  createdAt: string;
}

const Vault = () => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);

  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    setPasswords(savedPasswords);
  }, []);

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const deletePassword = (id: number) => {
    const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
    localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
    setPasswords(updatedPasswords);
    toast({
      title: "Deleted",
      description: "Password removed from vault",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <IconLock className="w-6 h-6 text-sage-500" />
          <h1 className="text-xl font-semibold text-gray-900">SecureVault</h1>
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="/"
            className="block w-full p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            All Items
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="max-w-2xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center text-sage-500 hover:text-sage-600 mb-6"
          >
            <IconArrowLeft className="w-5 h-5 mr-2" />
            Back to All Items
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Password Vault
            </h1>
            <p className="text-gray-600 mb-6">
              Securely store and manage your passwords.
            </p>
            
            <div className="space-y-4">
              {passwords.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No passwords saved yet. Generate and save some passwords!
                </div>
              ) : (
                passwords.map((pwd) => (
                  <div 
                    key={pwd.id} 
                    className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{pwd.account}</h3>
                        <input
                          type="password"
                          value={pwd.password}
                          readOnly
                          className="mt-1 bg-transparent border-none text-gray-600 focus:outline-none"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(pwd.password)}
                          className="hover:bg-gray-200"
                        >
                          <IconCopy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePassword(pwd.id)}
                          className="hover:bg-gray-200 hover:text-red-500"
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Added on {new Date(pwd.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;
