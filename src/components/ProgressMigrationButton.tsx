
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
      console.log('Starting progress migration...');
      
      // Get current progress records
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      console.log('Current progress before migration:', currentProgress);

      // Get all lessons to know which ones should be marked as complete
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('*')
        .order('module_id, order');

      console.log('All lessons:', allLessons);

      if (!currentProgress || !allLessons) return;

      // Clear ALL existing progress and recreate individual lesson progress
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      console.log('Cleared all existing progress');

      // For each progress record that had a specific lesson_id, recreate individual lesson records
      for (const progressRecord of currentProgress) {
        if (progressRecord.completed && progressRecord.lesson_id) {
          const moduleId = progressRecord.module_id;
          const completedLessonId = progressRecord.lesson_id;
          
          const moduleLessons = allLessons.filter(l => l.module_id === moduleId);
          const completedLesson = moduleLessons.find(l => l.id === completedLessonId);
          
          if (completedLesson) {
            console.log(`Processing module ${moduleId}, completed lesson ${completedLessonId} (order ${completedLesson.order})`);
            
            // Mark all lessons up to the completed lesson as complete
            const lessonsToComplete = moduleLessons.filter(l => l.order <= completedLesson.order);
            
            for (const lesson of lessonsToComplete) {
              // Create new progress record for each individual lesson
              const { error } = await supabase
                .from('user_progress')
                .insert({
                  user_id: user.id,
                  lesson_id: lesson.id,
                  module_id: moduleId,
                  completed: true,
                  completed_at: progressRecord.completed_at || new Date().toISOString()
                });
              
              if (error) {
                console.error(`Error creating progress for lesson ${lesson.id}:`, error);
              } else {
                console.log(`Created progress record for lesson ${lesson.id} (order ${lesson.order}) in module ${moduleId}`);
              }
            }
          }
        }
      }

      // Verify the migration
      const { data: newProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .not('lesson_id', 'is', null);

      console.log('Progress after migration:', newProgress);
      console.log('Total lesson progress records created:', newProgress?.length || 0);

      toast({
        title: "Progress Migration Complete",
        description: `Successfully migrated to ${newProgress?.length || 0} individual lesson progress records.`,
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
