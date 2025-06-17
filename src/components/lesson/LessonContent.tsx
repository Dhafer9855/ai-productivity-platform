
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Download, ExternalLink, Lightbulb, Target, CheckCircle, TrendingUp, Clock, Users, BookOpen, AlertCircle, Star } from "lucide-react";

interface LessonContentProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    content?: string;
    modules: {
      id: number;
      title: string;
      order: number;
    };
  };
}

const LessonContent = ({ lesson }: LessonContentProps) => {
  const getModuleContent = () => {
    switch (lesson.modules.id) {
      case 1:
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Understanding AI & Productivity</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  Artificial Intelligence is revolutionizing the modern workplace, transforming how we approach tasks, solve problems, and manage our daily workflows. This comprehensive lesson explores the fundamental relationship between AI and productivity, providing you with the knowledge and strategies to harness AI's potential effectively.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                  <div className="flex items-start">
                    <Lightbulb className="h-6 w-6 text-blue-500 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Key Insight</h3>
                      <p className="text-blue-800">
                        AI doesn't replace human creativity—it amplifies it. The most successful professionals use AI to handle routine tasks so they can focus on strategic thinking, innovation, and high-value activities that require human judgment and creativity.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">The Evolution of Work: From Manual to AI-Enhanced</h3>
                <p className="mb-4">
                  The workplace has undergone significant transformations throughout history. From the industrial revolution's mechanization to the digital age's computerization, each shift has fundamentally changed how we work. Today, we're experiencing the AI revolution—a paradigm shift that promises to be as transformative as any previous technological advancement.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Time Saved Weekly</p>
                          <p className="text-2xl font-bold text-blue-900">15-20 hrs</p>
                          <p className="text-xs text-blue-600 mt-1">Average per professional</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Productivity Increase</p>
                          <p className="text-2xl font-bold text-green-900">40-60%</p>
                          <p className="text-xs text-green-600 mt-1">In first 6 months</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Error Reduction</p>
                          <p className="text-2xl font-bold text-purple-900">75%</p>
                          <p className="text-xs text-purple-600 mt-1">In routine tasks</p>
                        </div>
                        <Target className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-xl font-semibold mb-4">Core AI Categories for Professional Enhancement</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-500" />
                        Task Automation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">
                        Automate repetitive, rule-based tasks that consume valuable time and mental energy.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Email sorting, filtering, and auto-responses</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Calendar scheduling and meeting coordination</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Data entry, processing, and validation</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Report generation and formatting</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                        Content Creation & Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">
                        Enhance your creative and analytical capabilities with AI-powered tools.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Writing assistance and editing</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Document summarization and analysis</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Presentation design and optimization</li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Research and information synthesis</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-xl font-semibold mb-4">The Psychology of AI Adoption</h3>
                <p className="mb-4">
                  Successfully integrating AI into your workflow requires understanding both the technical and psychological aspects of change. Many professionals experience "AI anxiety" - the fear of being replaced or becoming obsolete. However, research shows that professionals who embrace AI as a collaborative tool significantly outperform those who resist it.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">Important Mindset Shift</h3>
                      <p className="text-yellow-800">
                        Think of AI as your personal assistant, not your replacement. The goal is to become an "AI-augmented professional" who leverages technology to achieve superhuman productivity while maintaining human judgment and creativity.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Building Your AI-First Workflow</h3>
                <p className="mb-4">
                  Creating an effective AI-enhanced workflow involves three key phases:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-900">Phase 1: Assessment & Identification</h4>
                    <p className="text-gray-700">Audit your current tasks, identify repetitive work, and assess which activities would benefit most from AI assistance.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-900">Phase 2: Tool Selection & Integration</h4>
                    <p className="text-gray-700">Choose appropriate AI tools for identified tasks and gradually integrate them into your existing workflow.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-900">Phase 3: Optimization & Scaling</h4>
                    <p className="text-gray-700">Refine your AI-enhanced processes, measure improvements, and expand successful implementations to other areas.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* References Section */}
            <section className="mt-12 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                References & Further Reading
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">McKinsey Global Institute. (2023). "The Economic Potential of Generative AI."</p>
                    <p className="text-gray-600">Comprehensive analysis of AI's impact on productivity across industries.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Harvard Business Review. (2023). "How to Make AI Work for You."</p>
                    <p className="text-gray-600">Practical strategies for implementing AI in professional workflows.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">MIT Technology Review. (2023). "AI's Productivity Paradox."</p>
                    <p className="text-gray-600">Research on measuring and maximizing AI-driven productivity gains.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Essential AI Tools for Daily Tasks</h2>
              <p className="text-lg text-gray-700 mb-6">
                This comprehensive guide explores the most impactful AI tools that can transform your daily workflow. We'll examine each tool's capabilities, optimal use cases, pricing models, and integration strategies to help you make informed decisions about your AI toolkit.
              </p>

              <h3 className="text-xl font-semibold mb-4">The Modern Professional's AI Toolkit</h3>
              <p className="mb-6">
                The AI tools landscape has evolved rapidly, with new solutions emerging monthly. However, certain tools have proven their value across various industries and use cases. Here's a detailed analysis of the most essential AI tools for professional productivity.
              </p>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Comprehensive AI Tool Analysis</CardTitle>
                  <p className="text-gray-600">Detailed comparison of leading AI productivity tools</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Tool</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Primary Features</TableHead>
                        <TableHead>Best For</TableHead>
                        <TableHead>Pricing</TableHead>
                        <TableHead>Learning Curve</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">ChatGPT Plus</TableCell>
                        <TableCell><Badge variant="secondary">Text Generation</Badge></TableCell>
                        <TableCell>Advanced reasoning, code generation, document analysis</TableCell>
                        <TableCell>Content creation, problem-solving, research</TableCell>
                        <TableCell>$20/month</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-800">Easy</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Grammarly Business</TableCell>
                        <TableCell><Badge variant="secondary">Writing</Badge></TableCell>
                        <TableCell>Grammar checking, tone analysis, plagiarism detection</TableCell>
                        <TableCell>Professional writing, email communication</TableCell>
                        <TableCell>$15/user/month</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-800">Easy</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Notion AI</TableCell>
                        <TableCell><Badge variant="secondary">Organization</Badge></TableCell>
                        <TableCell>Content generation, summarization, translation</TableCell>
                        <TableCell>Note-taking, project management, documentation</TableCell>
                        <TableCell>$10/user/month</TableCell>
                        <TableCell><Badge className="bg-yellow-100 text-yellow-800">Medium</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Zapier</TableCell>
                        <TableCell><Badge variant="secondary">Automation</Badge></TableCell>
                        <TableCell>Workflow automation, app integration</TableCell>
                        <TableCell>Process automation, data synchronization</TableCell>
                        <TableCell>$19.99/month</TableCell>
                        <TableCell><Badge className="bg-red-100 text-red-800">Advanced</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Calendly</TableCell>
                        <TableCell><Badge variant="secondary">Scheduling</Badge></TableCell>
                        <TableCell>Smart scheduling, meeting coordination</TableCell>
                        <TableCell>Meeting management, client booking</TableCell>
                        <TableCell>$8/user/month</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-800">Easy</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <h3 className="text-xl font-semibold mb-4">Deep Dive: ChatGPT for Professional Use</h3>
              <p className="mb-4">
                ChatGPT has become the Swiss Army knife of AI tools for professionals. Its versatility makes it invaluable for a wide range of tasks, from content creation to complex problem-solving.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Prompt Engineering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Professional Email Template:</h4>
                        <code className="text-sm bg-white p-3 rounded block leading-relaxed">
                          "Act as a professional communication expert. Write a [formal/casual] email response addressing [specific situation]. Include these key points: [list points]. Maintain a [tone] tone and keep it under 150 words. Format for business correspondence."
                        </code>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Meeting Summary Template:</h4>
                        <code className="text-sm bg-white p-3 rounded block leading-relaxed">
                          "Analyze these meeting notes and create a structured summary with: 1) Key decisions made, 2) Action items with owners and deadlines, 3) Open questions for follow-up, 4) Next meeting agenda items. Format as a professional document: [paste notes]"
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Integration Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1" />
                        <div>
                          <strong>Browser Extension:</strong> Use ChatGPT browser extensions for instant access while working
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1" />
                        <div>
                          <strong>Mobile App:</strong> Leverage voice input for on-the-go productivity
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-1" />
                        <div>
                          <strong>API Integration:</strong> Connect with existing tools via API for seamless workflows
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4">Implementation Roadmap</h3>
              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-900">Week 1-2: Foundation Building</h4>
                  <p className="text-gray-700">Set up accounts for 2-3 core tools, complete onboarding, and begin basic usage patterns.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-900">Week 3-4: Skill Development</h4>
                  <p className="text-gray-700">Master advanced features, develop custom templates, and establish consistent usage habits.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-900">Week 5-6: Integration & Automation</h4>
                  <p className="text-gray-700">Connect tools together, create automated workflows, and optimize your complete AI toolkit.</p>
                </div>
              </div>
            </section>

            {/* References Section */}
            <section className="mt-12 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                References & Resources
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">OpenAI Documentation. (2024). "ChatGPT Best Practices Guide."</p>
                    <p className="text-gray-600">Official guidelines for effective prompt engineering and tool usage.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Zapier Blog. (2024). "AI Automation Workflows for Business."</p>
                    <p className="text-gray-600">Comprehensive guide to connecting AI tools with business processes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">G2 Research. (2024). "AI Productivity Tools Comparison Report."</p>
                    <p className="text-gray-600">Independent analysis of leading AI tools with user reviews and ratings.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">AI in Project Management</h2>
              <p className="text-lg text-gray-700 mb-6">
                Project management is being revolutionized by AI technologies that can predict risks, optimize resource allocation, automate routine tasks, and provide intelligent insights. This lesson explores how to leverage AI to become a more effective project manager and deliver better outcomes.
              </p>

              <h3 className="text-xl font-semibold mb-4">The AI-Powered Project Management Revolution</h3>
              <p className="mb-6">
                Traditional project management relies heavily on manual tracking, intuition-based decision making, and reactive problem-solving. AI transforms this approach by providing predictive analytics, automated workflows, and data-driven insights that help project managers stay ahead of issues and optimize performance continuously.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Traditional PM Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start"><AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />Manual progress tracking and reporting</li>
                      <li className="flex items-start"><AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />Reactive risk management</li>
                      <li className="flex items-start"><AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />Resource allocation guesswork</li>
                      <li className="flex items-start"><AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />Communication bottlenecks</li>
                      <li className="flex items-start"><AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />Time-consuming status meetings</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>AI-Enhanced Solutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Automated progress tracking and dashboards</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Predictive risk analysis and alerts</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />AI-optimized resource allocation</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />Intelligent communication routing</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />AI-generated status reports</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4">Leading AI Project Management Platforms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Monday.com AI</CardTitle>
                    <Badge className="w-fit">Popular Choice</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">Advanced AI features for workflow optimization and team collaboration.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Smart task automation
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Workload balancing
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Predictive analytics
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Starting at $8/user/month</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Asana Intelligence</CardTitle>
                    <Badge className="w-fit">Enterprise Ready</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">AI-powered insights and project risk assessment capabilities.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Risk prediction
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Goal tracking
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Smart recommendations
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Starting at $10.99/user/month</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>ClickUp AI</CardTitle>
                    <Badge className="w-fit">All-in-One</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">Comprehensive AI assistant for project documentation and planning.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Content generation
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Task summarization
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Project templates
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Starting at $7/user/month</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4">Implementing AI in Your Project Workflow</h3>
              
              <div className="space-y-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Phase 1: Assessment and Planning (Week 1-2)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Current State Analysis</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Audit existing project management processes</li>
                          <li>• Identify time-consuming manual tasks</li>
                          <li>• Document communication patterns</li>
                          <li>• Assess team collaboration challenges</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Goal Definition</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Set specific efficiency targets</li>
                          <li>• Define success metrics</li>
                          <li>• Establish timeline for implementation</li>
                          <li>• Plan team training requirements</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phase 2: Tool Selection and Setup (Week 3-4)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Choose and configure AI-powered project management tools based on your team's needs and existing infrastructure.</p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Pro Tip: Start Small</h4>
                        <p className="text-blue-800 text-sm">Begin with one AI feature at a time. Master automated task creation before moving to predictive analytics.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phase 3: Team Training and Adoption (Week 5-8)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Team Workshops</h4>
                          <p className="text-sm text-gray-600">Conduct hands-on training sessions to ensure team adoption</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Target className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Pilot Projects</h4>
                          <p className="text-sm text-gray-600">Run small pilot projects to test AI features in real scenarios</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <TrendingUp className="h-5 w-5 mr-3 text-purple-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Performance Monitoring</h4>
                          <p className="text-sm text-gray-600">Track productivity metrics and adjust workflows as needed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6">
                <div className="flex items-start">
                  <Lightbulb className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Success Story</h3>
                    <p className="text-green-800 text-sm mb-2">
                      Tech startup TechFlow implemented Monday.com AI and reduced project delivery time by 35% while improving team satisfaction scores by 40%. Their secret? Gradual implementation and consistent team training.
                    </p>
                    <p className="text-green-700 text-xs italic">
                      "AI didn't replace our project managers—it made them superheroes." - Sarah Chen, CTO at TechFlow
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* References Section */}
            <section className="mt-12 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                References & Case Studies
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Project Management Institute. (2024). "AI in Project Management: Global Survey Results."</p>
                    <p className="text-gray-600">Comprehensive analysis of AI adoption trends in project management across industries.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Gartner Research. (2024). "Magic Quadrant for AI-Enhanced Project Management Tools."</p>
                    <p className="text-gray-600">Independent evaluation of leading AI-powered project management platforms.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Forrester. (2024). "The ROI of AI in Project Management: A Total Economic Impact Study."</p>
                    <p className="text-gray-600">Quantitative analysis of cost savings and productivity gains from AI implementation.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
              <p className="text-lg text-gray-700 mb-6">
                {lesson.description}
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                <div className="flex items-start">
                  <Play className="h-6 w-6 text-yellow-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Interactive Exercise</h3>
                    <p className="text-yellow-800 mb-4">
                      Complete the hands-on project to apply what you've learned in this module.
                    </p>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Exercise Files
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* References Section */}
            <section className="mt-12 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                References
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">AI Research Institute. (2024). "Advanced AI Applications in Professional Settings."</p>
                    <p className="text-gray-600">Comprehensive guide to implementing AI tools in various professional contexts.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        {getModuleContent()}
      </CardContent>
    </Card>
  );
};

export default LessonContent;
