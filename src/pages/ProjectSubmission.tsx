
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";

const ProjectSubmission = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle || !projectDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in the required fields (title and description)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate submission (in a real app, this would send to your backend)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Project Submitted Successfully!",
        description: "Thank you for submitting your final project. Our team will review it soon.",
      });

      // Reset form
      setProjectTitle("");
      setProjectDescription("");
      setGithubUrl("");
      setLiveUrl("");
      setAdditionalNotes("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Final Project Submission
              </h1>
              <p className="text-lg text-gray-600">
                Submit your completed AI Workplace Productivity project
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Please provide details about your final project. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Enter your project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project, the AI tools you used, and how it improves workplace productivity"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourusername/your-project"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live Demo URL</Label>
                    <Input
                      id="liveUrl"
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://your-project-demo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any additional information about your project, challenges faced, or lessons learned"
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Submission Guidelines</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Your project should demonstrate practical use of AI tools in workplace scenarios</li>
                      <li>• Include documentation explaining your implementation approach</li>
                      <li>• Ensure your project is accessible and functional</li>
                      <li>• Projects will be reviewed within 5-7 business days</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting Project...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Final Project
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {user && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Submitting as: {user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectSubmission;
