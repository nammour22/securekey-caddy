import { motion } from "framer-motion";
import { 
  IconArrowLeft, 
  IconCopy, 
  IconRefresh, 
  IconDeviceFloppy,
  IconLock
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PasswordDetails {
  id: number;
  account: string;
  username?: string;
  email?: string;
  notes?: string;
  password: string;
  createdAt: string;
}

const Generator = () => {
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("Weak");
  const [isCopied, setIsCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const [saveDetails, setSaveDetails] = useState({
    account: "",
    username: "",
    email: "",
    notes: "",
  });

  const handleSavePassword = () => {
    if (!saveDetails.account.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    const existingPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    
    const newPassword: PasswordDetails = {
      id: Date.now(),
      account: saveDetails.account,
      username: saveDetails.username || undefined,
      email: saveDetails.email || undefined,
      notes: saveDetails.notes || undefined,
      password: password,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem("passwords", JSON.stringify([...existingPasswords, newPassword]));
    
    toast({
      title: "Success",
      description: "Password saved successfully",
    });
    
    setSaveDialogOpen(false);
    setSaveDetails({
      account: "",
      username: "",
      email: "",
      notes: "",
    });
    
    navigate("/");
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

              <Button className="bg-sage-500 hover:bg-sage-600" onClick={() => setSaveDialogOpen(true)}>
                <IconPlus className="w-4 h-4 mr-2" />
                Save Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account Name *</Label>
              <Input
                id="account"
                placeholder="e.g., Facebook, Twitter, Gmail..."
                value={saveDetails.account}
                onChange={(e) => setSaveDetails(prev => ({ ...prev, account: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                placeholder="Your username"
                value={saveDetails.username}
                onChange={(e) => setSaveDetails(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={saveDetails.email}
                onChange={(e) => setSaveDetails(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={saveDetails.notes}
                onChange={(e) => setSaveDetails(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={password} readOnly />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePassword}>
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Generator;
