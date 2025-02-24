import { motion } from "framer-motion";
import { 
  Plus,
  Search,
  Lock,
  Copy,
  Trash,
  Pencil,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PinSetup from "@/components/PinSetup";

interface PasswordDetails {
  id: number;
  account: string;
  username?: string;
  email?: string;
  notes?: string;
  password: string;
  createdAt: string;
}

const Index = () => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<PasswordDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPassword, setSelectedPassword] = useState<PasswordDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState<PasswordDetails | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [tempSelectedPassword, setTempSelectedPassword] = useState<PasswordDetails | null>(null);
  const [lastPinVerification, setLastPinVerification] = useState<number | null>(null);
  const [showPinSetup, setShowPinSetup] = useState(false);

  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    setPasswords(savedPasswords);
  }, []);

  const filteredPasswords = passwords.filter(pwd =>
    pwd.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePasswordSelect = (pwd: PasswordDetails) => {
    const now = Date.now();
    const storedPin = localStorage.getItem("vault_pin");
    
    if (!storedPin) {
      setShowPinSetup(true);
      return;
    }

    // If within 5 minutes of last verification, show password details directly
    if (lastPinVerification && (now - lastPinVerification) < 5 * 60 * 1000) {
      setSelectedPassword(pwd);
      return;
    }

    setTempSelectedPassword(pwd);
    setEnteredPin("");
    setShowPinDialog(true);
  };

  const verifyPin = () => {
    const storedPin = localStorage.getItem("vault_pin");
    
    if (enteredPin === storedPin) {
      setLastPinVerification(Date.now());
      setSelectedPassword(tempSelectedPassword);
      setShowPinDialog(false);
      setEnteredPin("");
    } else {
      toast({
        title: "Error",
        description: "Incorrect PIN",
        variant: "destructive",
      });
      setEnteredPin("");
    }
  };

  const handleDelete = (id: number) => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!selectedPassword) return;
    
    const updatedPasswords = passwords.filter(pwd => pwd.id !== selectedPassword.id);
    localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
    setPasswords(updatedPasswords);
    setSelectedPassword(null);
    setShowDeleteConfirm(false);
    
    toast({
      title: "Deleted",
      description: "Password deleted successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const handleSaveEdit = () => {
    if (!editDetails) return;
    
    const updatedPasswords = passwords.map(pwd => 
      pwd.id === editDetails.id ? editDetails : pwd
    );
    
    localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
    setPasswords(updatedPasswords);
    setSelectedPassword(editDetails);
    setIsEditing(false);
    
    toast({
      title: "Updated",
      description: "Password details updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {showPinSetup && (
        <PinSetup onComplete={() => {
          setShowPinSetup(false);
          if (tempSelectedPassword) {
            setSelectedPassword(tempSelectedPassword);
          }
        }} />
      )}
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Lock className="w-6 h-6 text-sage-500" />
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Link to="/generate">
              <Button className="bg-sage-500 hover:bg-sage-600">
                <Plus className="w-4 h-4 mr-2" />
                New Password
              </Button>
            </Link>
          </div>

          {/* PIN Dialog */}
          <Dialog open={showPinDialog} onOpenChange={() => {
            setShowPinDialog(false);
            setTempSelectedPassword(null);
            setEnteredPin("");
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enter PIN</DialogTitle>
                <DialogDescription>
                  Please enter your PIN to view password details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>PIN</Label>
                  <Input
                    type="password"
                    maxLength={4}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && enteredPin.length === 4) {
                        verifyPin();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={verifyPin} disabled={enteredPin.length !== 4}>
                  Verify
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the password for {selectedPassword?.account}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Password Details Dialog */}
          <Dialog open={!!selectedPassword} onOpenChange={() => {
            setSelectedPassword(null);
            setShowPassword(false);
            setIsEditing(false);
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Password Details" : "Password Details"}
                </DialogTitle>
              </DialogHeader>
              
              {selectedPassword && (
                <div className="space-y-4 py-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Account Name</Label>
                        <Input
                          value={editDetails?.account || ""}
                          onChange={(e) => setEditDetails(prev => prev ? ({
                            ...prev,
                            account: e.target.value
                          }) : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input
                          value={editDetails?.username || ""}
                          onChange={(e) => setEditDetails(prev => prev ? ({
                            ...prev,
                            username: e.target.value
                          }) : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={editDetails?.email || ""}
                          onChange={(e) => setEditDetails(prev => prev ? ({
                            ...prev,
                            email: e.target.value
                          }) : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={editDetails?.notes || ""}
                          onChange={(e) => setEditDetails(prev => prev ? ({
                            ...prev,
                            notes: e.target.value
                          }) : null)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-500">Account</Label>
                          <p className="text-base">{selectedPassword.account}</p>
                        </div>
                        {selectedPassword.username && (
                          <div>
                            <Label className="text-sm text-gray-500">Username</Label>
                            <div className="flex items-center justify-between">
                              <p className="text-base">{selectedPassword.username}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(selectedPassword.username!)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedPassword.email && (
                          <div>
                            <Label className="text-sm text-gray-500">Email</Label>
                            <div className="flex items-center justify-between">
                              <p className="text-base">{selectedPassword.email}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(selectedPassword.email!)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm text-gray-500">Password</Label>
                          <div className="flex items-center justify-between">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={selectedPassword.password}
                              readOnly
                            />
                            <div className="flex space-x-2 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(selectedPassword.password)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {selectedPassword.notes && (
                          <div>
                            <Label className="text-sm text-gray-500">Notes</Label>
                            <p className="text-base whitespace-pre-wrap">{selectedPassword.notes}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <DialogFooter className="flex justify-between">
                <div>
                  {!isEditing && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedPassword!.id)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditDetails(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsEditing(true);
                        setEditDetails(selectedPassword);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Password List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {filteredPasswords.length === 0 ? (
              <div className="p-8 text-center">
                <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                      <Plus className="w-4 h-4 mr-2" />
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
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handlePasswordSelect(pwd)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {pwd.account}
                        </h3>
                        {pwd.username && (
                          <p className="text-xs text-gray-500">
                            Username: {pwd.username}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Added {new Date(pwd.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-sm text-sage-600 hover:text-sage-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePasswordSelect(pwd);
                        }}
                      >
                        View Details
                      </Button>
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
