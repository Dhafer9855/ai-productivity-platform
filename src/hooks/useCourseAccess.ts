
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
    
    // Check if the previous module's test is passed
    const previousModuleId = moduleId - 1;
    const previousModuleTest = tests.find(t => t.module_id === previousModuleId);
    
    if (!previousModuleTest) {
      // If there's no test for the previous module, allow access
      return true;
    }
    
    // Check if there's a test attempt for the previous module that passed
    const testAttempt = attempts.find(a => a.test_id === previousModuleTest.id);
    const moduleProgress = progress.find(p => p.module_id === previousModuleId && p.test_score !== null);
    
    // Module is accessible if:
    // 1. Test attempt exists and is marked as passed, OR
    // 2. Progress record shows test score >= 80
    const hasPassedTest = (testAttempt?.passed) || (moduleProgress?.test_score && moduleProgress.test_score >= 80);
    
    console.log(`Access check for module ${moduleId}:`, {
      previousModuleId,
      hasTest: !!previousModuleTest,
      testAttempt: testAttempt?.passed,
      progressScore: moduleProgress?.test_score,
      hasPassedTest
    });
    
    return hasPassedTest;
  };

  return {
    courseAccess: courseAccess || [],
    isLoading: isLoading || !testData,
    hasAccessToModule,
  };
};
