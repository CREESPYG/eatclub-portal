// Training Data - Complete course content
export const trainingCategories = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    icon: 'rocket_launch',
    color: '#F4A261',
    courses: [
      {
        id: 'onb-1',
        title: 'Company Culture & Values',
        description: 'Learn about our company mission, vision, and core values that drive everything we do.',
        duration: '2 hours',
        lessons: 5,
        thumbnail: '🏢',
        lessonsList: [
          { id: 'onb-1-1', title: 'Our Mission & Vision', type: 'video', duration: '25 min' },
          { id: 'onb-1-2', title: 'Core Values Deep Dive', type: 'text', duration: '20 min' },
          { id: 'onb-1-3', title: 'Company History', type: 'video', duration: '30 min' },
          { id: 'onb-1-4', title: 'What We Expect', type: 'text', duration: '15 min' },
          { id: 'onb-1-5', title: 'Culture Quiz', type: 'quiz', duration: '10 min' }
        ]
      },
      {
        id: 'onb-2',
        title: 'Workspace Essentials',
        description: 'Everything you need to know about your physical and digital workspace.',
        duration: '1.5 hours',
        lessons: 4,
        thumbnail: '🏠',
        lessonsList: [
          { id: 'onb-2-1', title: 'Office Tour', type: 'video', duration: '20 min' },
          { id: 'onb-2-2', title: 'Digital Tools Setup', type: 'text', duration: '30 min' },
          { id: 'onb-2-3', title: 'Security & Access', type: 'video', duration: '25 min' },
          { id: 'onb-2-4', title: 'Workspace Quiz', type: 'quiz', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical Skills',
    icon: 'code',
    color: '#2A9D8F',
    courses: [
      {
        id: 'tech-1',
        title: 'Product Knowledge',
        description: 'Master our product suite and understand how to explain it to customers.',
        duration: '4 hours',
        lessons: 6,
        thumbnail: '📦',
        lessonsList: [
          { id: 'tech-1-1', title: 'Product Overview', type: 'video', duration: '40 min' },
          { id: 'tech-1-2', title: 'Key Features Deep Dive', type: 'text', duration: '45 min' },
          { id: 'tech-1-3', title: 'Competitive Analysis', type: 'video', duration: '35 min' },
          { id: 'tech-1-4', title: 'Pricing Structure', type: 'text', duration: '30 min' },
          { id: 'tech-1-5', title: 'Customer Scenarios', type: 'video', duration: '40 min' },
          { id: 'tech-1-6', title: 'Product Certification', type: 'quiz', duration: '30 min' }
        ]
      },
      {
        id: 'tech-2',
        title: 'Sales Tools & CRM',
        description: 'Learn to use our CRM and sales tools effectively to close more deals.',
        duration: '3 hours',
        lessons: 5,
        thumbnail: '📊',
        lessonsList: [
          { id: 'tech-2-1', title: 'CRM Introduction', type: 'video', duration: '30 min' },
          { id: 'tech-2-2', title: 'Pipeline Management', type: 'text', duration: '35 min' },
          { id: 'tech-2-3', title: 'Lead Tracking', type: 'video', duration: '40 min' },
          { id: 'tech-2-4', title: 'Reporting & Analytics', type: 'text', duration: '45 min' },
          { id: 'tech-2-5', title: 'Sales Tools Quiz', type: 'quiz', duration: '30 min' }
        ]
      }
    ]
  },
  {
    id: 'soft',
    name: 'Soft Skills',
    icon: 'psychology',
    color: '#E76F51',
    courses: [
      {
        id: 'soft-1',
        title: 'Communication Excellence',
        description: 'Master the art of effective communication in professional settings.',
        duration: '3 hours',
        lessons: 5,
        thumbnail: '💬',
        lessonsList: [
          { id: 'soft-1-1', title: 'Active Listening', type: 'video', duration: '35 min' },
          { id: 'soft-1-2', title: 'Clear & Concise Writing', type: 'text', duration: '40 min' },
          { id: 'soft-1-3', title: 'Presentation Skills', type: 'video', duration: '45 min' },
          { id: 'soft-1-4', title: 'Handling Difficult Conversations', type: 'video', duration: '40 min' },
          { id: 'soft-1-5', title: 'Communication Assessment', type: 'quiz', duration: '20 min' }
        ]
      },
      {
        id: 'soft-2',
        title: 'Time Management',
        description: 'Learn proven techniques to manage your time effectively and boost productivity.',
        duration: '2.5 hours',
        lessons: 4,
        thumbnail: '⏰',
        lessonsList: [
          { id: 'soft-2-1', title: 'Prioritization Frameworks', type: 'video', duration: '40 min' },
          { id: 'soft-2-2', title: 'Managing Deadlines', type: 'text', duration: '35 min' },
          { id: 'soft-2-3', title: 'Avoiding Distractions', type: 'video', duration: '30 min' },
          { id: 'soft-2-4', title: 'Time Management Quiz', type: 'quiz', duration: '25 min' }
        ]
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance',
    icon: 'gavel',
    color: '#264653',
    courses: [
      {
        id: 'comp-1',
        title: 'Data Privacy & Security',
        description: 'Understand data protection regulations and best practices for handling sensitive information.',
        duration: '2 hours',
        lessons: 4,
        thumbnail: '🔒',
        lessonsList: [
          { id: 'comp-1-1', title: 'GDPR Basics', type: 'video', duration: '30 min' },
          { id: 'comp-1-2', title: 'Data Handling Procedures', type: 'text', duration: '35 min' },
          { id: 'comp-1-3', title: 'Security Best Practices', type: 'video', duration: '35 min' },
          { id: 'comp-1-4', title: 'Security Certification', type: 'quiz', duration: '20 min' }
        ]
      },
      {
        id: 'comp-2',
        title: 'Workplace Ethics',
        description: 'Learn about ethical standards and professional conduct in the workplace.',
        duration: '1.5 hours',
        lessons: 3,
        thumbnail: '⚖️',
        lessonsList: [
          { id: 'comp-2-1', title: 'Code of Conduct', type: 'text', duration: '25 min' },
          { id: 'comp-2-2', title: 'Conflict of Interest', type: 'video', duration: '30 min' },
          { id: 'comp-2-3', title: 'Ethics Assessment', type: 'quiz', duration: '35 min' }
        ]
      }
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership',
    icon: 'groups',
    color: '#8E44AD',
    courses: [
      {
        id: 'lead-1',
        title: 'Team Management Fundamentals',
        description: 'Learn essential skills for leading and managing a high-performing team.',
        duration: '4 hours',
        lessons: 6,
        thumbnail: '👥',
        lessonsList: [
          { id: 'lead-1-1', title: 'Leadership Styles', type: 'video', duration: '40 min' },
          { id: 'lead-1-2', title: 'Building Team Trust', type: 'text', duration: '35 min' },
          { id: 'lead-1-3', title: 'Delegation Strategies', type: 'video', duration: '45 min' },
          { id: 'lead-1-4', title: 'Performance Reviews', type: 'text', duration: '40 min' },
          { id: 'lead-1-5', title: 'Conflict Resolution', type: 'video', duration: '50 min' },
          { id: 'lead-1-6', title: 'Leadership Assessment', type: 'quiz', duration: '30 min' }
        ]
      },
      {
        id: 'lead-2',
        title: 'Strategic Planning',
        description: 'Learn how to create and execute strategic plans that drive business results.',
        duration: '3 hours',
        lessons: 5,
        thumbnail: '📈',
        lessonsList: [
          { id: 'lead-2-1', title: 'Strategic Thinking', type: 'video', duration: '35 min' },
          { id: 'lead-2-2', title: 'Goal Setting', type: 'text', duration: '40 min' },
          { id: 'lead-2-3', title: 'Resource Allocation', type: 'video', duration: '45 min' },
          { id: 'lead-2-4', title: 'Execution & Monitoring', type: 'text', duration: '40 min' },
          { id: 'lead-2-5', title: 'Strategy Quiz', type: 'quiz', duration: '20 min' }
        ]
      }
    ]
  }
];

// Quiz Questions Database
export const quizQuestions = {
  'onb-1-5': [
    { id: 1, question: 'What is our company mission?', options: ['To make money', 'To help businesses succeed through innovation', 'To be the cheapest', 'To dominate the market'], correct: 1 },
    { id: 2, question: 'How many core values do we have?', options: ['3', '4', '5', '6'], correct: 2 },
    { id: 3, question: 'Which value emphasizes customer success?', options: ['Innovation', 'Integrity', 'Customer First', 'Teamwork'], correct: 2 },
    { id: 4, question: 'When was our company founded?', options: ['2010', '2015', '2018', '2020'], correct: 1 },
    { id: 5, question: 'What should you do if you notice unethical behavior?', options: ['Ignore it', 'Report to HR', 'Post on social media', 'Keep it to yourself'], correct: 1 }
  ],
  'tech-1-6': [
    { id: 1, question: 'What is our flagship product?', options: ['Basic CRM', 'Enterprise Suite', 'Starter Pack', 'None'], correct: 1 },
    { id: 2, question: 'How does our pricing work?', options: ['Per user', 'Per feature', 'Both A and B', 'Free'], correct: 2 },
    { id: 3, question: 'What makes us different from competitors?', options: ['Price only', 'Integration capabilities', 'Support only', 'Nothing'], correct: 1 },
    { id: 4, question: 'Which industries do we primarily serve?', options: ['Tech only', 'Healthcare & Finance', 'Retail only', 'All industries'], correct: 1 },
    { id: 5, question: 'What is our support SLA?', options: ['24/7', 'Business hours', 'Email only', 'No support'], correct: 0 }
  ],
  'soft-1-5': [
    { id: 1, question: 'What is active listening?', options: ['Talking a lot', 'Fully concentrating on the speaker', 'Multi-tasking', 'Reading while listening'], correct: 1 },
    { id: 2, question: 'What is the best email length?', options: ['As long as needed', 'Under 5 sentences', '1 sentence', 'No limit'], correct: 1 },
    { id: 3, question: 'How should you handle a difficult conversation?', options: ['Avoid it', 'Be aggressive', 'Stay calm and factual', 'Send an email'], correct: 2 },
    { id: 4, question: 'What is the best presentation structure?', options: ['Random', 'Problem-Solution', 'No structure', 'Long paragraphs'], correct: 1 },
    { id: 5, question: 'What body language shows engagement?', options: ['Crossed arms', 'Looking at phone', 'Eye contact & nodding', 'Fidgeting'], correct: 2 }
  ],
  'comp-1-4': [
    { id: 1, question: 'What does GDPR stand for?', options: ['General Data Protection Regulation', 'Global Data Privacy Rules', 'Government Data Protection', 'None'], correct: 0 },
    { id: 2, question: 'What should you do with a suspicious email?', options: ['Open it', 'Click the link', 'Report to IT', 'Forward to colleagues'], correct: 2 },
    { id: 3, question: 'How often should you change passwords?', options: ['Never', 'Every 90 days', 'Every year', 'Only when compromised'], correct: 1 },
    { id: 4, question: 'What is phishing?', options: ['A sport', 'Fraudulent emails to steal info', 'A software', 'None'], correct: 1 },
    { id: 5, question: 'Can you share passwords with teammates?', options: ['Yes', 'No', 'Only sometimes', 'Depends on role'], correct: 1 }
  ],
  'lead-1-6': [
    { id: 1, question: 'Which leadership style involves giving teams autonomy?', options: ['Micromanagement', 'Laissez-faire', 'Autocratic', 'None'], correct: 1 },
    { id: 2, question: 'What is the best way to build team trust?', options: ['Strict rules', 'Transparency and consistency', 'Giving gifts', 'Team meetings only'], correct: 1 },
    { id: 3, question: 'What is the key to effective delegation?', options: ['Do everything yourself', 'Trust but verify', 'Micromanage', 'Ignore tasks'], correct: 1 },
    { id: 4, question: 'How should you handle poor performance?', options: ['Ignore it', 'Fire immediately', 'Coaching and feedback', 'Complain to HR'], correct: 2 },
    { id: 5, question: 'What is emotional intelligence in leadership?', options: ['Being emotional', 'Understanding and managing emotions', 'Ignoring feelings', 'Being strict'], correct: 1 }
  ]
};

// Initial Progress Data
export const initialProgress = {
  user: {
    name: 'Alex Johnson',
    role: 'Sales Manager',
    avatar: '👤',
    joinDate: '2024-01-15'
  },
  completedLessons: [],
  quizScores: {},
  totalHours: 0,
  streak: 0,
  lastActive: null,
  achievements: []
};

export const achievementsList = [
  { id: 'first-lesson', name: 'First Steps', desc: 'Complete your first lesson', icon: '🌟' },
  { id: 'quick-learner', name: 'Quick Learner', desc: 'Complete 5 lessons in a day', icon: '⚡' },
  { id: 'quiz-master', name: 'Quiz Master', desc: 'Score 100% on 3 quizzes', icon: '🏆' },
  { id: 'consistent', name: 'Consistent', desc: '7-day learning streak', icon: '🔥' },
  { id: 'completionist', name: 'Completionist', desc: 'Complete all courses in a category', icon: '🎯' },
  { id: 'expert', name: 'Expert', desc: 'Complete all training', icon: '👑' }
];