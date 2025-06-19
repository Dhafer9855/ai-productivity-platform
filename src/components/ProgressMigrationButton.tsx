
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

const ProgressMigrationButton = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const migrateProgress = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get current progress records
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      console.log('Current progress:', currentProgress);

      // Get all lessons to know which ones should be marked as complete
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('*')
        .order('module_id, order');

      console.log('All lessons:', allLessons);

      if (!currentProgress || !allLessons) return;

      // For each completed module, create individual lesson progress records
      for (const progressRecord of currentProgress) {
        if (progressRecord.completed && progressRecord.lesson_id) {
          // Find all lessons in this module up to and including the completed lesson
          const moduleId = progressRecord.module_id;
          const completedLessonId = progressRecord.lesson_id;
          
          const moduleLessons = allLessons.filter(l => l.module_id === moduleId);
          const completedLesson = moduleLessons.find(l => l.id === completedLessonId);
          
          if (completedLesson) {
            // Mark all lessons up to the completed lesson as complete
            const lessonsToComplete = moduleLessons.filter(l => l.order <= completedLesson.order);
            
            for (const lesson of lessonsToComplete) {
              // Check if progress record already exists for this lesson
              const { data: existingProgress } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('lesson_id', lesson.id)
                .eq('module_id', moduleId)
                .maybeSingle();

              if (!existingProgress) {
                // Create new progress record
                await supabase
                  .from('user_progress')
                  .insert({
                    user_id: user.id,
                    lesson_id: lesson.id,
                    module_id: moduleId,
                    completed: true,
                    completed_at: progressRecord.completed_at || new Date().toISOString()
                  });
                
                console.log(`Created progress record for lesson ${lesson.id} in module ${moduleId}`);
              }
            }
          }
        }
      }

      toast({
        title: "Progress Migration Complete",
        description: "Your lesson progress has been updated to reflect individual lesson completions.",
      });

      // Refresh the page to see updated progress
      window.location.reload();

    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Failed",
        description: "There was an error updating your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={migrateProgress} 
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Migrating...' : 'Fix Progress Count'}
    </Button>
  );
};

export default ProgressMigrationButton;
