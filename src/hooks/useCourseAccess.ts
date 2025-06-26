
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
    gcTime: 0, // Don't cache to ensure we get updated data
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
    
    // For modules 2 and above, check if the PREVIOUS module has:
    // 1. A passing test attempt (score >= 80)
    // 2. All lessons completed in that module
    const previousModuleId = moduleId - 1;
    
    // Check if previous module test was passed
    const previousModuleTest = tests.find(t => t.module_id === previousModuleId);
    
    if (!previousModuleTest) {
      console.log(`No test found for previous module ${previousModuleId}, blocking access to module ${moduleId}`);
      return false;
    }
    
    // Check if there's a passing test attempt for the previous module
    const passingTestAttempt = attempts.find(a => 
      a.test_id === previousModuleTest.id && 
      a.passed === true && 
      a.score >= 80
    );
    
    if (!passingTestAttempt) {
      console.log(`❌ Previous module ${previousModuleId} test not passed (required for module ${moduleId} access)`);
      return false;
    }
    
    // Check if previous module lessons are completed
    const previousModuleProgress = progress.find(p => 
      p.module_id === previousModuleId && 
      p.completed === true && 
      p.lesson_id !== null
    );
    
    if (!previousModuleProgress) {
      console.log(`❌ Previous module ${previousModuleId} not completed (required for module ${moduleId} access)`);
      return false;
    }
    
    console.log(`✅ Access granted to module ${moduleId} - previous module ${previousModuleId} test passed and completed`);
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
