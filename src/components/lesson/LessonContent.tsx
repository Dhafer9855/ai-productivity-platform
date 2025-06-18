import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Users, TrendingUp, Lightbulb, Target, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface LessonContentProps {
  lesson: {
    id: number;
    order: number;
    title: string;
    description: string;
  };
}

const LessonContent = ({ lesson }: LessonContentProps) => {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const getLessonContent = (lessonOrder: number) => {
    const lessonContent = {
      1: {
        overview: "Welcome to the future of workplace productivity. This lesson introduces you to the transformative power of AI in professional environments and provides a roadmap for becoming an AI-powered professional.",
        keyTopics: [
          "Understanding AI's role in modern workplace productivity",
          "Identifying high-impact AI implementation opportunities", 
          "Common misconceptions and realistic expectations about AI tools",
          "Building an AI-first mindset for continuous improvement"
        ],
        content: [
          {
            type: "concept",
            title: "The AI Productivity Revolution",
            content: `The workplace is undergoing its most significant transformation since the introduction of personal computers. Artificial Intelligence isn't just changing how we work—it's redefining what work means entirely.

**Why AI Matters Now More Than Ever:**

The global productivity crisis is real. Studies show that knowledge workers spend only 39% of their time on role-specific tasks, with the remainder lost to coordination, searching for information, and administrative overhead. AI offers the first genuine solution to this productivity drain in decades.

**The Compound Effect of AI Adoption:**

When implemented strategically, AI tools don't just save time—they create a compound effect. A 30-minute daily time savings from AI tools translates to 125+ hours annually, equivalent to three additional work weeks. But the real power lies in the cognitive load reduction and enhanced decision-making capabilities.

**Research Insights:**

- MIT study: Companies using AI tools saw 12-14% productivity improvements within 90 days
- McKinsey Global Institute: AI could boost global productivity by up to 40% by 2030
- Harvard Business Review: 67% of executives report AI gives their company a competitive advantage

**The Human-AI Collaboration Model:**

The future isn't about AI replacing humans—it's about augmenting human capabilities. The most successful professionals will be those who master human-AI collaboration, using AI to handle routine tasks while focusing their creativity and strategic thinking on high-value activities.`
          },
          {
            type: "framework",
            title: "The AI Implementation Hierarchy",
            content: `Not all AI implementations are created equal. Understanding where to start is crucial for maximizing impact and building sustainable AI habits.

**Level 1: Task Automation (Weeks 1-2)**
- Email composition and response optimization
- Calendar scheduling and management  
- Document summarization and review
- Basic data entry and formatting
- *Impact: 15-30 minutes daily time savings*

**Level 2: Process Enhancement (Weeks 3-6)**
- Project planning and breakdown
- Research and information synthesis
- Content creation workflows
- Communication optimization
- *Impact: 1-2 hours daily time savings*

**Level 3: Strategic Integration (Months 2-3)**
- Decision support systems
- Predictive analytics for planning
- Advanced workflow automation
- Cross-platform AI orchestration
- *Impact: 2+ hours daily time savings + enhanced decision quality*

**Level 4: Innovation Acceleration (Months 3+)**
- AI-powered ideation and brainstorming
- Competitive intelligence automation
- Custom AI solution development
- Organization-wide AI strategy implementation
- *Impact: Transformational productivity gains + competitive advantages*

**Implementation Strategy:**
Start with Level 1 tools that require minimal learning curve and provide immediate visible benefits. Success at each level builds confidence and skills needed for the next level.`
          },
          {
            type: "tools",
            title: "Essential AI Tools Ecosystem",
            content: `Building your AI toolkit requires understanding the landscape of available tools and their optimal use cases.

**Communication & Writing AI:**
- **ChatGPT Plus** ($20/month): Advanced reasoning, coding, analysis
- **Grammarly Premium** ($12/month): Writing enhancement, tone adjustment
- **Jasper AI** ($49/month): Marketing content creation, brand voice consistency
- **Copy.ai** ($36/month): Sales copy, social media, ad creation

**Productivity & Organization:**
- **Notion AI** ($10/month): Note-taking, database management, content generation
- **Todoist with AI Assistant** ($4/month): Intelligent task management and scheduling
- **Calendly** (Free-$12/month): Smart scheduling with AI-powered optimization
- **Zapier** ($20-50/month): Workflow automation across 5000+ apps

**Research & Analysis:**
- **Perplexity Pro** ($20/month): Real-time research with citations
- **Claude Pro** ($20/month): Document analysis, complex reasoning
- **Elicit** ($12/month): Research paper analysis and synthesis
- **DataRobot** (Enterprise): Advanced predictive analytics

**Creative & Design:**
- **Canva Pro** ($15/month): AI-powered design and content creation
- **Adobe Creative Cloud** ($53/month): AI-enhanced photo/video editing
- **Runway ML** ($12/month): AI video generation and editing
- **DALL-E 3** (via ChatGPT Plus): High-quality image generation

**ROI Calculation Framework:**
For each tool, calculate: (Time Saved × Hourly Rate - Tool Cost) × Usage Frequency = Net Monthly Value

Example: If Grammarly saves 15 minutes daily for someone earning $50/hour:
(0.25 hours × $50 × 22 workdays - $12) = $263 monthly value`
          },
          {
            type: "practical",
            title: "Practical Exercise: Your Personal AI Productivity Audit",
            content: `This hands-on exercise will help you identify your highest-impact AI implementation opportunities through systematic analysis of your current work patterns.

**Exercise Overview:**
Complete a comprehensive audit of your work activities to identify where AI can have the greatest impact on your productivity and job satisfaction.

**What You'll Discover:**
- Your top 3 time-consuming, repetitive tasks perfect for AI automation
- Specific AI tools matched to your work patterns
- A personalized 30-day AI implementation roadmap
- Baseline metrics to measure your AI productivity gains

**Time Investment:** 45-60 minutes for the audit + 15 minutes daily for 3 days of activity tracking

**Materials Needed:**
- Time tracking tool (Toggl, RescueTime, or simple spreadsheet)
- Access to your calendar and email for the past week
- Notebook or digital document for reflections

**Why This Exercise Is Essential:**
Many professionals jump into AI tools randomly without understanding their specific needs. This audit ensures you invest time learning tools that will actually transform your workflow, not just add complexity.`
          }
        ],
        practiceTitle: "Your Personal AI Productivity Audit",
        practiceDescription: "Complete this exercise to identify your top 3 AI implementation opportunities and create your personalized implementation roadmap."
      },
      2: {
        overview: "Master the essential AI tools that every professional needs: ChatGPT for complex reasoning, Grammarly for communication excellence, email assistants for inbox management, and scheduling AI for time optimization.",
        keyTopics: [
          "Advanced ChatGPT prompting techniques and use cases",
          "Grammarly optimization for professional communication",
          "Email automation and AI-powered response systems", 
          "Smart scheduling tools and calendar optimization"
        ],
        content: [
          {
            type: "tools",
            title: "ChatGPT Mastery for Professionals",
            content: `ChatGPT isn't just a chatbot—it's your AI thinking partner. Mastering it requires understanding prompt engineering, conversation management, and integration into daily workflows.

**Advanced Prompting Techniques:**

1. **Role-Based Prompting:**
   "Act as a senior marketing strategist with 10 years of B2B experience. Analyze this campaign data and provide 3 improvement recommendations with expected impact percentages."

2. **Context-Rich Prompting:**
   "I'm preparing for a board presentation about Q3 results. Our revenue is up 15% but margins decreased 3%. Audience includes tech-skeptical board members. Help me create talking points that address margin concerns while highlighting growth achievements."

3. **Structured Output Prompting:**
   "Create a project timeline for launching a mobile app. Format as: Phase | Duration | Key Deliverables | Dependencies | Risk Level (1-5). Include 5 phases from concept to launch."

**Professional Use Cases:**

**Meeting Preparation:**
- Generate agenda items based on project status
- Create discussion questions for different scenarios
- Prepare counter-arguments for anticipated objections
- Develop presentation outlines with supporting data points

**Email and Communication:**
- Draft responses maintaining specific tone and style
- Create email templates for recurring situations
- Generate follow-up sequences for different contexts
- Adapt messages for different audience levels

**Analysis and Research:**
- Synthesize complex documents into executive summaries
- Compare competing solutions with pros/cons analysis
- Generate research questions for market analysis
- Create SWOT analyses for strategic decisions

**Productivity Optimization:**
- Break complex projects into manageable tasks
- Generate checklists for recurring processes
- Create decision trees for common scenarios
- Develop troubleshooting guides for team use`
          },
          {
            type: "tools", 
            title: "Grammarly: Beyond Grammar Checking",
            content: `Grammarly has evolved into a comprehensive writing intelligence platform. Understanding its advanced features can transform your professional communication effectiveness.

**Advanced Configuration for Professionals:**

**Tone Detection and Adjustment:**
- Configure different tone profiles for various communication contexts
- Internal team communication: Casual, friendly, concise
- Client communication: Professional, confident, respectful
- Executive communication: Formal, strategic, diplomatic
- Crisis communication: Empathetic, clear, solution-focused

**Goal-Based Writing Optimization:**
Set specific goals for different document types:
- Proposals: Persuasive, professional, confident tone
- Reports: Informative, clear, analytical tone
- Marketing copy: Engaging, enthusiastic, persuasive tone
- Internal memos: Clear, direct, actionable tone

**Advanced Features for Productivity:**

**Brand Voice Consistency:**
- Develop custom style guides for your organization
- Maintain consistent terminology and messaging
- Ensure compliance with industry-specific language requirements
- Create templates for common document types

**Collaboration and Review:**
- Use Grammarly Business for team consistency
- Set up approval workflows for external communications
- Track writing analytics to identify improvement areas
- Generate performance reports for professional development

**Integration Strategies:**
- Browser extension for all web-based writing
- Desktop app for document creation and editing
- Mobile app for on-the-go communication
- API integration for custom applications

**ROI Measurement:**
Track the impact of Grammarly usage:
- Reduction in email back-and-forth due to clarity issues
- Decrease in time spent editing and proofreading
- Improvement in client communication satisfaction scores
- Increase in proposal acceptance rates due to professional presentation`
          },
          {
            type: "practical",
            title: "Practical Exercise: Daily AI Assistant Integration Challenge",
            content: `This week-long challenge will help you integrate ChatGPT, Grammarly, and scheduling AI into your daily workflow, creating sustainable habits that boost productivity.

**Challenge Overview:**
For one week, commit to using ChatGPT, Grammarly, and a scheduling AI tool for specific daily tasks, tracking your time savings and effectiveness improvements.

**What You'll Achieve:**
- Develop muscle memory for AI tool usage
- Create personalized prompts and templates
- Establish sustainable AI-powered workflows
- Measure concrete productivity improvements

**Daily Commitment:** 15-20 minutes of focused AI tool usage + tracking

**Success Metrics:**
- Time saved on routine tasks
- Quality improvement in communications
- Reduction in scheduling friction
- Increase in daily task completion rate

**Why This Challenge Works:**
Research shows it takes 21-66 days to form a habit. This intensive week jumpstarts the habit formation process while providing immediate benefits that motivate continued use.`
          }
        ],
        practiceTitle: "Daily AI Assistant Integration Challenge", 
        practiceDescription: "Implement ChatGPT, email automation, and smart scheduling in your daily workflow with a structured week-long challenge."
      },
      3: {
        overview: "Transform your project management approach with AI-powered tools that predict bottlenecks, optimize resource allocation, and enable seamless real-time collaboration.",
        keyTopics: [
          "AI-enhanced project planning and task management",
          "Smart resource allocation and timeline optimization",
          "Real-time collaboration tools with AI insights",
          "Predictive project analytics and risk management"
        ],
        content: [
          {
            type: "framework",
            title: "AI-Powered Project Management Revolution",
            content: `Traditional project management relies on historical data and human intuition. AI-powered project management uses predictive analytics, real-time optimization, and intelligent automation to dramatically improve project success rates.

**The AI Project Management Stack:**

**Planning Intelligence:**
- Predictive timeline estimation based on similar projects
- Automatic task dependency mapping
- Resource conflict detection and resolution
- Risk probability assessment and mitigation planning

**Execution Optimization:**
- Real-time workload balancing across team members
- Automatic priority adjustment based on changing requirements
- Intelligent milestone tracking with early warning systems
- Dynamic resource reallocation based on project progress

**Collaboration Enhancement:**
- AI-powered meeting summaries and action item extraction
- Automatic progress updates from team activities
- Intelligent notification filtering to reduce information overload
- Context-aware task recommendations for team members

**Performance Analytics:**
- Predictive project health scoring
- Team productivity pattern analysis
- Budget variance prediction and optimization
- Success factor identification for future projects`
          },
          {
            type: "practical",
            title: "Practical Exercise: Smart Project Management Setup",
            content: `Set up an AI-powered project management system for a real project, implementing intelligent workflows that adapt and optimize automatically.

**Exercise Overview:**
Choose a current project and implement AI-enhanced project management tools, comparing traditional vs. AI-powered approaches.

**What You'll Build:**
- Intelligent project dashboard with predictive analytics
- Automated reporting and status update systems  
- AI-optimized resource allocation workflows
- Risk prediction and mitigation automation

**Expected Outcome:**
A fully functional AI-powered project management system that reduces manual overhead by 40-60% while improving project visibility and success probability.`
          }
        ],
        practiceTitle: "Smart Project Management Setup",
        practiceDescription: "Implement AI-powered project management tools and workflows for enhanced collaboration and predictive insights."
      }
    };

    return lessonContent[lessonOrder] || lessonContent[1];
  };

  const content = getLessonContent(lesson.order);

  const handleStartPractice = () => {
    navigate(`/practice/${moduleId}/${lesson.id}`);
  };

  const formatContent = (text: string) => {
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      // Handle bold headers
      if (section.startsWith('**') && section.endsWith('**') && !section.includes(':')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-4">
            {section.replace(/\*\*/g, '')}
          </h3>
        );
      }
      
      // Handle subheaders with colons
      if (section.startsWith('**') && section.includes(':**')) {
        const [title, ...content] = section.split(':**');
        return (
          <div key={index} className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {title.replace(/\*\*/g, '')}:
            </h4>
            {content.length > 0 && (
              <div className="text-gray-700 leading-relaxed">
                {content.join(':**')}
              </div>
            )}
          </div>
        );
      }

      // Handle bullet point lists
      if (section.includes('- **')) {
        const items = section.split('\n').filter(item => item.trim().startsWith('- **'));
        return (
          <div key={index} className="mb-6">
            <div className="space-y-4">
              {items.map((item, itemIndex) => {
                const cleanItem = item.replace(/^- \*\*/, '').replace(/\*\*:/, ':');
                const [title, ...description] = cleanItem.split(': ');
                return (
                  <div key={itemIndex} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">{title}</h5>
                    {description.length > 0 && (
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {description.join(': ')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // Handle regular bullet points
      if (section.includes('\n- ')) {
        const lines = section.split('\n');
        const beforeList = lines.filter(line => !line.trim().startsWith('- '));
        const listItems = lines.filter(line => line.trim().startsWith('- '));
        
        return (
          <div key={index} className="mb-6">
            {beforeList.length > 0 && (
              <div className="mb-3">
                {beforeList.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-gray-700 leading-relaxed mb-2">
                    {line}
                  </p>
                ))}
              </div>
            )}
            <ul className="space-y-2 ml-4">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    {item.replace(/^- /, '')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Handle regular paragraphs
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Lesson Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="h-5 w-5 mr-2 text-blue-600" />
            Lesson Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{content.overview}</p>
        </CardContent>
      </Card>

      {/* Key Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Key Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {content.keyTopics.map((topic, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-gray-700 leading-relaxed">{topic}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Main Content */}
      {content.content.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center">
                {section.type === 'concept' && <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />}
                {section.type === 'framework' && <TrendingUp className="h-5 w-5 mr-2 text-green-600" />}
                {section.type === 'tools' && <Users className="h-5 w-5 mr-2 text-blue-600" />}
                {section.type === 'practical' && <Target className="h-5 w-5 mr-2 text-purple-600" />}
                {section.title}
              </CardTitle>
              <Badge variant="secondary" className="capitalize">
                {section.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              {formatContent(section.content)}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Practical Exercise Preview */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Target className="h-5 w-5 mr-2" />
            Practical Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-purple-900 mb-2">
                {content.practiceTitle}
              </h3>
              <p className="text-purple-700 mb-4">
                {content.practiceDescription}
              </p>
            </div>
            
            <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Exercise Instructions:</h4>
              <p className="text-purple-700 text-sm mb-4">
                This hands-on exercise includes step-by-step guidance, downloadable templates, 
                and detailed implementation instructions to help you apply what you've learned.
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleStartPractice}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
              >
                Start Practical Exercise
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonContent;
