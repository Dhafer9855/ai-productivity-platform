
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

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

  const calculateOverallGrade = async () => {
    if (!user) return;

    // Get all module test scores
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('module_id, test_score, assignment_score')
      .eq('user_id', user.id)
      .not('test_score', 'is', null); // Only include modules with test scores

    if (error) {
      console.error('Error fetching progress:', error);
      return;
    }

    if (!progress || progress.length === 0) {
      console.log('No test scores found');
      return;
    }

    // Calculate average test scores
    const testScores = progress
      .filter(p => p.test_score !== null)
      .map(p => p.test_score);

    if (testScores.length === 0) return;

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
    } else {
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      if (eligibleForCertificate && !userProfile?.certificate_earned) {
        toast({
          title: "Congratulations! 🎉",
          description: "You've earned your completion certificate!",
        });
      }
    }
  };

  return {
    userProfile,
    calculateOverallGrade,
  };
};
