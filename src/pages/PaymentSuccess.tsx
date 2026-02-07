import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Clock, Zap, Volume2, VolumeX } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import BackgroundParticles from "@/components/BackgroundParticles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIndustryAudio } from "@/hooks/useIndustryAudio";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [creditsAdded, setCreditsAdded] = useState(false);
  const [addingCredits, setAddingCredits] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  
  const { isPlaying, isLoading, playHappyCustomer, stopAudio } = useIndustryAudio();
  
  const type = searchParams.get("type");
  const minutes = searchParams.get("minutes");
  const isCredits = type === "credits" && minutes;

  // Fire confetti celebration
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#a855f7', '#f59e0b', '#ec4899', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  // Play happy customer audio on successful purchase
  const playCelebration = useCallback(async () => {
    if (hasPlayedAudio) return;
    setHasPlayedAudio(true);
    
    // Fire confetti immediately
    fireConfetti();
    
    // Small delay to let the page render before audio
    setTimeout(() => {
      playHappyCustomer();
    }, 1000);
  }, [hasPlayedAudio, playHappyCustomer, fireConfetti]);

  useEffect(() => {
    const addCredits = async () => {
      if (!isCredits || creditsAdded || addingCredits) return;
      
      setAddingCredits(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          console.error("No session found");
          return;
        }

        const { data, error } = await supabase.functions.invoke("add-credits", {
          body: { 
            minutes: parseInt(minutes, 10),
            amount_cents: 0,
          },
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });

        if (error) throw error;
        
        setCreditsAdded(true);
        toast.success(`${minutes} minutes added to your account!`);
        
        // Play celebration audio after credits are added
        playCelebration();
      } catch (error) {
        console.error("Error adding credits:", error);
        toast.error("Failed to add credits. Please contact support.");
      } finally {
        setAddingCredits(false);
      }
    };

    addCredits();
  }, [isCredits, minutes, creditsAdded, addingCredits, playCelebration]);

  // Also play for subscription purchases
  useEffect(() => {
    if (!isCredits && !hasPlayedAudio) {
      playCelebration();
    }
  }, [isCredits, hasPlayedAudio, playCelebration]);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <BackgroundParticles />
      
      <div className="relative z-10 max-w-md mx-auto px-4 text-center">
        <div className="glass-card p-8 rounded-2xl border border-sparkle/30">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-sparkle to-magic flex items-center justify-center shadow-magic">
            {isCredits ? <Zap size={32} className="text-white" /> : <Check size={32} className="text-white" />}
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isCredits ? "Minutes Added!" : "Payment Successful!"}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {isCredits ? (
              <>
                <span className="text-sparkle font-semibold">{minutes} call minutes</span> have been added to your account.
                {addingCredits && " Processing..."}
              </>
            ) : (
              "Thank you for your purchase. Your order has been confirmed and you'll receive a confirmation email shortly."
            )}
          </p>

          {/* Audio indicator */}
          {(isPlaying || isLoading) && (
            <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-lg bg-magic/10 border border-magic/20">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-magic border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-magic">Generating celebration...</span>
                </div>
              ) : (
                <>
                  <Volume2 size={16} className="text-magic animate-pulse" />
                  <span className="text-sm text-magic">Happy customer calling in!</span>
                  <button onClick={stopAudio} className="ml-2 opacity-60 hover:opacity-100">
                    <VolumeX size={14} />
                  </button>
                </>
              )}
            </div>
          )}

          {isCredits && (
            <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-magic/10 border border-magic/20">
              <Clock size={16} className="text-magic" />
              <span className="text-sm text-foreground">
                Minutes never expire and roll over each month
              </span>
            </div>
          )}
          
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
