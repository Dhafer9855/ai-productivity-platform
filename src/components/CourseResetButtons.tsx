
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, BookOpen, FileText, Trophy } from "lucide-react";

const CourseResetButtons = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const resetLessonsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete lesson-specific progress only
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .not('lesson_id', 'is', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      toast({
        title: "Lessons Reset Successfully",
        description: "All lesson progress has been reset. Test scores remain intact.",
      });
    },
    onError: (error) => {
      console.error('Error resetting lessons:', error);
      toast({
        title: "Error",
        description: "Failed to reset lesson progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetTestsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete all test attempts
      const { error: attemptsError } = await supabase
        .from('test_attempts')
        .delete()
        .eq('user_id', user.id);

      if (attemptsError) throw attemptsError;

      // Reset test scores in user_progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({ test_score: null })
        .eq('user_id', user.id)
        .not('test_score', 'is', null);

      if (progressError) throw progressError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test_attempts'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['current_grade'] });
      toast({
        title: "Tests Reset Successfully",
        description: "All test attempts and scores have been reset.",
      });
    },
    onError: (error) => {
      console.error('Error resetting tests:', error);
      toast({
        title: "Error",
        description: "Failed to reset test data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetGradesMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Reset grades and certificates in user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          overall_grade: null,
          certificate_earned: false,
          certificate_issued_at: null
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      queryClient.invalidateQueries({ queryKey: ['current_grade'] });
      toast({
        title: "Grades Reset Successfully",
        description: "Overall grade and certificate status have been reset.",
      });
    },
    onError: (error) => {
      console.error('Error resetting grades:', error);
      toast({
        title: "Error",
        description: "Failed to reset grades. Please try again.",
        variant: "destructive",
      });
    },
  });

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
      queryClient.invalidateQueries();
      toast({
        title: "Complete Reset Successful",
        description: "All course data has been reset. You can start fresh!",
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
      {/* Reset Lessons */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            <BookOpen className="h-4 w-4 mr-2" />
            Reset Lessons
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Lesson Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all lesson completion progress. Your test scores and grades will remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetLessonsMutation.mutate()}
              disabled={resetLessonsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {resetLessonsMutation.isPending ? "Resetting..." : "Reset Lessons"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Tests */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
            <FileText className="h-4 w-4 mr-2" />
            Reset Tests
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Test Scores?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all test attempts and scores. This will also affect your overall grade and module access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetTestsMutation.mutate()}
              disabled={resetTestsMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {resetTestsMutation.isPending ? "Resetting..." : "Reset Tests"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Grades */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
            <Trophy className="h-4 w-4 mr-2" />
            Reset Grades
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Grades & Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset your overall grade and remove any earned certificates. Test scores will remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetGradesMutation.mutate()}
              disabled={resetGradesMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {resetGradesMutation.isPending ? "Resetting..." : "Reset Grades"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Everything */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Everything
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Entire Course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will completely reset all progress, test scores, grades, and certificates. 
              You'll start the course from the beginning. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetEverythingMutation.mutate()}
              disabled={resetEverythingMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {resetEverythingMutation.isPending ? "Resetting..." : "Reset Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseResetButtons;
