import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Clock, CheckCircle } from "lucide-react";
import { generateAIProductivityAuditTemplate, downloadTemplate } from "@/utils/templateGenerator";

const Practice = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, modules(*)')
        .eq('id', parseInt(lessonId!))
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDownloadTemplate = () => {
    const template = generateAIProductivityAuditTemplate();
    downloadTemplate(template, 'AI_Productivity_Audit_Template.txt');
  };

  const getPracticeContent = (lessonOrder: number) => {
    const practiceContent = {
      1: {
        title: "Your Personal AI Productivity Audit",
        description: "Complete this exercise to identify your top 3 AI implementation opportunities",
        steps: [
          {
            title: "Time Log",
            description: "Track your activities for 3 days using Toggl or similar tool",
            details: [
              "Sign up for a free Toggl account at toggl.com",
              "Install the Toggl Track browser extension or mobile app",
              "Create project categories: Creative, Analytical, Administrative, Communication",
              "Log every work activity for 3 consecutive days",
              "Include brief descriptions of each task",
              "Note which tasks feel repetitive or time-consuming"
            ]
          },
          {
            title: "Task Categorization", 
            description: "Group activities into: Creative, Analytical, Administrative, and Communication",
            details: [
              "Review your 3-day time log",
              "Creative: Writing, designing, brainstorming, content creation",
              "Analytical: Data analysis, research, problem-solving, calculations",
              "Administrative: Scheduling, filing, email management, reporting",
              "Communication: Meetings, calls, presentations, team coordination",
              "Assign each logged activity to one of these categories",
              "Calculate total time spent in each category"
            ]
          },
          {
            title: "Opportunity Scoring",
            description: "Rate each task category on: Time Consumption (1-5), Repetitiveness (1-5), and AI Suitability (1-5)",
            details: [
              "Time Consumption: 1=Quick tasks, 5=Major time drains",
              "Repetitiveness: 1=Unique tasks, 5=Highly repetitive",
              "AI Suitability: 1=Requires human judgment, 5=Rule-based/predictable",
              "Score each of your 4 categories on all 3 dimensions",
              "Use your time log data to inform your ratings",
              "Be honest about which tasks you find most tedious"
            ]
          },
          {
            title: "Priority Matrix",
            description: "Calculate scores (Time × Repetitiveness × AI Suitability) and rank your opportunities",
            details: [
              "Multiply the three scores for each category",
              "Creative example: 4 × 2 × 3 = 24 points",
              "Administrative example: 5 × 5 × 4 = 100 points",
              "Rank categories from highest to lowest score",
              "Higher scores = better AI automation opportunities",
              "Focus on categories scoring 60+ points first"
            ]
          },
          {
            title: "Action Plan",
            description: "Select your top 3 opportunities and research appropriate AI tools for each",
            details: [
              "Choose your 3 highest-scoring categories",
              "For each category, identify 2-3 specific AI tools to explore",
              "Administrative: Calendly, Zapier, ChatGPT for emails",
              "Creative: Jasper, Canva AI, Grammarly",
              "Analytical: ChatGPT for data analysis, Tableau AI insights",
              "Communication: Otter.ai, Loom AI, scheduling assistants",
              "Set implementation timeline: Week 1, Week 2, Week 3",
              "Define success metrics for each tool adoption"
            ]
          }
        ],
        downloadable: {
          title: "AI Productivity Audit Template",
          description: "Comprehensive worksheet to complete your audit"
        }
      },
      2: {
        title: "Daily AI Assistant Integration Challenge",
        description: "Implement ChatGPT, email automation, and smart scheduling in your daily workflow",
        steps: [
          {
            title: "ChatGPT Setup & Prompt Library",
            description: "Create your personal ChatGPT workspace with effective prompts",
            details: [
              "Sign up for ChatGPT Plus for better performance",
              "Create a 'Daily Work' chat thread",
              "Build your prompt library with these templates:",
              "Email responses: 'Help me write a professional response to: [paste email]'",
              "Meeting prep: 'Create an agenda for a [duration] meeting about [topic] with [participants]'",
              "Task breakdown: 'Break this project into actionable steps: [describe project]'",
              "Document review: 'Summarize the key points and action items from: [paste content]'",
              "Save effective prompts in a document for quick reference"
            ]
          },
          {
            title: "Email Automation Setup",
            description: "Configure Grammarly and email templates for faster communication",
            details: [
              "Install Grammarly browser extension and desktop app",
              "Configure tone settings: Professional for external emails, Casual for internal",
              "Set up Grammarly Goals: Audience (General), Formality (Formal), Domain (Business)",
              "Create 5 email templates in your email client:",
              "Meeting request template with calendar links",
              "Project update template with status sections",
              "Follow-up email template with clear action items",
              "Out-of-office template with alternative contacts",
              "Thank you/introduction template for networking"
            ]
          },
          {
            title: "Smart Scheduling Implementation",
            description: "Set up Calendly and scheduling automation",
            details: [
              "Create free Calendly account and connect your calendar",
              "Set up 3 meeting types: 15-min check-in, 30-min discussion, 60-min deep dive",
              "Configure buffer times: 5 minutes between meetings",
              "Set working hours and time zones accurately",
              "Create scheduling preferences: preferred meeting times",
              "Add screening questions for complex meeting types",
              "Set up automatic confirmation and reminder emails",
              "Integrate with Zoom or Google Meet for automatic video links"
            ]
          },
          {
            title: "Daily Integration Practice",
            description: "Use all three tools for one full work week",
            details: [
              "Monday: Use ChatGPT for 3 different work tasks, document results",
              "Tuesday: Send 5 emails using Grammarly assistance, note improvements",
              "Wednesday: Schedule 2 meetings using Calendly, track time saved",
              "Thursday: Combine all tools - ChatGPT for meeting prep, Grammarly for follow-up",
              "Friday: Use ChatGPT to create weekly summary and plan next week",
              "Track time saved each day using a simple log",
              "Note which tools feel most natural and useful"
            ]
          },
          {
            title: "Optimization & Habit Formation",
            description: "Refine your AI tool usage and create sustainable habits",
            details: [
              "Review your week's usage data and identify patterns",
              "Customize ChatGPT prompts based on what worked best",
              "Adjust Grammarly settings if needed for your writing style",
              "Optimize Calendly settings based on actual booking patterns",
              "Create a 'AI Tools Checklist' for daily reference",
              "Set phone reminders to use tools until habits form",
              "Share successful prompts/templates with team members",
              "Plan Week 2 goals: increase usage frequency and complexity"
            ]
          }
        ],
        downloadable: {
          title: "AI Daily Integration Tracker",
          description: "Week-by-week implementation guide and progress tracker"
        }
      },
      // Add more practice content for other lessons...
      3: {
        title: "Smart Project Management Setup",
        description: "Implement AI-powered project management tools and workflows",
        steps: [
          {
            title: "Tool Selection & Setup",
            description: "Choose and configure your AI project management platform",
            details: [
              "Evaluate Monday.com, Asana, or ClickUp for AI features",
              "Set up project templates with AI-suggested task dependencies",
              "Configure automated progress tracking and reporting",
              "Enable smart notifications and priority suggestions",
              "Connect integrations with your existing tools"
            ]
          },
          {
            title: "AI-Powered Task Management",
            description: "Create intelligent task workflows",
            details: [
              "Set up automatic task creation from emails",
              "Configure AI-suggested due dates based on project timelines",
              "Enable smart resource allocation recommendations",
              "Create automated status update workflows",
              "Set up predictive project timeline adjustments"
            ]
          }
        ],
        downloadable: {
          title: "Project Management AI Setup Guide",
          description: "Step-by-step configuration checklist"
        }
      }
    };

    return practiceContent[lessonOrder] || practiceContent[1];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Practice not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const practiceContent = getPracticeContent(lesson.order);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Navigation */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/lesson/${moduleId}/${lessonId}`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Module {lesson.modules.order}</span>
              <span>•</span>
              <span>{lesson.modules.title}</span>
              <span>•</span>
              <span>Lesson {lesson.order} Practice</span>
            </div>
          </div>

          {/* Practice Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Practical Exercise
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{practiceContent.title}</CardTitle>
                  <p className="text-gray-600">{practiceContent.description}</p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>45-60 min</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Practice Steps */}
          <div className="space-y-6 mb-8">
            {practiceContent.steps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    {step.title}
                  </CardTitle>
                  <p className="text-gray-600 ml-11">{step.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="ml-11 space-y-3">
                    <h4 className="font-medium text-gray-900">Detailed Steps:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download Template */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{practiceContent.downloadable.title}</h3>
                  <p className="text-gray-600">{practiceContent.downloadable.description}</p>
                </div>
                <Button 
                  onClick={handleDownloadTemplate}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back to Lesson */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Need to review the lesson content?</h3>
                <p className="text-gray-600 mb-4">
                  Go back to the lesson to review concepts and examples that will help with this practice.
                </p>
                <Button 
                  onClick={() => navigate(`/lesson/${moduleId}/${lessonId}`)}
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Practice;
