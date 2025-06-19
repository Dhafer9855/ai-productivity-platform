
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCourseAccess = () => {
  const { user } = useAuth();

  const { data: courseAccess, isLoading } = useQuery({
    queryKey: ['courseAccess', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Since course_access table doesn't exist, just return empty array
      // This will grant access to all modules by default
      console.log('Course access: granting access to all modules (no course_access table)');
      return [];
    },
    enabled: !!user,
  });

  const hasAccessToModule = (moduleId: number) => {
    // Grant access to all modules since course_access table doesn't exist
    return true;
  };

  return {
    courseAccess: courseAccess || [],
    isLoading,
    hasAccessToModule,
  };
};
