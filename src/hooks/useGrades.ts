
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

      // Get all module test scores from user_progress
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('module_id, test_score')
        .eq('user_id', user.id)
        .not('test_score', 'is', null); // Only include modules with test scores

      if (error) {
        console.error('Error fetching progress for grade calculation:', error);
        return null;
      }

      console.log('Progress data for grade calculation:', progress);

      if (!progress || progress.length === 0) {
        console.log('No test scores found');
        return null;
      }

      // Calculate average test scores
      const testScores = progress
        .filter(p => p.test_score !== null && p.test_score !== undefined)
        .map(p => p.test_score);

      console.log('Test scores found:', testScores);

      if (testScores.length === 0) return null;

      const overallGrade = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;
      
      console.log('Calculated overall grade:', overallGrade, 'from', testScores.length, 'modules');
      
      return {
        grade: Math.round(overallGrade * 10) / 10, // Round to 1 decimal place
        completedModules: testScores.length
      };
    },
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds to ensure real-time updates
  });

  const calculateOverallGradeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Starting grade calculation mutation for user:', user.id);

      // Get all module test scores
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('module_id, test_score, assignment_score')
        .eq('user_id', user.id)
        .not('test_score', 'is', null); // Only include modules with test scores

      if (error) {
        console.error('Error fetching progress for mutation:', error);
        throw error;
      }

      console.log('Progress data for mutation:', progress);

      if (!progress || progress.length === 0) {
        console.log('No test scores found in mutation');
        return null;
      }

      // Calculate average test scores
      const testScores = progress
        .filter(p => p.test_score !== null && p.test_score !== undefined)
        .map(p => p.test_score);

      if (testScores.length === 0) return null;

      const overallGrade = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;

      console.log('Mutation calculated grade:', overallGrade, 'from', testScores.length, 'test scores');

      // Check if eligible for certificate (80% average and completed at least 7 modules)
      const eligibleForCertificate = overallGrade >= 80 && testScores.length >= 7;

      // Update user profile
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

  // Auto-calculate grade when test scores change
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
