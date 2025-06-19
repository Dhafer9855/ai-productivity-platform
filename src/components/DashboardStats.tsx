
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
  console.log('Progress data:', progress);
  console.log('Raw progress length:', progress?.length);
  
  // Count completed lessons - look for unique lesson IDs that are marked as completed
  const completedLessonsSet = new Set();
  progress?.forEach((p, index) => {
    console.log(`Progress record ${index}:`, {
      id: p.id,
      user_id: p.user_id,
      lesson_id: p.lesson_id,
      module_id: p.module_id,
      completed: p.completed,
      completed_at: p.completed_at
    });
    
    if (p.completed && p.lesson_id) {
      completedLessonsSet.add(p.lesson_id);
      console.log(`Added lesson ${p.lesson_id} to completed set`);
    }
  });
  
  const completedLessons = completedLessonsSet.size;
  
  console.log('=== FINAL CALCULATION ===');
  console.log('Unique completed lessons:', Array.from(completedLessonsSet));
  console.log('Completed lessons count:', completedLessons);
  console.log('Total lessons:', totalLessons);
  console.log('Progress percentage:', totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);

  // Count completed modules (modules where all lessons are completed)
  const completedModules = modules?.filter(module => {
    const moduleLessons = lessons?.filter(lesson => lesson.module_id === module.id) || [];
    const moduleCompletedLessons = moduleLessons.filter(lesson => 
      progress?.some(p => p.lesson_id === lesson.id && p.completed)
    );
    return moduleLessons.length > 0 && moduleCompletedLessons.length === moduleLessons.length;
  }).length || 0;

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const stats = [
    {
      title: "Overall Progress",
      value: `${Math.round(overallProgress)}%`,
      description: `${completedLessons} of ${totalLessons} lessons completed`,
      icon: Target,
      progress: overallProgress,
    },
    {
      title: "Modules Completed",
      value: completedModules,
      description: `${completedModules} of ${modules?.length || 0} modules`,
      icon: BookOpen,
      progress: modules?.length ? (completedModules / modules.length) * 100 : 0,
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
      value: `${completedLessons * 15}min`,
      description: "Estimated learning time",
      icon: Clock,
      progress: Math.min((completedLessons * 15) / 300 * 100, 100),
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
