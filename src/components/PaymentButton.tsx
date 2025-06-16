
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const PaymentButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to purchase the course.",
          variant: "destructive",
        });
        return;
      }

      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Session Error",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }

      // Call the edge function to create payment session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={loading}
      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-medium"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5 mr-2" />
          Purchase Course - $49.99
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
