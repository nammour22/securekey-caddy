import { motion } from "framer-motion";
import { 
  IconPlus, 
  IconSearch, 
  IconLock, 
  IconCopy, 
  IconTrash, 
  IconEdit,
  IconEye,
  IconEyeOff
} from "@tabler/icons-react";
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
} from "@/components/ui/dialog";
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

const Index = () => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<PasswordDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPassword, setSelectedPassword] = useState<PasswordDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState<PasswordDetails | null>(null);

  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords") || "[]");
    setPasswords(savedPasswords);
  }, []);

  const filteredPasswords = passwords.filter(pwd =>
    pwd.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
    localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
    setPasswords(updatedPasswords);
    setSelectedPassword(null);
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
                            <IconCopy className="w-4 h-4" />
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
                            <IconCopy className="w-4 h-4" />
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
                              <IconEyeOff className="w-4 h-4" />
                            ) : (
                              <IconEye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(selectedPassword.password)}
                          >
                            <IconCopy className="w-4 h-4" />
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
                  <IconTrash className="w-4 h-4 mr-2" />
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
                  <IconEdit className="w-4 h-4 mr-2" />
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
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedPassword(pwd)}
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
                      setSelectedPassword(pwd);
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
  );
};

export default Index;
