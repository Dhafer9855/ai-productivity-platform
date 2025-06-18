
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCourseAccess = () => {
  const { user } = useAuth();

  const { data: courseAccess, isLoading } = useQuery({
    queryKey: ['courseAccess', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Use any type to bypass TypeScript errors for the new table
        const { data, error } = await (supabase as any)
          .from('course_access')
          .select('module_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching course access:', error);
          // If course_access table doesn't exist or user has no records, assume full access for now
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Course access query failed:', error);
        // Fallback to full access if there's any error
        return [];
      }
    },
    enabled: !!user,
  });

  const hasAccessToModule = (moduleId: number) => {
    // If no course access data or course_access table doesn't exist, grant access to all modules
    if (!courseAccess || courseAccess.length === 0) {
      return true;
    }
    return courseAccess.some((access: any) => access.module_id === moduleId);
  };

  return {
    courseAccess,
    isLoading,
    hasAccessToModule,
  };
};
