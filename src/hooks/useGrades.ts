
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useGrades = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ['user_profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Get current module test scores to show real-time grade
  const { data: currentGrade } = useQuery({
    queryKey: ['current_grade', user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log('Fetching current grade for user:', user.id);

      // Get all test attempts with scores - only get the latest attempt per test
      const { data: testAttempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('test_id, score, total_questions, passed')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (attemptsError) {
        console.error('Error fetching test attempts:', attemptsError);
        return null;
      }

      console.log('Test attempts found:', testAttempts);

      if (!testAttempts || testAttempts.length === 0) {
        console.log('No test attempts found');
        return null;
      }

      // Get unique test attempts (latest attempt per test)
      const uniqueTestAttempts = testAttempts.reduce((acc, attempt) => {
        if (!acc[attempt.test_id]) {
          acc[attempt.test_id] = attempt;
        }
        return acc;
      }, {} as Record<number, typeof testAttempts[0]>);

      const uniqueAttempts = Object.values(uniqueTestAttempts);
      console.log('Unique test attempts:', uniqueAttempts);

      // Calculate grade - score is already the number of correct answers, convert to percentage
      const testScores = uniqueAttempts.map(attempt => {
        const percentage = (attempt.score / attempt.total_questions) * 100;
        console.log(`Test ${attempt.test_id}: ${attempt.score}/${attempt.total_questions} = ${percentage}%`);
        return percentage;
      });

      if (testScores.length === 0) return null;

      const overallGrade = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;
      
      console.log('Calculated overall grade:', overallGrade, 'from', testScores.length, 'tests');
      
      return {
        grade: Math.round(overallGrade * 10) / 10, // Round to 1 decimal place
        completedModules: uniqueAttempts.length // Count unique completed tests/modules
      };
    },
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds to ensure real-time updates
  });

  const calculateOverallGradeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Starting grade calculation mutation for user:', user.id);

      // Get all test attempts with scores - only latest per test
      const { data: testAttempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('test_id, score, total_questions, passed')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (attemptsError) {
        console.error('Error fetching test attempts for mutation:', attemptsError);
        throw attemptsError;
      }

      console.log('Test attempts for mutation:', testAttempts);

      if (!testAttempts || testAttempts.length === 0) {
        console.log('No test attempts found in mutation');
        return null;
      }

      // Get unique test attempts (latest attempt per test)
      const uniqueTestAttempts = testAttempts.reduce((acc, attempt) => {
        if (!acc[attempt.test_id]) {
          acc[attempt.test_id] = attempt;
        }
        return acc;
      }, {} as Record<number, typeof testAttempts[0]>);

      const uniqueAttempts = Object.values(uniqueTestAttempts);

      // Calculate grade - score is already the number of correct answers, convert to percentage once
      const testScores = uniqueAttempts.map(attempt => {
        return (attempt.score / attempt.total_questions) * 100;
      });

      if (testScores.length === 0) return null;

      const overallGrade = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;

      console.log('Mutation calculated grade:', overallGrade, 'from', testScores.length, 'test scores');

      // Check if eligible for certificate (80% average and completed at least 7 modules)
      const eligibleForCertificate = overallGrade >= 80 && testScores.length >= 7;

      // Update user profile - store as percentage (0-100), not decimal
      const updates: any = { 
        overall_grade: Math.round(overallGrade * 10) / 10 // Round to 1 decimal place
      };
      
      if (eligibleForCertificate && !userProfile?.certificate_earned) {
        updates.certificate_earned = true;
        updates.certificate_issued_at = new Date().toISOString();
      }

      console.log('Updating user profile with:', updates);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating grade:', updateError);
        throw updateError;
      }

      console.log('Successfully updated user profile');

      return { overallGrade: updates.overall_grade, eligibleForCertificate };
    },
    onSuccess: (result) => {
      if (result) {
        console.log('Grade calculation successful:', result);
        queryClient.invalidateQueries({ queryKey: ['user_profile'] });
        queryClient.invalidateQueries({ queryKey: ['current_grade'] });
        
        if (result.eligibleForCertificate && !userProfile?.certificate_earned) {
          toast({
            title: "Congratulations! 🎉",
            description: "You've earned your completion certificate!",
          });
        }
      }
    },
    onError: (error) => {
      console.error('Grade calculation failed:', error);
    },
  });

  // Auto-calculate grade when test attempts change
  useEffect(() => {
    if (currentGrade?.completedModules && user) {
      console.log('Triggering grade calculation due to completed modules change:', currentGrade.completedModules);
      calculateOverallGradeMutation.mutate();
    }
  }, [currentGrade?.completedModules, user?.id]);

  return {
    userProfile,
    currentGrade,
    calculateOverallGrade: calculateOverallGradeMutation.mutate,
    isCalculatingGrade: calculateOverallGradeMutation.isPending,
  };
};
