
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Trash2 } from "lucide-react";

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

  const completeResetMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete all user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Delete all test attempts
      const { error: testError } = await supabase
        .from('test_attempts')
        .delete()
        .eq('user_id', user.id);

      if (testError) throw testError;

      // Reset user profile grades and certificates
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          overall_grade: null,
          certificate_earned: false,
          certificate_issued_at: null
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Delete assignment submissions
      const { error: assignmentError } = await supabase
        .from('assignment_submissions')
        .delete()
        .eq('user_id', user.id);

      if (assignmentError) throw assignmentError;

      // Delete projects
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('user_id', user.id);

      if (projectError) throw projectError;
    },
    onSuccess: () => {
      // Invalidate all queries
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      queryClient.invalidateQueries({ queryKey: ['current_grade'] });
      queryClient.invalidateQueries({ queryKey: ['test_attempts'] });
      queryClient.invalidateQueries({ queryKey: ['assignment_submissions'] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      
      toast({
        title: "Complete Reset Successful",
        description: "All your course data has been cleared. You can start fresh!",
      });
    },
    onError: (error) => {
      console.error('Error performing complete reset:', error);
      toast({
        title: "Error",
        description: "Failed to perform complete reset. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex gap-2">
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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-red-800 border-red-300 hover:bg-red-100">
            <Trash2 className="h-4 w-4 mr-2" />
            Complete Reset
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Complete Data Reset</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              <strong>WARNING:</strong> This will permanently delete ALL your course data including:
              <ul className="list-disc ml-6 mt-2">
                <li>All lesson progress</li>
                <li>All test attempts and scores</li>
                <li>Your overall grade and certificates</li>
                <li>All assignment submissions</li>
                <li>All projects</li>
              </ul>
              <br />
              You will start completely fresh as if you never took the course.
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => completeResetMutation.mutate()}
              disabled={completeResetMutation.isPending}
              className="bg-red-800 hover:bg-red-900"
            >
              {completeResetMutation.isPending ? "Deleting All Data..." : "Yes, Delete Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseResetButton;
