
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

const CourseResetButton = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const resetCourseMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete all user progress (lessons and modules, but not test scores or certificates)
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .is('lesson_id', null); // Only delete lesson progress, keep test scores

      if (error) throw error;

      // Delete lesson-specific progress
      const { error: lessonError } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .not('lesson_id', 'is', null);

      if (lessonError) throw lessonError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      toast({
        title: "Course Reset Successfully",
        description: "All lesson progress has been reset. Your test scores and certificates remain intact.",
      });
    },
    onError: (error) => {
      console.error('Error resetting course:', error);
      toast({
        title: "Error",
        description: "Failed to reset course progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Course
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to reset the course?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will reset all your lesson progress and you'll need to start from the beginning. 
            Your test scores, grades, and certificates will NOT be affected and will remain intact.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => resetCourseMutation.mutate()}
            disabled={resetCourseMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {resetCourseMutation.isPending ? "Resetting..." : "Yes, Reset Course"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CourseResetButton;
