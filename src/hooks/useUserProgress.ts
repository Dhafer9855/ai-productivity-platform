
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
        .eq('user_id', user.id)
        .eq('completed', true); // Only get completed lessons

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

      // Get all lessons in this module to find which ones should be marked complete
      const { data: allLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order');

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        throw lessonsError;
      }

      // Find the current lesson being completed
      const currentLesson = allLessons?.find(l => l.id === lessonId);
      if (!currentLesson) {
        throw new Error('Lesson not found');
      }

      // Mark all lessons up to and including the current lesson as complete
      const lessonsToComplete = allLessons?.filter(l => l.order <= currentLesson.order) || [];

      for (const lesson of lessonsToComplete) {
        // Check if progress record already exists for this specific lesson
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson.id)
          .eq('module_id', moduleId)
          .maybeSingle();

        if (existingProgress) {
          // Update existing progress
          const { error } = await supabase
            .from('user_progress')
            .update({
              completed: true,
              completed_at: new Date().toISOString()
            })
            .eq('id', existingProgress.id);

          if (error) {
            console.error('Error updating lesson progress:', error);
            throw error;
          }
        } else {
          // Create new progress record for this specific lesson
          const { error } = await supabase
            .from('user_progress')
            .insert({
              user_id: user.id,
              lesson_id: lesson.id,
              module_id: moduleId,
              completed: true,
              completed_at: new Date().toISOString()
            });

          if (error) {
            console.error('Error creating lesson progress:', error);
            throw error;
          }
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
