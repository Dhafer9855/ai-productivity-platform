
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
          lessons:lesson_id(id, title, module_id),
          modules:module_id(id, title)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user progress:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const markLessonComplete = useMutation({
    mutationFn: async ({ lessonId, moduleId }: { lessonId: number; moduleId: number }) => {
      if (!user) throw new Error('User not authenticated');

      // First, try to get existing progress for this module
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (existingProgress) {
        // Update existing progress to mark this lesson as complete
        const { error } = await supabase
          .from('user_progress')
          .update({
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (error) {
          console.error('Error updating progress:', error);
          throw error;
        }
      } else {
        // Create new progress record
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
          console.error('Error creating progress:', error);
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
