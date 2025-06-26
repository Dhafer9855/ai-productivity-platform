
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Clock, CheckCircle } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGrades } from "@/hooks/useGrades";
import GradeDisplay from "./GradeDisplay";

const DashboardStats = () => {
  const { modules, lessons } = useCourseData();
  const { progress } = useUserProgress();
  const { userProfile, currentGrade } = useGrades();
  
  console.log('=== DASHBOARD STATS DEBUG ===');
  console.log('Progress data from hook:', progress);
  console.log('All lessons:', lessons);
  console.log('Current grade from hook:', currentGrade);
  console.log('Raw progress records:', progress?.map(p => ({ 
    id: p.id,
    lesson_id: p.lesson_id, 
    module_id: p.module_id, 
    completed: p.completed 
  })));
  
  // Calculate total completed lessons by going through each module and applying the completion logic
  let totalCompletedLessons = 0;
  
  if (progress && lessons && modules) {
    modules.forEach(module => {
      const moduleLessons = lessons.filter(lesson => lesson.module_id === module.id);
      const moduleProgressRecord = progress.find(p => p.module_id === module.id && p.completed && p.lesson_id);
      
      if (moduleProgressRecord && moduleProgressRecord.lesson_id) {
        // Find the completed lesson order
        const completedLesson = moduleLessons.find(l => l.id === moduleProgressRecord.lesson_id);
        if (completedLesson) {
          // Count all lessons up to and including the completed lesson
          const completedLessonsInModule = moduleLessons.filter(l => l.order <= completedLesson.order).length;
          totalCompletedLessons += completedLessonsInModule;
          
          console.log(`Module ${module.id}: ${completedLessonsInModule} lessons completed (up to lesson ${completedLesson.order})`);
        }
      }
    });
  }

  // Count modules with any completed lessons
  const modulesWithProgress = new Set();
  if (progress && modules) {
    progress.forEach(p => {
      if (p.module_id && p.completed && p.lesson_id) { // Only count if there's a completed lesson
        modulesWithProgress.add(p.module_id);
      }
    });
  }
  const modulesWithProgressCount = modulesWithProgress.size;

  // Calculate total lessons across all modules (should be 35)
  const totalLessons = lessons?.length || 0;

  console.log('=== LESSON & MODULE COUNTING ===');
  console.log('Total completed lessons (with progression logic):', totalCompletedLessons);
  console.log('Total lessons in course:', totalLessons);
  console.log('Modules with completed lessons:', Array.from(modulesWithProgress));
  console.log('Modules with progress count:', modulesWithProgressCount);
  console.log('Total modules:', modules?.length || 0);

  // Use currentGrade from the hook, but show N/A if no tests completed
  const displayGrade = currentGrade?.completedModules > 0 ? `${currentGrade.grade.toFixed(1)}%` : "N/A";
  const gradeDescription = currentGrade?.completedModules > 0 
    ? (userProfile?.certificate_earned ? "Certificate Earned!" : "Keep learning!")
    : "Complete a test to see your grade";
  const gradeProgress = currentGrade?.completedModules > 0 ? currentGrade.grade : 0;

  const stats = [
    {
      title: "Overall Progress",
      value: `${totalCompletedLessons}/${totalLessons}`,
      description: `${totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0}% course completed`,
      icon: CheckCircle,
      progress: totalLessons > 0 ? (totalCompletedLessons / totalLessons) * 100 : 0,
    },
    {
      title: "Modules Started",
      value: modulesWithProgressCount,
      description: `${modulesWithProgressCount} of ${modules?.length || 0} modules`,
      icon: BookOpen,
      progress: modules?.length ? (modulesWithProgressCount / modules.length) * 100 : 0,
    },
    {
      title: "Current Grade",
      value: displayGrade,
      description: gradeDescription,
      icon: Trophy,
      progress: gradeProgress,
    },
    {
      title: "Time Invested",
      value: `${totalCompletedLessons * 15}min`,
      description: `${totalCompletedLessons} lessons completed`,
      icon: Clock,
      progress: Math.min((totalCompletedLessons * 15) / 300 * 100, 100),
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
