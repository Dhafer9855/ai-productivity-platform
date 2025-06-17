
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Play, Lock } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

const CourseContent = () => {
  const { user } = useAuth();
  const { modules, lessons, isLoading } = useCourseData();
  const { progress, markLessonComplete } = useUserProgress();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getLessonsByModule = (moduleId: number) => {
    return lessons?.filter(lesson => lesson.module_id === moduleId) || [];
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress?.some(p => p.lesson_id === lessonId && p.completed) || false;
  };

  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = getLessonsByModule(moduleId);
    const completedLessons = moduleLessons.filter(lesson => isLessonCompleted(lesson.id));
    return moduleLessons.length > 0 ? (completedLessons.length / moduleLessons.length) * 100 : 0;
  };

  const handleLessonComplete = (lessonId: number, moduleId: number) => {
    if (!user) return;
    markLessonComplete({ lessonId, moduleId });
  };

  return (
    <div className="space-y-6">
      {modules?.map((module) => {
        const moduleLessons = getLessonsByModule(module.id);
        const moduleProgress = getModuleProgress(module.id);
        
        return (
          <Card key={module.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="mt-2">{module.description}</CardDescription>
                </div>
                <Badge variant={moduleProgress === 100 ? "default" : "secondary"}>
                  {Math.round(moduleProgress)}% Complete
                </Badge>
              </div>
              <Progress value={moduleProgress} className="mt-3" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {moduleLessons.map((lesson, index) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isPrevLessonCompleted = index === 0 || isLessonCompleted(moduleLessons[index - 1].id);
                  const isAccessible = user && isPrevLessonCompleted;

                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : isAccessible 
                            ? 'bg-white border-gray-200 hover:bg-gray-50' 
                            : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isAccessible ? (
                          <Circle className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-300" />
                        )}
                        <div>
                          <h4 className={`font-medium ${isAccessible ? 'text-gray-900' : 'text-gray-400'}`}>
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Lesson {lesson.order} of {moduleLessons.length}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        ) : isAccessible ? (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleLessonComplete(lesson.id, module.id)}
                            >
                              Mark Complete
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-gray-500">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CourseContent;
