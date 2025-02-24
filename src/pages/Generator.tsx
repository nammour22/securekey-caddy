import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Plus, Lock } from "lucide-react";

const Generator = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const generatePassword = () => {
    let characterSet = "";
    if (includeUppercase) characterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) characterSet += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) characterSet += "0123456789";
    if (includeSymbols) characterSet += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (characterSet === "") {
      toast({
        title: "Error",
        description: "Please select at least one character set.",
        variant: "destructive",
      });
      return;
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterSet.length);
      password += characterSet[randomIndex];
    }

    setGeneratedPassword(password);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const savePassword = () => {
    if (!accountName) {
      toast({
        title: "Error",
        description: "Account name is required to save the password.",
        variant: "destructive",
      });
      return;
    }

    const savedPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    const newPassword = {
      id: Date.now(),
      account: accountName,
      username: username,
      email: email,
      notes: notes,
      password: generatedPassword,
      createdAt: new Date().toISOString(),
    };
    savedPasswords.push(newPassword);
    localStorage.setItem("passwords", JSON.stringify(savedPasswords));
    toast({
      title: "Saved!",
      description: "Password saved successfully",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Lock className="w-6 h-6 text-sage-500" />
          <h1 className="text-xl font-semibold text-gray-900">SecureVault</h1>
        </div>
        
        <nav className="space-y-2">
          <a 
            href="/"
            className="block w-full p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            All Items
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Password Generator
          </h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <Label htmlFor="passwordLength" className="block text-sm font-medium text-gray-700">
                Password Length ({passwordLength})
              </Label>
              <Slider
                id="passwordLength"
                defaultValue={[passwordLength]}
                max={32}
                min={8}
                step={1}
                onValueChange={(value) => setPasswordLength(value[0])}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="rounded accent-sage-500 h-5 w-5"
                />
                <span className="text-gray-700">Include Uppercase</span>
              </label>

              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="rounded accent-sage-500 h-5 w-5"
                />
                <span className="text-gray-700">Include Lowercase</span>
              </label>

              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="rounded accent-sage-500 h-5 w-5"
                />
                <span className="text-gray-700">Include Numbers</span>
              </label>

              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                  className="rounded accent-sage-500 h-5 w-5"
                />
                <span className="text-gray-700">Include Symbols</span>
              </label>
            </div>

            <Button onClick={generatePassword} className="w-full bg-sage-500 hover:bg-sage-600">
              Generate Password
            </Button>

            {generatedPassword && (
              <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <Input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="bg-transparent border-none text-gray-700 focus:outline-none"
                  />
                  <Button variant="ghost" onClick={copyToClipboard}>
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>

          {generatedPassword && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Save Password</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    type="text"
                    id="accountName"
                    placeholder="e.g., Google, Facebook"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username (optional)</Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="e.g., johndoe123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="e.g., john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g., Security questions, recovery info"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <Button onClick={savePassword} className="w-full bg-sage-500 hover:bg-sage-600">
                  Save to Vault
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
