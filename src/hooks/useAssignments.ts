
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useAssignments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('module_id');

      if (error) throw error;
      return data;
    },
  });

  const { data: submissions } = useQuery({
    queryKey: ['assignment_submissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitAssignment = useMutation({
    mutationFn: async ({ assignmentId, submissionText, submissionUrl }: {
      assignmentId: number;
      submissionText?: string;
      submissionUrl?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('assignment_submissions')
        .upsert({
          assignment_id: assignmentId,
          user_id: user.id,
          submission_text: submissionText,
          submission_url: submissionUrl,
        }, {
          onConflict: 'assignment_id,user_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment_submissions'] });
      toast({
        title: "Assignment Submitted",
        description: "Your assignment has been submitted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    },
  });

  return {
    assignments,
    submissions,
    isLoading,
    submitAssignment: submitAssignment.mutate,
  };
};
