
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import GoogleSignUpButton from "./GoogleSignUpButton";
import FormDivider from "./FormDivider";
import EmailSignUpForm from "./EmailSignUpForm";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

const SignUpForm = ({ onSuccess, onSwitchToSignIn }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabase);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseConfigured || !supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please set up your environment variables.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account.",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!supabaseConfigured || !supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please set up your environment variables.",
        variant: "destructive",
      });
      return;
    }

    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;

      // The redirect will handle the success case
    } catch (error: any) {
      toast({
        title: "Google Sign Up Failed",
        description: error.message || "An error occurred during Google sign up",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  if (!supabaseConfigured) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Configuration Required
          </CardTitle>
          <CardDescription>
            Supabase environment variables are not configured. Please set up VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Create your account to access the AI Workplace Productivity course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <GoogleSignUpButton
            loading={googleLoading}
            onGoogleSignUp={handleGoogleSignUp}
          />

          <FormDivider />

          <EmailSignUpForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            fullName={fullName}
            setFullName={setFullName}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            onSubmit={handleSubmit}
          />

          {onSwitchToSignIn && (
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignIn}
                className="text-sm"
              >
                Already have an account? Sign in
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
