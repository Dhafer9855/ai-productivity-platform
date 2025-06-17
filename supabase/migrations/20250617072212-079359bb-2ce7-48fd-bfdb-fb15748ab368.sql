
-- First, let's clear existing content and add our comprehensive course modules
DELETE FROM lessons WHERE module_id IN (1,2,3,4,5,6,7);
DELETE FROM assignments WHERE module_id IN (1,2,3,4,5,6,7);
DELETE FROM test_questions WHERE test_id IN (SELECT id FROM tests WHERE module_id IN (1,2,3,4,5,6,7));
DELETE FROM tests WHERE module_id IN (1,2,3,4,5,6,7);
DELETE FROM modules WHERE id IN (1,2,3,4,5,6,7);

-- Insert comprehensive AI productivity course modules
INSERT INTO modules (id, title, description, "order") VALUES
(1, 'AI Foundations for Productivity', 'Master the fundamentals of AI tools and learn how to integrate them into your daily workflow for maximum efficiency and impact.', 1),
(2, 'ChatGPT Mastery for Professionals', 'Unlock the full potential of ChatGPT with advanced prompting techniques, conversation strategies, and professional use cases.', 2),
(3, 'AI Writing & Content Creation', 'Transform your writing process with AI tools for copywriting, editing, content planning, and multimedia creation.', 3),
(4, 'AI-Powered Research & Analysis', 'Accelerate your research capabilities using AI for data analysis, market research, and information synthesis.', 4),
(5, 'Automation & Workflow Optimization', 'Streamline repetitive tasks and create intelligent workflows using AI automation tools and integrations.', 5),
(6, 'AI Tools for Creative Projects', 'Explore AI-powered design, video creation, presentation tools, and creative problem-solving techniques.', 6),
(7, 'Advanced AI Integration & Future Skills', 'Build comprehensive AI-powered systems and prepare for emerging AI technologies in the workplace.', 7);

-- Insert detailed lessons for each module
INSERT INTO lessons (module_id, title, "order", content_url) VALUES
-- Module 1: AI Foundations
(1, 'Understanding AI in the Modern Workplace', 1, '/content/m1-l1-ai-workplace'),
(1, 'Essential AI Tools Overview', 2, '/content/m1-l2-ai-tools'),
(1, 'Setting Up Your AI Productivity Stack', 3, '/content/m1-l3-setup'),
(1, 'AI Ethics and Best Practices', 4, '/content/m1-l4-ethics'),
(1, 'Measuring AI Productivity Gains', 5, '/content/m1-l5-metrics'),

-- Module 2: ChatGPT Mastery
(2, 'Advanced Prompting Techniques', 1, '/content/m2-l1-prompting'),
(2, 'Role-Based Conversations', 2, '/content/m2-l2-roles'),
(2, 'ChatGPT for Business Communication', 3, '/content/m2-l3-business-comm'),
(2, 'Problem-Solving with AI Assistance', 4, '/content/m2-l4-problem-solving'),
(2, 'Custom GPTs and API Integration', 5, '/content/m2-l5-custom-gpts'),

-- Module 3: AI Writing & Content
(3, 'AI-Powered Copywriting Strategies', 1, '/content/m3-l1-copywriting'),
(3, 'Content Planning with AI', 2, '/content/m3-l2-content-planning'),
(3, 'AI Editing and Proofreading', 3, '/content/m3-l3-editing'),
(3, 'Social Media Content Generation', 4, '/content/m3-l4-social-media'),
(3, 'Email Marketing with AI', 5, '/content/m3-l5-email-marketing'),

-- Module 4: Research & Analysis
(4, 'AI Research Methodologies', 1, '/content/m4-l1-research-methods'),
(4, 'Data Analysis with AI Tools', 2, '/content/m4-l2-data-analysis'),
(4, 'Market Research Automation', 3, '/content/m4-l3-market-research'),
(4, 'Competitive Intelligence Gathering', 4, '/content/m4-l4-competitive-intel'),
(4, 'Report Generation and Insights', 5, '/content/m4-l5-report-generation'),

-- Module 5: Automation & Workflows
(5, 'Workflow Mapping and Optimization', 1, '/content/m5-l1-workflow-mapping'),
(5, 'AI-Powered Task Automation', 2, '/content/m5-l2-task-automation'),
(5, 'Integration Platforms and APIs', 3, '/content/m5-l3-integrations'),
(5, 'Email and Calendar Automation', 4, '/content/m5-l4-email-calendar'),
(5, 'Customer Service Automation', 5, '/content/m5-l5-customer-service'),

-- Module 6: Creative AI Projects
(6, 'AI Design and Visual Creation', 1, '/content/m6-l1-design-visual'),
(6, 'Video Content with AI', 2, '/content/m6-l2-video-content'),
(6, 'Presentation Enhancement', 3, '/content/m6-l3-presentations'),
(6, 'AI for Brainstorming and Innovation', 4, '/content/m6-l4-brainstorming'),
(6, 'Brand Development with AI', 5, '/content/m6-l5-brand-development'),

-- Module 7: Advanced Integration
(7, 'Building AI-Powered Systems', 1, '/content/m7-l1-ai-systems'),
(7, 'Cross-Platform AI Integration', 2, '/content/m7-l2-cross-platform'),
(7, 'AI Analytics and Performance Tracking', 3, '/content/m7-l3-analytics'),
(7, 'Future AI Trends and Preparation', 4, '/content/m7-l4-future-trends'),
(7, 'Building Your AI Productivity Ecosystem', 5, '/content/m7-l5-ecosystem');

-- Insert tests for each module
INSERT INTO tests (module_id, title, description, passing_score) VALUES
(1, 'AI Foundations Assessment', 'Test your understanding of AI fundamentals and productivity applications.', 80),
(2, 'ChatGPT Mastery Quiz', 'Evaluate your advanced ChatGPT skills and prompting techniques.', 80),
(3, 'AI Writing & Content Test', 'Assess your knowledge of AI-powered content creation strategies.', 80),
(4, 'Research & Analysis Evaluation', 'Test your AI research and data analysis capabilities.', 80),
(5, 'Automation & Workflow Quiz', 'Evaluate your understanding of AI automation and workflow optimization.', 80),
(6, 'Creative AI Projects Test', 'Assess your knowledge of AI tools for creative applications.', 80),
(7, 'Advanced Integration Assessment', 'Test your mastery of advanced AI integration and future skills.', 80);

-- Insert test questions (5 questions per test: 2 easy, 3 medium)
-- Module 1 Test Questions
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(1, 'What is the primary benefit of using AI tools for productivity?', 'Completely replacing human workers', 'Automating repetitive tasks and enhancing human capabilities', 'Making all decisions automatically', 'Eliminating the need for training', 'B', 1),
(1, 'Which of the following is considered an AI ethics best practice?', 'Using AI without any oversight', 'Transparency about AI use and limitations', 'Sharing all data with AI systems', 'Avoiding human involvement entirely', 'B', 2),
(1, 'What should you consider when measuring AI productivity gains?', 'Only time saved', 'Time saved, quality improvement, and cost reduction', 'Only cost reduction', 'Only the number of AI tools used', 'B', 3),
(1, 'Which factor is most important when selecting AI tools for your workflow?', 'The most expensive option available', 'Alignment with specific business needs and integration capabilities', 'The newest technology available', 'The most popular tool on social media', 'B', 4),
(1, 'What is a key consideration when implementing AI in a team environment?', 'Keeping AI use secret from team members', 'Training and change management for team adoption', 'Using different AI tools for each team member', 'Avoiding any documentation of AI processes', 'B', 5);

-- Module 2 Test Questions  
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(2, 'What is the key to effective AI prompting?', 'Using as few words as possible', 'Being specific, clear, and providing context', 'Using technical jargon', 'Writing very long prompts', 'B', 1),
(2, 'When using role-based prompting, what should you include?', 'Only the role name', 'Role definition, expertise level, and specific task context', 'Generic instructions', 'Multiple conflicting roles', 'B', 2),
(2, 'How can you improve ChatGPT responses for business communication?', 'Ask for shorter responses only', 'Provide specific tone, audience, and purpose guidelines', 'Use informal language always', 'Avoid giving any context', 'B', 3),
(2, 'What is an effective strategy for complex problem-solving with AI?', 'Ask one broad question and accept the first answer', 'Break down the problem into steps and iterate through solutions', 'Only use AI for simple problems', 'Avoid providing background information', 'B', 4),
(2, 'When would you use a custom GPT instead of regular ChatGPT?', 'For any conversation', 'For specialized, repeated tasks with specific requirements', 'Only for personal use', 'When you want faster responses', 'B', 5);

-- Module 3 Test Questions
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(3, 'What is the first step in AI-powered copywriting?', 'Start writing immediately', 'Define your target audience and objectives', 'Choose the longest possible format', 'Copy from competitors', 'B', 1),
(3, 'Which element is crucial for effective AI content planning?', 'Random topic selection', 'Clear content strategy and audience analysis', 'Only trending topics', 'Copying existing content', 'B', 2),
(3, 'How should you use AI for editing and proofreading?', 'Accept all AI suggestions without review', 'Use AI as a first pass, then apply human judgment', 'Only use AI for grammar checking', 'Replace all human editing with AI', 'B', 3),
(3, 'What makes AI-generated social media content effective?', 'Using the same content across all platforms', 'Platform-specific optimization and authentic voice', 'Only using AI-generated images', 'Posting the same content repeatedly', 'B', 4),
(3, 'How can AI improve email marketing campaigns?', 'By sending more emails', 'Through personalization, timing optimization, and A/B testing', 'By making emails longer', 'By using the same template for everyone', 'B', 5);

-- Module 4 Test Questions
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(4, 'What is a key advantage of AI in research methodology?', 'Eliminating the need for human analysis', 'Processing large amounts of data quickly and identifying patterns', 'Making research unnecessary', 'Guaranteeing 100% accurate results', 'B', 1),
(4, 'When using AI for data analysis, what should you always do?', 'Trust AI results completely', 'Validate AI findings and understand limitations', 'Use only AI tools for analysis', 'Ignore traditional analysis methods', 'B', 2),
(4, 'How can AI enhance market research effectiveness?', 'By replacing all human researchers', 'By automating data collection and identifying trends across multiple sources', 'By eliminating the need for surveys', 'By providing only quantitative data', 'B', 3),
(4, 'What is the best approach to competitive intelligence with AI?', 'Focus only on direct competitors', 'Systematically monitor multiple data sources and analyze patterns', 'Rely on single data sources', 'Only analyze historical data', 'B', 4),
(4, 'How should AI-generated reports be structured for maximum impact?', 'Include all possible data points', 'Focus on key insights with clear visualizations and actionable recommendations', 'Use only text without visuals', 'Make them as long as possible', 'B', 5);

-- Module 5 Test Questions
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(5, 'What is the first step in workflow optimization?', 'Implementing AI tools immediately', 'Mapping and analyzing current processes', 'Buying automation software', 'Eliminating all manual tasks', 'B', 1),
(5, 'Which tasks are best suited for AI automation?', 'Creative decision making', 'Repetitive, rule-based tasks with clear inputs and outputs', 'Strategic planning', 'Emotional intelligence tasks', 'B', 2),
(5, 'What is crucial when integrating multiple AI platforms?', 'Using as many platforms as possible', 'Ensuring data compatibility and workflow continuity', 'Keeping all platforms separate', 'Only using free tools', 'B', 3),
(5, 'How can AI improve email and calendar management?', 'By reading all emails automatically', 'Through smart scheduling, priority detection, and automated responses', 'By deleting all emails', 'By scheduling meetings randomly', 'B', 4),
(5, 'What is a key benefit of AI-powered customer service automation?', 'Eliminating all human customer service', '24/7 availability with consistent, accurate responses for common issues', 'Reducing customer interactions', 'Making all responses identical', 'B', 5);

-- Module 6 Test Questions
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(6, 'What is important when using AI for design creation?', 'Accepting the first AI-generated design', 'Providing clear briefs and iterating based on feedback', 'Using only default settings', 'Avoiding any customization', 'B', 1),
(6, 'How can AI enhance video content creation?', 'By completely automating all video production', 'Through script writing, editing assistance, and automated subtitles', 'By eliminating the need for human creativity', 'By making all videos look identical', 'B', 2),
(6, 'What makes AI-enhanced presentations more effective?', 'Using as many AI features as possible', 'Strategic use of AI for content structure, visuals, and audience engagement', 'Making presentations longer', 'Using only AI-generated content', 'B', 3),
(6, 'How should AI be used in brainstorming sessions?', 'To replace human creativity entirely', 'As a catalyst for ideas and to explore different perspectives', 'Only for organizing notes', 'To make final decisions', 'B', 4),
(6, 'What role can AI play in brand development?', 'Creating the entire brand without human input', 'Supporting research, generating options, and testing concepts', 'Only designing logos', 'Replacing brand strategists', 'B', 5);

-- Module 7 Test Questions
INSERT INTO test_questions (test_id, question, option_a, option_b, option_c, option_d, correct_answer, order_number) VALUES
(7, 'What is essential when building AI-powered systems?', 'Using the most complex AI available', 'Clear architecture planning and user experience design', 'Implementing every available AI feature', 'Avoiding any human oversight', 'B', 1),
(7, 'How should you approach cross-platform AI integration?', 'Use different AI tools that don''t communicate', 'Create unified workflows with consistent data flow', 'Keep all platforms completely separate', 'Only use single-platform solutions', 'B', 2),
(7, 'What is crucial for AI analytics and performance tracking?', 'Tracking only AI accuracy metrics', 'Measuring business impact, user satisfaction, and ROI', 'Focusing only on technical performance', 'Avoiding measurement altogether', 'B', 3),
(7, 'How should professionals prepare for future AI developments?', 'Learn one AI tool and stick with it', 'Develop adaptable skills and stay informed about emerging trends', 'Avoid learning new AI tools', 'Focus only on current technology', 'B', 4),
(7, 'What characterizes a successful AI productivity ecosystem?', 'Using every available AI tool', 'Integrated tools that work together seamlessly to support specific goals', 'Having the most expensive AI tools', 'Constantly switching between different AI platforms', 'B', 5);

-- Insert practical assignments for module 7 (project-based learning)
INSERT INTO assignments (module_id, title, description, max_score, due_date) VALUES
(7, 'Build Your Personal AI Productivity System', 'Create a comprehensive AI-powered productivity system that integrates at least 3 different AI tools to solve a real workflow challenge in your professional life. Document your process, tools used, integration methods, and measure the productivity gains achieved.', 100, '2024-12-31 23:59:59');
