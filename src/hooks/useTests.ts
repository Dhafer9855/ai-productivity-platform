
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useTests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('module_id');

      if (error) throw error;
      return data;
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ['test_attempts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getTestQuestions = async (testId: number) => {
    const { data, error } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', testId)
      .order('order_number');

    if (error) throw error;
    return data;
  };

  const submitTestAttempt = useMutation({
    mutationFn: async ({ testId, answers, score, totalQuestions }: {
      testId: number;
      answers: Record<string, string>;
      score: number;
      totalQuestions: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('test_attempts')
        .insert({
          test_id: testId,
          user_id: user.id,
          answers,
          score,
          total_questions: totalQuestions,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test_attempts'] });
      toast({
        title: "Test Completed",
        description: "Your test has been submitted!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit test",
        variant: "destructive",
      });
    },
  });

  return {
    tests,
    attempts,
    isLoading: testsLoading,
    getTestQuestions,
    submitTestAttempt: submitTestAttempt.mutate,
  };
};
