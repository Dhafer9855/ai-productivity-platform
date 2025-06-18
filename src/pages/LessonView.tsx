
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, FileText } from "lucide-react";
import LessonContent from "@/components/lesson/LessonContent";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const LessonView = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, modules(*)')
        .eq('id', parseInt(lessonId!))
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: moduleLessons } = useQuery({
    queryKey: ['module-lessons', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', parseInt(moduleId!))
        .order('order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });

  const { data: moduleTest } = useQuery({
    queryKey: ['module-test', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('module_id', parseInt(moduleId!))
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });

  const { data: moduleProgress } = useQuery({
    queryKey: ['module-progress', moduleId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', parseInt(moduleId!));

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!moduleId,
  });

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ['lesson-progress', lessonId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', parseInt(lessonId!))
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!lessonId,
  });

  // Reset local completion state when lesson changes
  useEffect(() => {
    setIsCompleted(false);
  }, [lessonId]);

  const markAsCompletedMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !lessonId) throw new Error('Missing user or lesson ID');

      // First, try to get existing progress for this module
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', parseInt(moduleId!))
        .maybeSingle();

      if (existingProgress) {
        // Update existing progress to mark this lesson as complete
        const { error } = await supabase
          .from('user_progress')
          .update({
            lesson_id: parseInt(lessonId),
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Create new progress record
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            lesson_id: parseInt(lessonId),
            module_id: parseInt(moduleId!),
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      setIsCompleted(true);
      refetchProgress();
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      toast({
        title: "Lesson Completed!",
        description: "Great job! You've marked this lesson as complete.",
      });
    },
    onError: (error) => {
      console.error('Error marking lesson as complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentLessonOrder = lesson?.order;
  const nextLesson = moduleLessons?.find(l => l.order === (currentLessonOrder || 0) + 1);
  const previousLesson = moduleLessons?.find(l => l.order === (currentLessonOrder || 0) - 1);
  
  const isLastLesson = !nextLesson;
  const isFirstLesson = !previousLesson;

  const completedLessonsInModule = moduleProgress?.filter(p => p.completed && p.lesson_id) || [];
  const totalLessonsInModule = moduleLessons?.length || 0;
  const isModuleCompleted = completedLessonsInModule.length === totalLessonsInModule;

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${moduleId}/${nextLesson.id}`);
    }
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/lesson/${moduleId}/${previousLesson.id}`);
    }
  };

  const handleStartTest = () => {
    if (moduleTest) {
      navigate(`/test/${moduleTest.id}`);
    }
  };

  const handleCompleteModule = () => {
    toast({
      title: "Module Completed!",
      description: "Congratulations! You've completed all lessons in this module.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Only consider lesson completed if it's actually marked as completed in the database OR locally completed
  const isLessonCompleted = (progress?.completed === true) || isCompleted;

  console.log('Lesson completion check:', {
    lessonId,
    progressCompleted: progress?.completed,
    isCompleted,
    isLessonCompleted,
    progress
  });

  const lessonWithDescription = {
    ...lesson,
    description: lesson.modules.description || "Learn about AI productivity techniques and tools."
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Module {lesson.modules.order}</span>
              <span>•</span>
              <span>{lesson.modules.title}</span>
              <span>•</span>
              <span>Lesson {lesson.order}</span>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      Lesson {lesson.order}
                    </Badge>
                    {isLessonCompleted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                  <p className="text-gray-600">{lessonWithDescription.description}</p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>15 min</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <LessonContent lesson={lessonWithDescription} />

          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-lg mb-2">Ready to continue?</h3>
                <p className="text-gray-600 text-sm">
                  Mark this lesson as complete to track your progress.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousLesson}
                    disabled={isFirstLesson}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {isFirstLesson ? "First Lesson" : "Previous Lesson"}
                  </Button>
                </div>
                
                <div className="flex space-x-3">
                  {/* Always show Mark as Complete button if lesson is not completed */}
                  {!isLessonCompleted && (
                    <Button 
                      onClick={() => markAsCompletedMutation.mutate()}
                      disabled={markAsCompletedMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {markAsCompletedMutation.isPending ? "Marking..." : "Mark as Complete"}
                    </Button>
                  )}
                  
                  {/* Show Next Lesson button only if current lesson is completed and it's not the last lesson */}
                  {!isLastLesson && isLessonCompleted && (
                    <Button 
                      onClick={handleNextLesson}
                    >
                      Next Lesson
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {/* Show Complete Module button if it's the last lesson and current lesson is completed */}
                  {isLastLesson && isLessonCompleted && (
                    <Button 
                      onClick={handleCompleteModule}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Module
                    </Button>
                  )}

                  {/* Show disabled Next Lesson button if lesson is not completed and it's not the last lesson */}
                  {!isLastLesson && !isLessonCompleted && (
                    <Button 
                      variant="outline"
                      disabled
                      className="opacity-50"
                    >
                      Complete lesson first
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {/* Show disabled Complete Module button if it's the last lesson but lesson is not completed */}
                  {isLastLesson && !isLessonCompleted && (
                    <Button 
                      variant="outline"
                      disabled
                      className="opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete lesson first
                    </Button>
                  )}
                </div>
              </div>

              {/* Module Test Section - Only show if this is the last lesson, current lesson is completed, and test exists */}
              {isLastLesson && isLessonCompleted && moduleTest && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Module {lesson.modules.order} Complete!</h3>
                    <p className="text-gray-600 mb-4">
                      Congratulations! You've completed all lessons. Ready to test your knowledge?
                    </p>
                    <Button 
                      onClick={handleStartTest}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Start Module {lesson.modules.order} Test
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default LessonView;
