
import { CheckCircle, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Welcome to the AI for Workplace Productivity course. You now have full access to all modules and resources.
          </p>

          <Card className="p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Play className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Start Learning</h3>
                  <p className="text-gray-600">Begin with Module 1: Introduction to AI & Productivity</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Download Resources</h3>
                  <p className="text-gray-600">Access templates, guides, and the AI tools directory</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Start Learning Now
            </Button>
            <Button variant="outline">
              Download Resources
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
