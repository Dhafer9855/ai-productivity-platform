
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Calendar, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ProjectStatus = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkProjectStatus();
    }
  }, [user]);

  const checkProjectStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error checking project status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Final Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading project status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Final Project
        </CardTitle>
        <CardDescription>
          Complete your AI Workplace Productivity project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {project ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Submitted
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Submitted on {new Date(project.submitted_at).toLocaleDateString()}
            </div>

            {project.submission_url && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(project.submission_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </Button>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/final-project')}
              >
                Update Submission
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Ready to showcase your AI productivity skills? Submit your final project to complete the course.
            </p>
            <Button onClick={() => navigate('/final-project')}>
              <FileText className="h-4 w-4 mr-2" />
              Submit Final Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;
