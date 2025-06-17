
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

const AuthModal = ({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) => {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);

  const handleSuccess = () => {
    onClose();
  };

  const switchToSignUp = () => setMode("signup");
  const switchToSignIn = () => setMode("signin");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          {mode === "signin" ? (
            <SignInForm
              onSuccess={handleSuccess}
              onSwitchToSignUp={switchToSignUp}
            />
          ) : (
            <SignUpForm
              onSuccess={handleSuccess}
              onSwitchToSignIn={switchToSignIn}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
