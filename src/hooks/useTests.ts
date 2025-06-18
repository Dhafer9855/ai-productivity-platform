
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

      console.log('Submitting test attempt:', { testId, score, totalQuestions, userId: user.id });

      // First insert the test attempt
      const { error: testError } = await supabase
        .from('test_attempts')
        .insert({
          test_id: testId,
          user_id: user.id,
          answers,
          score,
          total_questions: totalQuestions,
        });

      if (testError) {
        console.error('Error inserting test attempt:', testError);
        throw testError;
      }

      // Get the test to find the module_id
      const { data: test, error: testFetchError } = await supabase
        .from('tests')
        .select('module_id')
        .eq('id', testId)
        .single();

      if (testFetchError) {
        console.error('Error fetching test module:', testFetchError);
        throw testFetchError;
      }

      // Update user progress with test score
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: test.module_id,
          test_score: score,
        }, {
          onConflict: 'user_id,module_id'
        });

      if (progressError) {
        console.error('Error updating user progress:', progressError);
        throw progressError;
      }

      return { score, testId, moduleId: test.module_id };
    },
    onSuccess: ({ score }) => {
      queryClient.invalidateQueries({ queryKey: ['test_attempts'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      
      toast({
        title: "Test Completed Successfully!",
        description: `You scored ${score}%`,
      });
    },
    onError: (error) => {
      console.error('Test submission error:', error);
      toast({
        title: "Test Submission Error",
        description: "There was an issue submitting your test. Your answers may have been saved.",
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
