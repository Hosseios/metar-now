
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, AlertTriangle, Shield, Database, Mail, Eraser, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AccountDeletion = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showAccountConfirmation, setShowAccountConfirmation] = useState(false);
  const [showDataConfirmation, setShowDataConfirmation] = useState(false);

  const handleDeleteData = async () => {
    if (!user) return;

    setIsDeletingData(true);
    try {
      // Delete user's favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting user data:', error);
        throw error;
      }

      toast({
        title: "Data Deleted Successfully",
        description: "Your favorites and associated data have been deleted. Your account remains active.",
      });
      
      setShowDataConfirmation(false);
    } catch (error) {
      console.error('Data deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your data. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (confirmEmail !== user.email) {
      toast({
        title: "Email Mismatch",
        description: "Please enter your email address exactly as shown.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Delete user's favorites first
      const { error: favoritesError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('Error deleting favorites:', favoritesError);
        // Continue with account deletion even if favorites deletion fails
      }

      // Delete the user account from Supabase Auth
      const { error: deleteError } = await supabase.rpc('delete_user');
      
      if (deleteError) {
        console.error('Error deleting user account:', deleteError);
        throw deleteError;
      }

      // Sign out after successful deletion
      await signOut();
      
      toast({
        title: "Account Deleted Successfully",
        description: "Your account and all associated data have been permanently deleted.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Account deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your account. Please contact support for assistance.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Data & Account Management</h1>
              <p className="text-slate-400">Control your data and account settings</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <span>Important Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-200 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-200 mb-2">Choose Your Option:</h4>
                <ul className="space-y-1 text-blue-300">
                  <li>• <strong>Delete Data Only:</strong> Remove your saved favorites while keeping your account</li>
                  <li>• <strong>Delete Account:</strong> Permanently remove your account and all data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {user ? (
            <>
              {/* Data Deletion Section */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-lg">
                      <Eraser className="w-5 h-5 text-orange-400" />
                    </div>
                    <span>Delete Data Only</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Delete your saved data while keeping your account active. This will remove:
                  </p>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <ul className="space-y-1 text-orange-300">
                      <li>• All saved favorite airports</li>
                      <li>• Your preferences and settings</li>
                    </ul>
                    <p className="text-orange-200 text-sm mt-3">
                      <strong>Your account will remain active</strong> and you can continue using the app.
                    </p>
                  </div>
                  
                  {!showDataConfirmation ? (
                    <Button
                      onClick={() => setShowDataConfirmation(true)}
                      variant="outline"
                      className="bg-orange-500/20 border-orange-500/40 text-orange-300 hover:bg-orange-500/30"
                    >
                      <Eraser className="w-4 h-4 mr-2" />
                      Delete My Data
                    </Button>
                  ) : (
                    <div className="space-y-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-orange-300 font-medium">
                        Are you sure you want to delete your data? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleDeleteData}
                          disabled={isDeletingData}
                          variant="outline"
                          className="bg-orange-500/20 border-orange-500/40 text-orange-300 hover:bg-orange-500/30"
                        >
                          {isDeletingData ? "Deleting..." : "Yes, Delete Data"}
                        </Button>
                        <Button
                          onClick={() => setShowDataConfirmation(false)}
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Deletion Section */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white">
                    <div className="p-2 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg">
                      <User className="w-5 h-5 text-red-400" />
                    </div>
                    <span>Delete Entire Account</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    You are currently signed in as: <strong className="text-white">{user.email}</strong>
                  </p>
                  
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-300 font-medium mb-2">
                      <strong>Account deletion is permanent and cannot be undone.</strong>
                    </p>
                    <ul className="space-y-1 text-red-300">
                      <li>• Your user account and login credentials</li>
                      <li>• All saved favorite airports</li>
                      <li>• All personal preferences and settings</li>
                    </ul>
                  </div>
                  
                  {!showAccountConfirmation ? (
                    <Button
                      onClick={() => setShowAccountConfirmation(true)}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account
                    </Button>
                  ) : (
                    <div className="space-y-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-300 font-medium">
                        To confirm account deletion, please type your email address below:
                      </p>
                      <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        placeholder={user.email}
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleDeleteAccount}
                          disabled={isDeleting || confirmEmail !== user.email}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Confirm Account Deletion"}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAccountConfirmation(false);
                            setConfirmEmail("");
                          }}
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>Not Signed In</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200">
                <p className="mb-4">
                  You need to be signed in to manage your data and account. Please sign in first.
                </p>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <span>Data Retention Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-200 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span><strong>Data Deletion:</strong> Removed immediately from our database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span><strong>Account Deletion:</strong> Permanently deleted from our systems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span><strong>Local Data:</strong> Remains on your device until you clear browser data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span><strong>System Logs:</strong> Anonymized logs may be retained for 30 days for security purposes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-lg">
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
                <span>Need Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-200">
              <p className="mb-3">
                If you're having trouble with data or account deletion, please contact us:
              </p>
              <a
                href="mailto:support@h0ss310s.com"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                support@h0ss310s.com
              </a>
              <p className="text-sm text-slate-400 mt-3">
                We typically respond within 24 hours and can help with deletion requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletion;
