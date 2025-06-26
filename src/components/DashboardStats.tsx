
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Clock } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGrades } from "@/hooks/useGrades";
import GradeDisplay from "./GradeDisplay";

const DashboardStats = () => {
  const { modules } = useCourseData();
  const { progress } = useUserProgress();
  const { userProfile } = useGrades();
  
  console.log('=== DASHBOARD STATS DEBUG ===');
  console.log('Progress data from hook:', progress);
  console.log('Raw progress records:', progress?.map(p => ({ 
    id: p.id,
    lesson_id: p.lesson_id, 
    module_id: p.module_id, 
    completed: p.completed 
  })));
  
  // Count completed lessons - get unique lesson IDs from progress records
  const completedLessonIds = new Set();
  if (progress) {
    progress.forEach(p => {
      if (p.lesson_id && p.completed) {
        completedLessonIds.add(p.lesson_id);
      }
    });
  }
  const completedLessonsCount = completedLessonIds.size;

  // Count modules with progress (not necessarily completed)
  const modulesWithProgress = new Set();
  if (progress && modules) {
    progress.forEach(p => {
      if (p.module_id && p.completed) {
        modulesWithProgress.add(p.module_id);
      }
    });
  }
  const modulesWithProgressCount = modulesWithProgress.size;

  console.log('=== MODULE COUNTING ===');
  console.log('Modules with progress:', Array.from(modulesWithProgress));
  console.log('Modules with progress count:', modulesWithProgressCount);
  console.log('Total modules:', modules?.length || 0);

  const stats = [
    {
      title: "Modules Started",
      value: modulesWithProgressCount,
      description: `${modulesWithProgressCount} of ${modules?.length || 0} modules`,
      icon: BookOpen,
      progress: modules?.length ? (modulesWithProgressCount / modules.length) * 100 : 0,
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
