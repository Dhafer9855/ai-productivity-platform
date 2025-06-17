
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

    // Get all module scores
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('module_id, test_score, assignment_score')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
      return;
    }

    // Calculate average scores
    const moduleScores = progress?.reduce((acc, curr) => {
      if (!acc[curr.module_id]) {
        acc[curr.module_id] = { test: 0, assignment: 0, count: 0 };
      }
      if (curr.test_score) acc[curr.module_id].test = curr.test_score;
      if (curr.assignment_score) acc[curr.module_id].assignment = curr.assignment_score;
      acc[curr.module_id].count++;
      return acc;
    }, {} as Record<number, { test: number; assignment: number; count: number }>);

    if (!moduleScores) return;

    // Calculate overall grade (average of all module scores)
    const moduleAverages = Object.values(moduleScores).map(module => {
      return (module.test + module.assignment) / 2;
    });

    const overallGrade = moduleAverages.reduce((sum, score) => sum + score, 0) / moduleAverages.length;

    // Check if eligible for certificate (80% in all modules)
    const eligibleForCertificate = moduleAverages.every(score => score >= 80) && moduleAverages.length >= 7;

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
