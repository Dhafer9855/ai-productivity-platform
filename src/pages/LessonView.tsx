
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from "lucide-react";
import LessonContent from "@/components/lesson/LessonContent";
import { useState } from "react";

const LessonView = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Fetch all lessons in the current module to determine next lesson
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

  const { data: progress } = useQuery({
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

  const markAsCompleted = async () => {
    if (!user?.id || !lessonId) return;

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: parseInt(lessonId),
        module_id: parseInt(moduleId!),
        completed: true,
        completed_at: new Date().toISOString()
      });

    if (!error) {
      setIsCompleted(true);
    }
  };

  // Find the next lesson
  const currentLessonOrder = lesson?.order;
  const nextLesson = moduleLessons?.find(l => l.order === (currentLessonOrder || 0) + 1);
  const isLastLesson = !nextLesson;

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${moduleId}/${nextLesson.id}`);
    }
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

  const isLessonCompleted = progress?.completed || isCompleted;

  // Create lesson object with required description property
  const lessonWithDescription = {
    ...lesson,
    description: lesson.modules.description || "Learn about AI productivity techniques and tools."
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Navigation */}
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

          {/* Lesson Header */}
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

          {/* Lesson Content */}
          <LessonContent lesson={lessonWithDescription} />

          {/* Completion Actions */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Ready to continue?</h3>
                  <p className="text-gray-600 text-sm">
                    Mark this lesson as complete to track your progress.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  {!isLessonCompleted && (
                    <Button onClick={markAsCompleted}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleNextLesson}
                    disabled={isLastLesson}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {isLastLesson ? "Course Complete" : "Next Lesson"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default LessonView;
