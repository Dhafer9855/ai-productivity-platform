
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCourseData = () => {
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order');

      if (error) throw error;
      return data;
    },
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('module_id, order');

      if (error) throw error;
      return data;
    },
  });

  const getLessonsByModule = (moduleId: number) => {
    return lessons?.filter(lesson => lesson.module_id === moduleId) || [];
  };

  return {
    modules,
    lessons,
    getLessonsByModule,
    isLoading: modulesLoading || lessonsLoading,
  };
};
