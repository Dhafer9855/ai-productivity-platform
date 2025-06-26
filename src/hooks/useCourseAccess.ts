
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
  const { data: testData, refetch: refetchTestData } = useQuery({
    queryKey: ['moduleTestAccess', user?.id],
    queryFn: async () => {
      if (!user) return { tests: [], attempts: [], progress: [] };
      
      const [testsResult, attemptsResult, progressResult] = await Promise.all([
        supabase.from('tests').select('*').order('module_id'),
        supabase.from('test_attempts').select('*').eq('user_id', user.id),
        supabase.from('user_progress').select('*').eq('user_id', user.id)
      ]);

      console.log('Test data loaded:', {
        tests: testsResult.data?.length || 0,
        attempts: attemptsResult.data?.length || 0,
        progress: progressResult.data?.length || 0
      });

      return {
        tests: testsResult.data || [],
        attempts: attemptsResult.data || [],
        progress: progressResult.data || []
      };
    },
    enabled: !!user,
    staleTime: 0, // Always refetch to get fresh data after resets
    cacheTime: 0, // Don't cache to ensure we get updated data
  });

  const hasAccessToModule = (moduleId: number) => {
    console.log(`=== ACCESS CHECK FOR MODULE ${moduleId} ===`);
    
    // Always allow access to module 1
    if (moduleId === 1) {
      console.log('Module 1: Access granted (always accessible)');
      return true;
    }
    
    if (!testData) {
      console.log('No test data available, denying access');
      return false;
    }
    
    const { tests, attempts, progress } = testData;
    
    console.log('Available data:', {
      totalTests: tests.length,
      totalAttempts: attempts.length,
      totalProgress: progress.length
    });
    
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
      
      console.log(`Module ${i} test check:`, {
        testId: moduleTest.id,
        hasAttempt: !!testAttempt,
        attemptPassed: testAttempt?.passed,
        progressScore: moduleProgress?.test_score,
        hasPassedTest
      });
      
      if (!hasPassedTest) {
        console.log(`❌ Module ${i} test not passed (required for module ${moduleId} access)`);
        return false;
      }
    }
    
    console.log(`✅ Access granted to module ${moduleId} - all previous tests passed`);
    return true;
  };

  // Force refresh test data when needed
  const refreshAccess = () => {
    refetchTestData();
  };

  return {
    courseAccess: courseAccess || [],
    isLoading: isLoading || !testData,
    hasAccessToModule,
    refreshAccess,
  };
};
