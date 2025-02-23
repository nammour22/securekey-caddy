
import { motion } from "framer-motion";
import { IconArrowLeft, IconCopy, IconRefresh } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Generator = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (characters === '') {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length[0]; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    setPassword(result);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '' };
    
    const strength = {
      0: { text: 'Very Weak', color: 'bg-red-500' },
      1: { text: 'Weak', color: 'bg-orange-500' },
      2: { text: 'Medium', color: 'bg-yellow-500' },
      3: { text: 'Strong', color: 'bg-green-500' },
      4: { text: 'Very Strong', color: 'bg-green-600' },
    };

    let score = 0;
    if (length[0] >= 12) score++;
    if (options.uppercase && options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;

    return strength[score as keyof typeof strength];
  };

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
          
          <div className="space-y-6">
            {/* Password Display */}
            <div className="relative">
              <input
                type="text"
                value={password}
                readOnly
                placeholder="Click generate to create password"
                className="w-full p-4 bg-gray-50 rounded-lg text-lg font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={generatePassword}
                  className="hover:bg-gray-200"
                >
                  <IconRefresh className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!password}
                  className="hover:bg-gray-200"
                >
                  <IconCopy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength:</span>
                  <span>{getPasswordStrength().text}</span>
                </div>
                <div className={`h-2 rounded-full ${getPasswordStrength().color}`} />
              </div>
            )}

            {/* Length Slider */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Password Length</span>
                <span className="text-sm text-gray-500">{length[0]} characters</span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={32}
                min={4}
                step={1}
                className="w-full"
              />
            </div>

            {/* Character Types */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Character Types</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={options.uppercase}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, uppercase: checked === true }))
                    }
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={options.lowercase}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, lowercase: checked === true }))
                    }
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={options.numbers}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, numbers: checked === true }))
                    }
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={options.symbols}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, symbols: checked === true }))
                    }
                  />
                  <span>Symbols (!@#$...)</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generatePassword}
              className="w-full bg-sage-500 hover:bg-sage-600 text-white"
            >
              Generate Password
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Generator;
