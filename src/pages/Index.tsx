
import { motion } from "framer-motion";
import { IconPlus, IconSearch, IconLock } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SavedPassword {
  id: number;
  account: string;
  password: string;
  createdAt: string;
}

const Index = () => {
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    setPasswords(savedPasswords);
  }, []);

  const filteredPasswords = passwords.filter(pwd =>
    pwd.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="block w-full p-2 rounded-lg bg-sage-50 text-sage-700 font-medium"
          >
            All Items
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search passwords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Link to="/generate">
              <Button className="bg-sage-500 hover:bg-sage-600">
                <IconPlus className="w-4 h-4 mr-2" />
                New Password
              </Button>
            </Link>
          </div>

          {/* Password List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {filteredPasswords.length === 0 ? (
              <div className="p-8 text-center">
                <IconLock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "No passwords found" : "No passwords saved yet"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? "Try adjusting your search terms"
                    : "Start by generating and saving your first password"
                  }
                </p>
                {!searchQuery && (
                  <Link to="/generate">
                    <Button className="bg-sage-500 hover:bg-sage-600">
                      <IconPlus className="w-4 h-4 mr-2" />
                      New Password
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPasswords.map((pwd) => (
                  <div 
                    key={pwd.id} 
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {pwd.account}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Added {new Date(pwd.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link 
                        to="/vault"
                        className="text-sm text-sage-600 hover:text-sage-700"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
