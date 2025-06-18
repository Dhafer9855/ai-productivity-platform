
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTests = () => {
  const { user } = useAuth();

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

  return {
    tests,
    attempts,
    isLoading: testsLoading,
    getTestQuestions,
  };
};
