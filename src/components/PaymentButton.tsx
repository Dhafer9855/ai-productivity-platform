
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./auth/AuthModal";

const PaymentButton = () => {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleFreeAccess = async () => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the course.",
        variant: "destructive",
      });
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      
      // Simulate a brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard since course is free
      window.location.href = '/dashboard';
      
      toast({
        title: "Welcome to the Course!",
        description: "You now have full access to all modules and resources.",
      });
    } catch (error: any) {
      console.error('Access error:', error);
      toast({
        title: "Access Error",
        description: error.message || "Failed to grant access",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleFreeAccess}
        disabled={loading}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Getting Access...
          </>
        ) : (
          <>
            <BookOpen className="h-5 w-5 mr-2" />
            Get Free Access
          </>
        )}
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signin"
      />
    </>
  );
};

export default PaymentButton;
