import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackgroundParticles from "@/components/BackgroundParticles";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <BackgroundParticles />
      
      <div className="relative z-10 max-w-md mx-auto px-4 text-center">
        <div className="glass-card p-8 rounded-2xl border border-sparkle/30">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-sparkle to-magic flex items-center justify-center shadow-magic">
            <Check size={32} className="text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been confirmed and you'll receive a confirmation email shortly.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link to="/dashboard">
              <Button variant="magic" className="w-full">
                <Sparkles size={16} className="mr-2" />
                Go to Dashboard
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="ghost" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
