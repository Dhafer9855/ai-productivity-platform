
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useUserProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['userProjects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const createProject = useMutation({
    mutationFn: async (projectData: {
      title: string;
      description: string;
      submission_url?: string;
      status?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          ...projectData,
        });

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      toast({
        title: "Project Created",
        description: "Your project has been saved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      console.error('Project creation error:', error);
    },
  });

  return {
    projects,
    isLoading,
    createProject: createProject.mutate,
  };
};
