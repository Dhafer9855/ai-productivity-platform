
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

      // Get all module test scores
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('module_id, test_score')
        .eq('user_id', user.id)
        .not('test_score', 'is', null)
        .gte('test_score', 0); // Only include actual test scores (>= 0)

      if (error) {
        console.error('Error fetching progress:', error);
        return null;
      }

      if (!progress || progress.length === 0) {
        console.log('No test scores found');
        return { grade: 0, completedModules: 0 }; // Return 0 instead of null
      }

      // Calculate average test scores - only valid scores
      const testScores = progress
        .filter(p => p.test_score !== null && p.test_score >= 0)
        .map(p => p.test_score);

      if (testScores.length === 0) return { grade: 0, completedModules: 0 };

      const overallGrade = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;
      
      return {
        grade: Math.round(overallGrade * 10) / 10, // Round to 1 decimal place
        completedModules: testScores.length
      };
    },
    enabled: !!user,
  });

  const calculateOverallGradeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all module test scores
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('module_id, test_score, assignment_score')
        .eq('user_id', user.id)
        .not('test_score', 'is', null)
        .gte('test_score', 0); // Only include actual test scores

      if (error) {
        console.error('Error fetching progress:', error);
        throw error;
      }

      if (!progress || progress.length === 0) {
        console.log('No test scores found');
        return null;
      }

      // Calculate average test scores
      const testScores = progress
        .filter(p => p.test_score !== null && p.test_score >= 0)
        .map(p => p.test_score);

      if (testScores.length === 0) return null;

      const overallGrade = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;

      // Check if eligible for certificate (80% average and completed at least 7 modules)
      const eligibleForCertificate = overallGrade >= 80 && testScores.length >= 7;

      // Update user profile
      const updates: any = { overall_grade: overallGrade };
      
      if (eligibleForCertificate && !userProfile?.certificate_earned) {
        updates.certificate_earned = true;
        updates.certificate_issued_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating grade:', updateError);
        throw updateError;
      }

      return { overallGrade, eligibleForCertificate };
    },
    onSuccess: (result) => {
      if (result) {
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
  });

  // Auto-calculate grade when test scores change
  useEffect(() => {
    if (currentGrade?.grade && currentGrade?.completedModules > 0 && user) {
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
