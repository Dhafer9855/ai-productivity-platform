
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Canceled
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your payment was canceled. No charges were made to your account.
          </p>

          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Course
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PaymentCanceled;
