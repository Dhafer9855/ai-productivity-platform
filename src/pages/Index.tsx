import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import StatsCard from "@/components/StatsCard";
import PaymentButton from "@/components/PaymentButton";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Target, Trophy, BookOpen, Users } from "lucide-react";

const Index = () => {
  const modules = [
    {
      moduleNumber: 1,
      title: "Introduction to AI & Productivity",
      description: "Understand what AI is and how it impacts work. Learn the fundamentals of AI technology and its role in modern workplace efficiency.",
      lessons: [
        { title: "What is AI? (with animation explainer)", type: "video" as const, duration: "12 min", completed: true },
        { title: "How AI boosts workplace efficiency", type: "text" as const, duration: "8 min", completed: true },
        { title: "AI vs Automation vs Machine Learning", type: "video" as const, duration: "15 min", completed: false },
      ],
      progress: 67,
      estimatedTime: "45 min"
    },
    {
      moduleNumber: 2,
      title: "AI Tools for Everyday Tasks",
      description: "Explore tools that automate daily work routines. Discover ChatGPT, Grammarly, email assistants, and scheduling AI.",
      lessons: [
        { title: "AI Writing Assistants (ChatGPT, Grammarly, Jasper)", type: "video" as const, duration: "18 min", completed: false },
        { title: "AI Email & Meeting Helpers", type: "text" as const, duration: "12 min", completed: false },
        { title: "AI Scheduling & Planning", type: "video" as const, duration: "14 min", completed: false },
      ],
      progress: 0,
      estimatedTime: "55 min"
    },
    {
      moduleNumber: 3,
      title: "AI in Project Management & Communication",
      description: "Improve team collaboration and task tracking with smart project management tools and real-time AI collaboration.",
      lessons: [
        { title: "Smart Task Managers (ClickUp, Asana AI, Notion AI)", type: "video" as const, duration: "20 min", completed: false },
        { title: "Real-time Collaboration", type: "text" as const, duration: "15 min", completed: false },
        { title: "AI Meeting Notes & Actions", type: "video" as const, duration: "16 min", completed: false },
      ],
      progress: 0,
      estimatedTime: "1h 5min",
      isLocked: true
    },
    {
      moduleNumber: 4,
      title: "AI for Document & Data Handling",
      description: "Use AI to summarize, extract, and analyze data. Master document processing and AI-powered dashboards.",
      lessons: [
        { title: "Summarization & Auto-generation", type: "video" as const, duration: "22 min", completed: false },
        { title: "Data Extraction & Cleanup", type: "text" as const, duration: "18 min", completed: false },
        { title: "AI Dashboards", type: "video" as const, duration: "25 min", completed: false },
      ],
      progress: 0,
      estimatedTime: "1h 15min",
      isLocked: true
    },
    {
      moduleNumber: 5,
      title: "Building AI Workflows",
      description: "Integrate multiple tools into efficient workflows using no-code AI tools, app connections, and productivity templates.",
      lessons: [
        { title: "No-code AI Tools (Zapier, n8n, Make)", type: "video" as const, duration: "28 min", completed: false },
        { title: "Connecting Apps using AI agents", type: "text" as const, duration: "20 min", completed: false },
        { title: "Productivity Templates & Recipes", type: "video" as const, duration: "15 min", completed: false },
      ],
      progress: 0,
      estimatedTime: "1h 10min",
      isLocked: true
    },
    {
      moduleNumber: 6,
      title: "AI Ethics, Privacy, and Job Impact",
      description: "Understand limitations, risks, and job evolution. Learn responsible AI use and develop team policies.",
      lessons: [
        { title: "Responsible AI Use at Work", type: "text" as const, duration: "12 min", completed: false },
        { title: "AI & Job Roles: What's Changing?", type: "video" as const, duration: "18 min", completed: false },
        { title: "AI Policy for Teams", type: "text" as const, duration: "10 min", completed: false },
      ],
      progress: 0,
      estimatedTime: "50 min",
      isLocked: true
    },
    {
      moduleNumber: 7,
      title: "Case Studies & Final Project",
      description: "Apply knowledge to your real work scenario through case studies and build your own AI productivity plan.",
      lessons: [
        { title: "Real Business Use Cases", type: "video" as const, duration: "25 min", completed: false },
        { title: "Build Your Own AI Productivity Plan", type: "text" as const, duration: "30 min", completed: false },
        { title: "Final Project Presentation", type: "quiz" as const, duration: "45 min", completed: false },
      ],
      progress: 0,
      estimatedTime: "1h 40min",
      isLocked: true
    }
  ];

  const stats = [
    {
      title: "Course Progress",
      value: "15%",
      description: "2 of 7 modules completed",
      icon: GraduationCap,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "Time Invested",
      value: "2.5h",
      description: "Out of 8 hours total",
      icon: Clock,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "Skills Unlocked",
      value: "8",
      description: "AI productivity techniques",
      icon: Target,
      gradient: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Achievements",
      value: "3",
      description: "Certificates earned",
      icon: Trophy,
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI for Workplace Productivity
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Master the tools, techniques, and transformations that will accelerate your career in the AI-powered workplace.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">7 Comprehensive Modules</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">8+ Hours of Content</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Beginner Friendly</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <PaymentButton />
            <Button variant="outline" className="px-8 py-3 text-lg font-medium">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Modules Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Course Modules</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>
        </div>

        {/* Course Add-ons Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Add-ons & Resources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Templates</h4>
              <p className="text-sm text-gray-600">Downloadable workflow and prompt guides</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Tools Directory</h4>
              <p className="text-sm text-gray-600">Comprehensive list of productivity tools</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Certificate</h4>
              <p className="text-sm text-gray-600">Professional completion certificate</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-orange-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
              <p className="text-sm text-gray-600">Discussion boards & peer review</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
