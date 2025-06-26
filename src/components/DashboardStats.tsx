
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Clock, Target } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGrades } from "@/hooks/useGrades";
import GradeDisplay from "./GradeDisplay";

const DashboardStats = () => {
  const { modules, lessons } = useCourseData();
  const { progress } = useUserProgress();
  const { userProfile } = useGrades();

  const totalLessons = lessons?.length || 0;
  
  console.log('=== DASHBOARD STATS DEBUG ===');
  console.log('Total lessons in database:', totalLessons);
  console.log('Progress data from hook:', progress);
  console.log('Raw progress records:', progress?.map(p => ({ lesson_id: p.lesson_id, module_id: p.module_id, completed: p.completed })));
  
  // Count completed lessons - each progress record with completed=true represents a completed lesson
  const completedLessonsCount = progress?.length || 0;
  
  console.log('=== LESSON COUNTING ===');
  console.log('Completed lessons count (direct from progress array):', completedLessonsCount);
  console.log('Total lessons:', totalLessons);
  console.log('Progress percentage:', totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0);

  // Count completed modules - modules where the user has some progress
  let completedModulesCount = 0;
  
  if (modules && lessons && progress) {
    for (const module of modules) {
      const moduleLessons = lessons.filter(lesson => lesson.module_id === module.id);
      const moduleProgressRecords = progress.filter(p => p.module_id === module.id);
      
      // A module is considered "completed" if user has completed at least one lesson in it
      // and has completed all lessons up to their current progress
      let isModuleComplete = false;
      
      if (moduleProgressRecords.length > 0 && moduleLessons.length > 0) {
        // Find the highest lesson order completed in this module
        const completedLessonIds = moduleProgressRecords.map(p => p.lesson_id).filter(Boolean);
        const completedLessons = moduleLessons.filter(lesson => completedLessonIds.includes(lesson.id));
        
        if (completedLessons.length > 0) {
          const maxCompletedOrder = Math.max(...completedLessons.map(l => l.order));
          const expectedCompletedLessons = moduleLessons.filter(l => l.order <= maxCompletedOrder);
          
          // Module is complete if all lessons up to the max completed order are actually completed
          isModuleComplete = expectedCompletedLessons.every(lesson => 
            completedLessonIds.includes(lesson.id)
          );
        }
      }
      
      if (isModuleComplete) {
        completedModulesCount++;
      }
      
      console.log(`Module ${module.id} (${module.title}) completion check:`, {
        totalLessons: moduleLessons.length,
        progressRecords: moduleProgressRecords.length,
        isComplete: isModuleComplete,
        completedLessonIds: moduleProgressRecords.map(p => p.lesson_id)
      });
    }
  }

  console.log('=== MODULE COUNTING ===');
  console.log('Completed modules count:', completedModulesCount);
  console.log('Total modules:', modules?.length || 0);

  const overallProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const stats = [
    {
      title: "Overall Progress",
      value: `${Math.round(overallProgress)}%`,
      description: `${completedLessonsCount} of ${totalLessons} lessons completed`,
      icon: Target,
      progress: overallProgress,
    },
    {
      title: "Modules Completed",
      value: completedModulesCount,
      description: `${completedModulesCount} of ${modules?.length || 0} modules`,
      icon: BookOpen,
      progress: modules?.length ? (completedModulesCount / modules.length) * 100 : 0,
    },
    {
      title: "Current Grade",
      value: userProfile?.overall_grade ? `${userProfile.overall_grade.toFixed(1)}%` : "N/A",
      description: userProfile?.certificate_earned ? "Certificate Earned!" : "Keep learning!",
      icon: Trophy,
      progress: userProfile?.overall_grade || 0,
    },
    {
      title: "Time Invested",
      value: `${completedLessonsCount * 15}min`,
      description: "Estimated learning time",
      icon: Clock,
      progress: Math.min((completedLessonsCount * 15) / 300 * 100, 100),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-2">{stat.description}</p>
              <Progress value={stat.progress} className="h-2" />
            </CardContent>
          </Card>
        );
      })}
      
      <GradeDisplay />
    </div>
  );
};

export default DashboardStats;
