
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Clock, Target } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGrades } from "@/hooks/useGrades";
import { useTests } from "@/hooks/useTests";
import GradeDisplay from "./GradeDisplay";

const DashboardStats = () => {
  const { modules, lessons } = useCourseData();
  const { progress } = useUserProgress();
  const { userProfile, currentGrade } = useGrades();
  const { attempts } = useTests();

  const totalLessons = lessons?.length || 0;
  
  // Calculate completed lessons - for modules with completed tests, count all lessons as completed
  const completedModules = currentGrade?.completedModules || 0;
  
  // Get lessons for completed modules
  const completedLessons = modules && lessons ? 
    modules.slice(0, completedModules).reduce((total, module) => {
      const moduleLessons = lessons.filter(lesson => lesson.module_id === module.id);
      return total + moduleLessons.length;
    }, 0) : 0;

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Use current grade for display, fallback to profile grade
  const displayGrade = currentGrade?.grade || userProfile?.overall_grade;

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
      value: displayGrade ? `${displayGrade.toFixed(1)}%` : "N/A",
      description: userProfile?.certificate_earned ? "Certificate Earned!" : "Keep learning!",
      icon: Trophy,
      progress: displayGrade || 0,
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
