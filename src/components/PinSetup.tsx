
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

interface PinSetupProps {
  onComplete: () => void;
}

const PinSetup = ({ onComplete }: PinSetupProps) => {
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSetupPin = () => {
    if (pin.length !== 4) {
      toast({
        title: "Error",
        description: "PIN must be 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "Error",
        description: "PINs do not match",
        variant: "destructive",
      });
      setPin("");
      setConfirmPin("");
      return;
    }

    localStorage.setItem("vault_pin", pin);
    toast({
      title: "Success",
      description: "PIN set successfully",
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <Shield className="w-12 h-12 text-sage-500" />
          <h2 className="text-xl font-semibold text-center">Set Your PIN</h2>
          <p className="text-sm text-gray-500 text-center">
            Create a 4-digit PIN to protect your passwords. You'll need this PIN to view password details.
          </p>
          
          <div className="w-full space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Enter PIN</Label>
              <Input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 4-digit PIN"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Confirm PIN</Label>
              <Input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Confirm 4-digit PIN"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pin.length === 4 && confirmPin.length === 4) {
                    handleSetupPin();
                  }
                }}
              />
            </div>

            <Button 
              onClick={handleSetupPin}
              className="w-full"
              disabled={pin.length !== 4 || confirmPin.length !== 4}
            >
              Set PIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSetup;
