
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Play, Download, ExternalLink, Lightbulb, Target, CheckCircle, TrendingUp, Clock, Users } from "lucide-react";

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
  // Modern productivity transformation data
  const productivityJourney = [
    { week: "Week 1", traditional: 100, withAI: 105, tasks: 12 },
    { week: "Week 2", traditional: 100, withAI: 125, tasks: 15 },
    { week: "Week 3", traditional: 100, withAI: 150, tasks: 18 },
    { week: "Week 4", traditional: 100, withAI: 180, tasks: 22 },
    { week: "Week 5", traditional: 100, withAI: 220, tasks: 26 },
    { week: "Week 6", traditional: 100, withAI: 250, tasks: 30 },
    { week: "Week 7", traditional: 100, withAI: 280, tasks: 34 },
    { week: "Week 8", traditional: 100, withAI: 320, tasks: 38 },
  ];

  // AI impact by task category
  const aiImpactData = [
    { category: "Email Management", impact: 85, color: "#3b82f6" },
    { category: "Content Creation", impact: 75, color: "#8b5cf6" },
    { category: "Data Analysis", impact: 90, color: "#06b6d4" },
    { category: "Scheduling", impact: 80, color: "#10b981" },
    { category: "Research", impact: 70, color: "#f59e0b" },
  ];

  // Sample data for charts
  const productivityData = [
    { task: "Email Management", before: 2.5, after: 0.5 },
    { task: "Document Creation", before: 3.0, after: 1.0 },
    { task: "Data Analysis", before: 4.0, after: 1.5 },
    { task: "Meeting Prep", before: 1.5, after: 0.3 },
    { task: "Research", before: 3.5, after: 1.2 },
  ];

  const aiToolsData = [
    { name: "ChatGPT", usage: 85, category: "Text Generation" },
    { name: "Grammarly", usage: 92, category: "Writing" },
    { name: "Calendly", usage: 78, category: "Scheduling" },
    { name: "Notion AI", usage: 67, category: "Organization" },
    { name: "Zapier", usage: 73, category: "Automation" },
  ];

  const efficiencyTrends = [
    { month: "Jan", efficiency: 65 },
    { month: "Feb", efficiency: 72 },
    { month: "Mar", efficiency: 78 },
    { month: "Apr", efficiency: 85 },
    { month: "May", efficiency: 91 },
    { month: "Jun", efficiency: 95 },
  ];

  const pieData = [
    { name: "Automated Tasks", value: 60, color: "#3b82f6" },
    { name: "AI-Assisted Tasks", value: 25, color: "#8b5cf6" },
    { name: "Manual Tasks", value: 15, color: "#ef4444" },
  ];

  const getModuleContent = () => {
    switch (lesson.modules.id) {
      case 1:
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Understanding AI & Productivity</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  Artificial Intelligence is transforming how we work. In this lesson, you'll discover how AI can become your most powerful productivity tool.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                  <div className="flex items-start">
                    <Lightbulb className="h-6 w-6 text-blue-500 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Key Insight</h3>
                      <p className="text-blue-800">
                        AI doesn't replace human creativity—it amplifies it. The most successful professionals use AI to handle routine tasks so they can focus on strategic thinking and innovation.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">The AI Productivity Transformation Journey</h3>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Productivity Growth: Traditional vs AI-Enhanced
                    </CardTitle>
                    <p className="text-sm text-gray-600">Track how AI adoption transforms your work output over time</p>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{ 
                      traditional: { label: "Traditional Methods", color: "#ef4444" }, 
                      withAI: { label: "With AI Tools", color: "#22c55e" } 
                    }}>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={productivityJourney}>
                          <defs>
                            <linearGradient id="traditionalGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="week" stroke="#666" />
                          <YAxis stroke="#666" />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            labelFormatter={(value) => `${value}`}
                            formatter={(value, name) => [
                              `${value}% efficiency`,
                              name === 'traditional' ? 'Traditional Methods' : 'AI-Enhanced'
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="traditional"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="url(#traditionalGradient)"
                            name="traditional"
                          />
                          <Area
                            type="monotone"
                            dataKey="withAI"
                            stroke="#22c55e"
                            strokeWidth={3}
                            fill="url(#aiGradient)"
                            name="withAI"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Modern stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Time Saved Weekly</p>
                          <p className="text-2xl font-bold text-blue-900">15+ hrs</p>
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
                          <p className="text-2xl font-bold text-green-900">220%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Tasks Automated</p>
                          <p className="text-2xl font-bold text-purple-900">38</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-xl font-semibold mb-4">AI Categories for Productivity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-500" />
                        Task Automation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Email sorting and responses</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Calendar scheduling</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Data entry and processing</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-purple-500" />
                        Content Creation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Writing assistance</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Document summarization</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Presentation design</li>
                      </ul>
                    </CardContent>
                  </Card>
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
                Master the most impactful AI tools that can transform your daily workflow. These tools are already being used by millions of professionals worldwide.
              </p>

              <h3 className="text-xl font-semibold mb-4">Popular AI Tools Usage Statistics</h3>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>AI Tool Adoption & Effectiveness Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Effectiveness</TableHead>
                        <TableHead>Best For</TableHead>
                        <TableHead>Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiToolsData.map((tool) => (
                        <TableRow key={tool.name}>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{tool.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${tool.usage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{tool.usage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {tool.name === "ChatGPT" && "Content creation, problem solving"}
                            {tool.name === "Grammarly" && "Writing improvement, editing"}
                            {tool.name === "Calendly" && "Meeting scheduling, automation"}
                            {tool.name === "Notion AI" && "Note-taking, documentation"}
                            {tool.name === "Zapier" && "Workflow automation"}
                          </TableCell>
                          <TableCell>
                            {tool.name === "ChatGPT" && "$20/mo"}
                            {tool.name === "Grammarly" && "$12/mo"}
                            {tool.name === "Calendly" && "$8/mo"}
                            {tool.name === "Notion AI" && "$10/mo"}
                            {tool.name === "Zapier" && "$20/mo"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <h3 className="text-xl font-semibold mb-4">Practical Exercise</h3>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>ChatGPT Prompt Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Email Response Template:</h4>
                      <code className="text-sm bg-white p-2 rounded block">
                        "Write a professional email response to [situation]. Keep it concise, friendly, and include [specific points]. Tone should be [formal/casual]."
                      </code>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Meeting Summary Template:</h4>
                      <code className="text-sm bg-white p-2 rounded block">
                        "Summarize these meeting notes into key decisions, action items, and next steps: [paste notes]"
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">AI in Project Management</h2>
              <p className="text-lg text-gray-700 mb-6">
                Discover how AI can revolutionize your project management approach, from task prioritization to team collaboration.
              </p>

              <h3 className="text-xl font-semibold mb-4">Efficiency Improvement Over Time</h3>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Project Management Efficiency Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ efficiency: { label: "Efficiency %", color: "#8b5cf6" } }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={efficiencyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <h3 className="text-xl font-semibold mb-4">AI Project Management Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monday.com AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">Smart task automation and workload balancing</p>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Try Demo
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Asana Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">Predictive project insights and risk assessment</p>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Try Demo
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>ClickUp AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">AI writing assistant for project documentation</p>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Try Demo
                    </Button>
                  </CardContent>
                </Card>
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

              <h3 className="text-xl font-semibold mb-4">Task Distribution Analysis</h3>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>How You Spend Your Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <ChartContainer config={{ automated: { label: "Automated", color: "#3b82f6" } }}>
                      <ResponsiveContainer width={400} height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

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
