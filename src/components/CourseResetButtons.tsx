
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

const CourseResetButtons = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const resetEverythingMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete all progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Delete all test attempts
      const { error: attemptsError } = await supabase
        .from('test_attempts')
        .delete()
        .eq('user_id', user.id);

      if (attemptsError) throw attemptsError;

      // Reset user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          overall_grade: null,
          certificate_earned: false,
          certificate_issued_at: null
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      // Invalidate all relevant queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['moduleTestAccess'] });
      queryClient.invalidateQueries({ queryKey: ['courseAccess'] });
      queryClient.invalidateQueries({ queryKey: ['current_grade'] });
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      queryClient.invalidateQueries({ queryKey: ['test_attempts'] });
      
      toast({
        title: "Reset Progress Successful",
        description: "All course data has been reset. Only Module 1 is now accessible.",
      });
    },
    onError: (error) => {
      console.error('Error resetting everything:', error);
      toast({
        title: "Error",
        description: "Failed to reset course data. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-wrap gap-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reset grade progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will completely reset all progress, test scores, grades, and certificates. 
              Only Module 1 will remain accessible. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetEverythingMutation.mutate()}
              disabled={resetEverythingMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {resetEverythingMutation.isPending ? "Resetting..." : "Reset Progress"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseResetButtons;
