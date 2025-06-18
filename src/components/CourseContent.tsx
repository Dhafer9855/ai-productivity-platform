
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAssignments } from "@/hooks/useAssignments";
import { useTests } from "@/hooks/useTests";
import ModuleCard from "./ModuleCard";
import AssignmentCard from "./AssignmentCard";
import TestCard from "./TestCard";
import CourseResetButton from "./CourseResetButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseContent = () => {
  const { modules, lessons } = useCourseData();
  const { progress } = useUserProgress();
  const { assignments, submissions } = useAssignments();
  const { tests, attempts } = useTests();

  if (!modules || !lessons) {
    return <div>Loading course content...</div>;
  }

  console.log('All progress data:', progress);
  console.log('All lessons data:', lessons);
  console.log('All modules data:', modules);

  // Transform data for ModuleCard compatibility
  const moduleData = modules.map(module => {
    const moduleLessons = lessons.filter(lesson => lesson.module_id === module.id);
    
    // Get all progress records for this module
    const moduleProgressRecords = progress?.filter(p => p.module_id === module.id) || [];
    
    console.log(`Module ${module.id} - Raw progress records:`, moduleProgressRecords);
    console.log(`Module ${module.id} - Module lessons:`, moduleLessons);
    
    // Count unique completed lessons for this module
    const completedLessonIds = new Set();
    
    // Add lesson IDs from progress records where completed is true and lesson_id is not null
    moduleProgressRecords.forEach(p => {
      if (p.completed === true && p.lesson_id !== null) {
        completedLessonIds.add(p.lesson_id);
      }
    });
    
    const completedLessons = completedLessonIds.size;
    const progressPercentage = moduleLessons.length > 0 ? (completedLessons / moduleLessons.length) * 100 : 0;

    console.log(`Module ${module.id} progress calculation:`, {
      moduleId: module.id,
      totalLessons: moduleLessons.length,
      completedLessonIds: Array.from(completedLessonIds),
      completedLessons,
      progressPercentage,
      moduleProgressRecords: moduleProgressRecords.map(p => ({
        id: p.id,
        lesson_id: p.lesson_id,
        completed: p.completed,
        completed_at: p.completed_at
      }))
    });

    // For module 7, show assignment instead of lessons
    if (module.id === 7) {
      return {
        moduleNumber: module.order || module.id,
        title: module.title || `Module ${module.id}`,
        description: module.description,
        lessons: [], // No lessons for assignment module
        progress: progressPercentage,
        estimatedTime: "Assignment",
        isAssignment: true,
      };
    }

    return {
      moduleNumber: module.order || module.id,
      title: module.title || `Module ${module.id}`,
      description: module.description,
      lessons: moduleLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        type: "video" as const,
        duration: "15 min",
        completed: completedLessonIds.has(lesson.id),
      })),
      progress: progressPercentage,
      estimatedTime: `${moduleLessons.length * 15} min`,
    };
  });

  // Get assignments and tests for module 7
  const moduleAssignments = assignments?.filter(assignment => assignment.module_id === 7) || [];
  const moduleTests = tests?.filter(test => test.module_id === 7) || [];

  return (
    <div className="space-y-6">
      {/* Course Reset Button */}
      <div className="flex justify-end">
        <CourseResetButton />
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Course Modules</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="tests">Module Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid gap-6">
            {moduleData.map((module, index) => (
              <ModuleCard
                key={index}
                moduleNumber={module.moduleNumber}
                title={module.title}
                description={module.description}
                lessons={module.lessons}
                progress={module.progress}
                estimatedTime={module.estimatedTime}
                isLocked={index > 0 && moduleData[index - 1].progress < 100}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {moduleAssignments.length > 0 ? (
            <div className="grid gap-6">
              {moduleAssignments.map(assignment => {
                const submission = submissions?.find(s => s.assignment_id === assignment.id);
                return (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    submission={submission}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No assignments available yet.
            </div>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          {moduleTests.length > 0 ? (
            <div className="grid gap-6">
              {moduleTests.map(test => {
                const attempt = attempts?.find(a => a.test_id === test.id);
                return (
                  <TestCard
                    key={test.id}
                    test={test}
                    attempt={attempt}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No tests available yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContent;
