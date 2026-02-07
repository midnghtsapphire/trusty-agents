import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, Phone, Calendar, Settings, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, Globe, Clock, MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AgentOnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: string;
  agentType: string;
  icon: React.ReactNode;
}

const steps = [
  { id: 1, title: "Business Info", icon: Building2 },
  { id: 2, title: "Phone Setup", icon: Phone },
  { id: 3, title: "Calendar", icon: Calendar },
  { id: 4, title: "Customize", icon: Settings },
  { id: 5, title: "Launch", icon: CheckCircle2 },
];

const AgentOnboardingWizard = ({ 
  open, 
  onOpenChange, 
  industry, 
  agentType,
  icon 
}: AgentOnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    currentPhone: "",
    phoneOption: "new", // "new" or "forward"
    calendarType: "",
    businessHours: "24/7",
    greeting: "",
    services: "",
  });
  const navigate = useNavigate();

  const progress = (currentStep / steps.length) * 100;

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLaunch = () => {
    onOpenChange(false);
    navigate("/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">Tell us about your business</h3>
              <p className="text-sm text-muted-foreground">We'll configure your agent to match your brand</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="businessName" className="text-foreground/80">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  placeholder="Acme Plumbing Co."
                  className="glass-card border-white/10"
                />
              </div>
              
              <div>
                <Label htmlFor="ownerName" className="text-foreground/80">Your Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => updateField("ownerName", e.target.value)}
                  placeholder="John Smith"
                  className="glass-card border-white/10"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="john@acmeplumbing.com"
                  className="glass-card border-white/10"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">Set up your phone</h3>
              <p className="text-sm text-muted-foreground">Choose how you want to receive calls</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => updateField("phoneOption", "new")}
                className={`w-full p-4 rounded-xl glass-card border text-left transition-all ${
                  formData.phoneOption === "new" 
                    ? "border-magic/50 shadow-[0_0_20px_hsl(280_60%_55%/0.3)]" 
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-magic/20 text-magic">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Get a new AI number</p>
                    <p className="text-sm text-muted-foreground">We'll assign you a local or toll-free number</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => updateField("phoneOption", "forward")}
                className={`w-full p-4 rounded-xl glass-card border text-left transition-all ${
                  formData.phoneOption === "forward" 
                    ? "border-magic/50 shadow-[0_0_20px_hsl(280_60%_55%/0.3)]" 
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sparkle/20 text-sparkle">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Forward existing number</p>
                    <p className="text-sm text-muted-foreground">Keep your current number, forward to AI</p>
                  </div>
                </div>
              </button>

              {formData.phoneOption === "forward" && (
                <div className="mt-4">
                  <Label htmlFor="currentPhone" className="text-foreground/80">Your Current Business Number</Label>
                  <Input
                    id="currentPhone"
                    value={formData.currentPhone}
                    onChange={(e) => updateField("currentPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="glass-card border-white/10"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">Connect your calendar</h3>
              <p className="text-sm text-muted-foreground">Let your agent book appointments automatically</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["Google Calendar", "Outlook", "Calendly", "Skip for now"].map((cal) => (
                <button
                  key={cal}
                  onClick={() => updateField("calendarType", cal)}
                  className={`p-4 rounded-xl glass-card border text-center transition-all ${
                    formData.calendarType === cal 
                      ? "border-magic/50 shadow-[0_0_20px_hsl(280_60%_55%/0.3)]" 
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <Calendar className="mx-auto mb-2 text-magic" size={24} />
                  <p className="text-sm font-medium text-foreground">{cal}</p>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <Label className="text-foreground/80">Business Hours</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {["24/7", "Business Hours Only"].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => updateField("businessHours", hours)}
                    className={`p-3 rounded-xl glass-card border text-center transition-all ${
                      formData.businessHours === hours 
                        ? "border-sparkle/50 shadow-[0_0_20px_hsl(40_95%_55%/0.3)]" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Clock className="mx-auto mb-1 text-sparkle" size={18} />
                    <p className="text-sm font-medium text-foreground">{hours}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">Customize your agent</h3>
              <p className="text-sm text-muted-foreground">Make it sound like your brand</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="greeting" className="text-foreground/80">Custom Greeting</Label>
                <Textarea
                  id="greeting"
                  value={formData.greeting}
                  onChange={(e) => updateField("greeting", e.target.value)}
                  placeholder={`"Thank you for calling ${formData.businessName || '[Your Business]'}! How can I help you today?"`}
                  className="glass-card border-white/10 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="services" className="text-foreground/80">Services You Offer</Label>
                <Textarea
                  id="services"
                  value={formData.services}
                  onChange={(e) => updateField("services", e.target.value)}
                  placeholder="List your main services, separated by commas..."
                  className="glass-card border-white/10 min-h-[80px]"
                />
              </div>

              <div className="glass-card border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-magic" />
                  <span className="text-sm font-medium text-foreground">Agent Preview</span>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{formData.greeting || `Thank you for calling ${formData.businessName || 'your business'}! How can I help you today?`}"
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-magic/30 to-sparkle/30 mx-auto">
              <Sparkles className="text-sparkle" size={40} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">You're all set! ✨</h3>
              <p className="text-muted-foreground">
                Your {industry} {agentType} is ready to start taking calls
              </p>
            </div>

            <div className="glass-card border border-white/10 rounded-xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Business</span>
                <span className="text-sm font-medium text-foreground">{formData.businessName || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phone Setup</span>
                <span className="text-sm font-medium text-foreground">
                  {formData.phoneOption === "new" ? "New AI Number" : "Call Forwarding"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Calendar</span>
                <span className="text-sm font-medium text-foreground">{formData.calendarType || "Not connected"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hours</span>
                <span className="text-sm font-medium text-foreground">{formData.businessHours}</span>
              </div>
            </div>

            <div className="glass-card border border-sparkle/30 rounded-xl p-4 bg-sparkle/5">
              <p className="text-sm text-sparkle font-medium">
                🎉 Your new AI number: +1 (555) 987-6543
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start forwarding calls or share this number with customers
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-intense border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-magic/30 to-sparkle/30 text-magic">
              {icon}
            </div>
            <div>
              <span className="text-lg font-bold">Deploy {industry} {agentType}</span>
              <p className="text-sm text-muted-foreground font-normal">Step {currentStep} of {steps.length}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center gap-1 ${
                  step.id <= currentStep ? "text-magic" : "text-muted-foreground/50"
                }`}
              >
                <step.icon size={16} />
                <span className="text-[10px] hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="py-4">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-3">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button variant="magic" onClick={nextStep} className="gap-1">
              Next
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="poof" onClick={handleLaunch} className="gap-1">
              <Sparkles size={16} />
              Launch Agent
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentOnboardingWizard;
