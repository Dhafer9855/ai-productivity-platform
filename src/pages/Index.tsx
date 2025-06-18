import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Target, Trophy, BookOpen, Users, CheckCircle, Play, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user has any progress
  const { data: hasProgress } = useQuery({
    queryKey: ['userHasProgress', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) return false;
      return data && data.length > 0;
    },
    enabled: !!user?.id,
  });

  const getButtonText = () => {
    if (!user) return "Get Started";
    return hasProgress ? "Continue Learning" : "Get Started";
  };

  const getButtonIcon = () => {
    if (!user) return Play;
    return hasProgress ? GraduationCap : Play;
  };

  const handleMainAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const features = [
    {
      title: "7 Comprehensive Modules",
      description: "From AI basics to advanced workflow automation",
      icon: BookOpen,
    },
    {
      title: "Hands-on Projects",
      description: "Real-world applications you can implement immediately",
      icon: Target,
    },
    {
      title: "Expert Guidance",
      description: "Learn from industry professionals with proven results",
      icon: Users,
    },
    {
      title: "Certificates",
      description: "Professional completion certificates for your achievements",
      icon: Trophy,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      content: "This course completely transformed how I approach daily tasks. I'm now 3x more productive!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Director", 
      company: "GrowthCo",
      content: "The AI tools I learned here save me 10+ hours per week. Best investment I've made.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Operations Lead",
      company: "StartupXYZ",
      content: "From automation to smart scheduling, this course covers everything you need to know.",
      rating: 5,
    },
  ];

  const curriculum = [
    {
      module: 1,
      title: "Introduction to AI & Productivity",
      lessons: 3,
      duration: "45 min",
      description: "Understanding AI fundamentals and workplace applications"
    },
    {
      module: 2,
      title: "AI Tools for Everyday Tasks",
      lessons: 3,
      duration: "55 min",
      description: "ChatGPT, Grammarly, email assistants, and scheduling AI"
    },
    {
      module: 3,
      title: "AI in Project Management",
      lessons: 3,
      duration: "65 min",
      description: "Smart task managers and real-time collaboration tools"
    },
    {
      module: 4,
      title: "Document & Data Handling",
      lessons: 3,
      duration: "75 min",
      description: "AI summarization, data extraction, and dashboard creation"
    },
    {
      module: 5,
      title: "Building AI Workflows",
      lessons: 3,
      duration: "70 min",
      description: "No-code automation with Zapier, n8n, and Make"
    },
    {
      module: 6,
      title: "AI Ethics & Privacy",
      lessons: 3,
      duration: "50 min",
      description: "Responsible AI use and team policy development"
    },
    {
      module: 7,
      title: "Case Studies & Projects",
      lessons: 3,
      duration: "100 min",
      description: "Real business applications and final project"
    },
  ];

  const ButtonIcon = getButtonIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Master AI for Workplace Productivity
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your career with the tools, techniques, and strategies that will make you indispensable in the AI-powered workplace. Join thousands of professionals already using AI to work smarter, not harder.
            </p>
            
            <div className="bg-green-100 border border-green-300 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-green-800 font-semibold text-lg mb-2">
                ⚡ Stop Working Harder, Start Working Smarter
              </p>
              <p className="text-green-700">
                While your colleagues struggle with manual tasks, you'll be automating workflows and boosting productivity with AI. Get ahead of the curve now!
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span className="font-medium">7 Comprehensive Modules</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="font-medium">8+ Hours of Content</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
                <Users className="h-5 w-5 text-green-500" />
                <span className="font-medium">Beginner Friendly</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleMainAction}
              >
                <ButtonIcon className="h-5 w-5 mr-2" />
                {getButtonText()}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Our AI Productivity Course?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center p-6">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl w-fit mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Curriculum Preview */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Complete Curriculum
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {curriculum.map((item) => (
                <div key={item.module} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-1">Module {item.module}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{item.lessons} lessons</div>
                      <div>{item.duration}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What Our Students Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who have already mastered AI for workplace efficiency.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg font-medium"
                onClick={handleMainAction}
              >
                {getButtonText()}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
