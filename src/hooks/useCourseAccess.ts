
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCourseAccess = () => {
  const { user } = useAuth();

  const { data: courseAccess, isLoading } = useQuery({
    queryKey: ['courseAccess', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Since course_access table doesn't exist, just return empty array
      // This will grant access to all modules by default
      console.log('Course access: granting access to all modules (no course_access table)');
      return [];
    },
    enabled: !!user,
  });

  // Get test attempts and progress data to determine module access
  const { data: testData } = useQuery({
    queryKey: ['moduleTestAccess', user?.id],
    queryFn: async () => {
      if (!user) return { tests: [], attempts: [], progress: [] };
      
      const [testsResult, attemptsResult, progressResult] = await Promise.all([
        supabase.from('tests').select('*').order('module_id'),
        supabase.from('test_attempts').select('*').eq('user_id', user.id),
        supabase.from('user_progress').select('*').eq('user_id', user.id)
      ]);

      return {
        tests: testsResult.data || [],
        attempts: attemptsResult.data || [],
        progress: progressResult.data || []
      };
    },
    enabled: !!user,
  });

  const hasAccessToModule = (moduleId: number) => {
    // Always allow access to module 1
    if (moduleId === 1) return true;
    
    if (!testData) return false;
    
    const { tests, attempts, progress } = testData;
    
    // For modules 2 and above, check if ALL previous modules have passed tests
    for (let i = 1; i < moduleId; i++) {
      const moduleTest = tests.find(t => t.module_id === i);
      
      if (!moduleTest) {
        console.log(`No test found for module ${i}, blocking access to module ${moduleId}`);
        return false;
      }
      
      // Check if there's a passing test attempt
      const testAttempt = attempts.find(a => a.test_id === moduleTest.id && a.passed);
      
      // Also check progress record for test score
      const moduleProgress = progress.find(p => p.module_id === i && p.test_score !== null && p.test_score >= 80);
      
      const hasPassedTest = testAttempt || moduleProgress;
      
      if (!hasPassedTest) {
        console.log(`Module ${i} test not passed (required for module ${moduleId} access):`, {
          moduleId: i,
          hasTest: !!moduleTest,
          testAttempt: !!testAttempt,
          progressScore: moduleProgress?.test_score,
          accessDenied: true
        });
        return false;
      }
    }
    
    console.log(`Access granted to module ${moduleId} - all previous tests passed`);
    return true;
  };

  return {
    courseAccess: courseAccess || [],
    isLoading: isLoading || !testData,
    hasAccessToModule,
  };
};
