import { motion } from "framer-motion";
import {
  IconCopy,
  IconSettings,
  IconShieldCheck,
  IconPlus,
  IconLock,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Generator = () => {
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("Weak");
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordLength, includeUppercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    updateStrengthIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const generatePassword = () => {
    let characterList = "";

    if (includeUppercase) {
      characterList += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (includeNumbers) {
      characterList += "0123456789";
    }
    if (includeSymbols) {
      characterList += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    }

    if (!characterList) {
      characterList = "abcdefghijklmnopqrstuvwxyz";
    } else {
      characterList += "abcdefghijklmnopqrstuvwxyz";
    }

    let newPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characterList.length);
      newPassword += characterList.charAt(characterIndex);
    }
    setPassword(newPassword);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const updateStrengthIndicator = () => {
    let strengthValue = "Weak";
    if (password.length >= 8) {
      strengthValue = "Medium";
    }
    if (
      password.length >= 12 &&
      ((includeUppercase && /[A-Z]/.test(password)) ||
        (includeNumbers && /[0-9]/.test(password)) ||
        (includeSymbols && /[^a-zA-Z0-9]/.test(password)))
    ) {
      strengthValue = "Strong";
    }
    setStrength(strengthValue);
  };

  const handleSavePassword = () => {
    setIsDialogOpen(true);
  };

  const savePassword = () => {
    if (!accountName) {
      toast({
        title: "Error",
        description: "Account name is required",
      });
      return;
    }

    const savedPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    const newPassword = {
      id: Date.now(),
      account: accountName,
      password: password,
      createdAt: new Date().toISOString(),
    };
    savedPasswords.push(newPassword);
    localStorage.setItem("passwords", JSON.stringify(savedPasswords));
    setIsDialogOpen(false);
    setAccountName("");
    toast({
      title: "Saved!",
      description: "Password saved to vault",
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Password Generator
            </h1>
            <p className="text-gray-600 mb-6">
              Generate secure, random passwords with custom requirements.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 bg-gray-100 border-gray-300 rounded-md px-4 py-2 text-gray-700 mr-4"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="hover:bg-gray-200"
                >
                  <IconCopy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-gray-700 font-medium">Password Strength:</div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-500">{strength}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-gray-700 font-medium">Options:</div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="rounded-sm text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-500">Include Uppercase</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="rounded-sm text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-500">Include Numbers</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="rounded-sm text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-500">Include Symbols</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="text-gray-700 font-medium">Password Length:</div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Length: {passwordLength} characters
                </div>
              </div>

              <Button className="bg-sage-500 hover:bg-sage-600" onClick={handleSavePassword}>
                <IconPlus className="w-4 h-4 mr-2" />
                Save Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Save Password</h2>
            <p className="text-gray-600 mb-6">
              Enter an account name to save this password to your vault.
            </p>
            <Input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end space-x-4">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-sage-500 hover:bg-sage-600" onClick={savePassword}>
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Generator;
