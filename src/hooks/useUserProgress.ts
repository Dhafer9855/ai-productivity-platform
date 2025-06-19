
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useUserProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          lessons:lesson_id(id, title, module_id, order),
          modules:module_id(id, title)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user progress:', error);
        throw error;
      }
      
      console.log('Raw progress data:', data);
      return data;
    },
    enabled: !!user,
  });

  const markLessonComplete = useMutation({
    mutationFn: async ({ lessonId, moduleId }: { lessonId: number; moduleId: number }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Marking lesson complete:', { lessonId, moduleId, userId: user.id });

      // Check if there's already a progress record for this specific lesson
      const { data: existingLessonProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (existingLessonProgress) {
        // Update existing lesson progress
        const { error } = await supabase
          .from('user_progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingLessonProgress.id);

        if (error) {
          console.error('Error updating lesson progress:', error);
          throw error;
        }
      } else {
        // Create new progress record for this lesson
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error creating lesson progress:', error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      toast({
        title: "Progress Updated",
        description: "Lesson marked as complete!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
      console.error('Progress update error:', error);
    },
  });

  return {
    progress,
    isLoading,
    markLessonComplete: markLessonComplete.mutate,
  };
};
