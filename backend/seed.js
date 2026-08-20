import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import User from './models/User.js';
import Subject from './models/Subject.js';
import Material from './models/Material.js';
import Quiz from './models/Quiz.js';
import Activity from './models/Activity.js';

dotenv.config();

const sampleSubjects = [
  {
    name: 'Mathematics',
    description: 'Algebra, calculus, geometry, and mathematical analysis.',
    icon: '📘',
    color: '#3b82f6',
  },
  {
    name: 'Computer Science',
    description: 'Programming, algorithms, databases, and web architectures.',
    icon: '💻',
    color: '#8b5cf6',
  },
  {
    name: 'Physics',
    description: 'Classical mechanics, thermodynamics, electromagnetism, and optics.',
    icon: '🔬',
    color: '#06b6d4',
  },
  {
    name: 'Chemistry',
    description: 'Organic chemistry, molecular bonding, and periodic reactions.',
    icon: '🧪',
    color: '#10b981',
  },
  {
    name: 'Biology',
    description: 'Genetics, cellular biology, anatomy, and ecology.',
    icon: '🧬',
    color: '#f59e0b',
  },
  {
    name: 'Artificial Intelligence',
    description: 'Machine learning, neural networks, and prompt engineering.',
    icon: '🤖',
    color: '#ec4899',
  },
];

const sampleMaterials = [
  {
    subject: 'Computer Science',
    title: 'React Fundamentals & Component Architecture',
    description: 'Master JSX, props, state, hooks, and clean reusable component patterns.',
    type: 'Notes',
    readingTimeMinutes: 8,
    keyTakeaways: [
      'Components are independent and reusable bits of code returning JSX.',
      'State is private and fully controlled by the component.',
      'Props are read-only inputs passed from parent to child.',
      'Hooks let functional components tap into state and lifecycle.',
    ],
    content: `## 📘 React Fundamentals Guide\n\nReact is a declarative, component-based library for building interactive user interfaces.\n\n### 1. Component Driven Architecture\nEverything in React is a component. Break down complex pages into focused, single-purpose components (e.g. \`Button\`, \`Navbar\`, \`QuizCard\`).\n\n### 2. State vs Props\n- **Props**: External parameters passed down from a parent component. Immutable inside the receiving component.\n- **State**: Internal data maintained and changed within the component using the \`useState\` hook.\n\n### 3. Practical Example\n\`\`\`jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>;\n}\n\`\`\``,
  },
  {
    subject: 'Computer Science',
    title: 'Understanding Recursion & Call Stacks',
    description: 'Deep dive into recursive algorithms, base cases, and avoiding stack overflow.',
    type: 'Article',
    readingTimeMinutes: 6,
    keyTakeaways: [
      'Every recursive function requires at least one base case to terminate.',
      'Each function invocation pushes a new frame onto the call stack.',
      'Without a valid base case, recursion leads to Maximum Call Stack Exceeded.',
    ],
    content: `## 🔄 Deep Dive into Recursion\n\nRecursion occurs when a function calls itself directly or indirectly to solve smaller subproblems.\n\n### Anatomy of a Recursive Function:\n1. **Base Case**: Halts execution when the condition is met.\n2. **Recursive Step**: Progresses toward the base case with reduced inputs.\n\n\`\`\`javascript\nfunction sumTo(n) {\n  if (n <= 1) return n; // Base case\n  return n + sumTo(n - 1); // Recursive step\n}\n\`\`\``,
  },
  {
    subject: 'Mathematics',
    title: 'Calculus Basics: Limits & Derivatives',
    description: 'Essential formulas and geometric interpretations of rates of change.',
    type: 'Notes',
    readingTimeMinutes: 7,
    keyTakeaways: [
      'A limit evaluates the behavior of a function as input approaches a point.',
      'The derivative f\'(x) represents the instantaneous slope of a tangent line.',
      'Power Rule: The derivative of x^n is n * x^(n-1).',
    ],
    content: `## 📐 Calculus Essentials\n\nCalculus forms the foundation for data science, physics, and computer graphics.\n\n### 1. The Power Rule\nFor any real number $n$:\n$$\\frac{d}{dx}[x^n] = n x^{n-1}$$\n\n### 2. Derivatives of Trigonometric Functions\n- $\\frac{d}{dx}[\\sin(x)] = \\cos(x)$\n- $\\frac{d}{dx}[\\cos(x)] = -\\sin(x)$`,
  },
  {
    subject: 'Physics',
    title: 'Newton\'s Laws of Motion & Applications',
    description: 'Classical mechanics, force diagrams, friction, and acceleration.',
    type: 'Notes',
    readingTimeMinutes: 5,
    keyTakeaways: [
      'First Law: Law of Inertia.',
      'Second Law: Net Force = mass * acceleration (F = ma).',
      'Third Law: Equal and opposite action-reaction pairs.',
    ],
    content: `## 🚀 Newton's Laws in Mechanics\n\n1. **Law 1**: In the absence of an external net force, an object maintains constant velocity.\n2. **Law 2**: $\\vec{F} = m\\vec{a}$, meaning acceleration scales proportionally with applied force and inversely with mass.\n3. **Law 3**: Forces always occur in matched interaction pairs.`,
  },
  {
    subject: 'Artificial Intelligence',
    title: 'Introduction to Supervised Machine Learning',
    description: 'Feature vectors, labels, loss functions, gradient descent, and evaluation.',
    type: 'Article',
    readingTimeMinutes: 10,
    keyTakeaways: [
      'Supervised learning trains models on labeled input-output pairs.',
      'Classification predicts discrete categories, while Regression predicts continuous quantities.',
      'Overfitting is mitigated using regularization and train/test split validation.',
    ],
    content: `## 🤖 Machine Learning Foundations\n\nSupervised learning utilizes input features $X$ and ground truth labels $Y$ to learn a mapping function $f(X) \\approx Y$.\n\n### Key Concepts:\n- **Loss Function**: Measures prediction error.\n- **Gradient Descent**: Iteratively updates model weights to minimize the loss.`,
  },
];

const sampleQuizzes = [
  {
    subject: 'Computer Science',
    title: 'React & Modern JavaScript Quiz',
    description: 'Test your understanding of React component state, hooks, and ES6+ features.',
    difficulty: 'Medium',
    timeLimitMinutes: 10,
    questions: [
      {
        question: 'What is React primarily categorized as?',
        options: {
          A: 'A relational database engine',
          B: 'A JavaScript library for building user interfaces',
          C: 'A full Linux operating system',
          D: 'A CSS preprocessor',
        },
        correctAnswer: 'B',
        explanation: 'React is an open-source JavaScript library focused exclusively on rendering dynamic user interfaces.',
      },
      {
        question: 'Which hook is used for component-level local state management?',
        options: {
          A: 'useEffect',
          B: 'useRef',
          C: 'useState',
          D: 'useCallback',
        },
        correctAnswer: 'C',
        explanation: '`useState` declares a state variable and a setter function.',
      },
      {
        question: 'What happens if a recursive function lacks a base case?',
        options: {
          A: 'The code runs faster',
          B: 'It causes a Stack Overflow / Maximum Call Stack Exceeded error',
          C: 'The browser automatically fixes it',
          D: 'Nothing happens',
        },
        correctAnswer: 'B',
        explanation: 'Without a base case, function calls stack indefinitely until available memory is exhausted.',
      },
      {
        question: 'Which of the following is true about React Props?',
        options: {
          A: 'They can be mutated directly by the child component',
          B: 'They are read-only inputs passed from parent components',
          C: 'They only accept numbers',
          D: 'They cannot be passed to functional components',
        },
        correctAnswer: 'B',
        explanation: 'Props follow strict unidirectional top-down data flow and must remain pure and read-only.',
      },
      {
        question: 'What does the `useEffect` hook with an empty dependency array `[]` do?',
        options: {
          A: 'Runs on every single re-render',
          B: 'Runs only once when the component mounts',
          C: 'Throws a compiler error',
          D: 'Unmounts the component immediately',
        },
        correctAnswer: 'B',
        explanation: 'Passing an empty dependency array tells React to execute the effect only on initial mount.',
      },
    ],
  },
  {
    subject: 'Mathematics',
    title: 'Calculus Differentiation Quiz',
    description: 'Test your understanding of derivative formulas, rates of change, and limits.',
    difficulty: 'Medium',
    timeLimitMinutes: 8,
    questions: [
      {
        question: 'What is the derivative of f(x) = x^3 with respect to x?',
        options: {
          A: '3x^2',
          B: 'x^2',
          C: '3x',
          D: 'x^4 / 4',
        },
        correctAnswer: 'A',
        explanation: 'By the power rule: d/dx(x^n) = n * x^(n-1), so d/dx(x^3) = 3x^2.',
      },
      {
        question: 'What is the derivative of any constant number c?',
        options: {
          A: '1',
          B: 'c',
          C: '0',
          D: 'Infinity',
        },
        correctAnswer: 'C',
        explanation: 'Constants have no rate of change, so their derivative is identically 0.',
      },
      {
        question: 'What is the derivative of sin(x)?',
        options: {
          A: '-cos(x)',
          B: 'cos(x)',
          C: 'tan(x)',
          D: '-sin(x)',
        },
        correctAnswer: 'B',
        explanation: 'The standard derivative of sin(x) is cos(x).',
      },
    ],
  },
  {
    subject: 'Physics',
    title: 'Newton\'s Laws of Motion Quiz',
    description: 'Practice questions on force, inertia, mass, and acceleration.',
    difficulty: 'Easy',
    timeLimitMinutes: 5,
    questions: [
      {
        question: 'What mathematical formula expresses Newton\'s Second Law?',
        options: {
          A: 'E = mc^2',
          B: 'F = ma',
          C: 'v = u + at',
          D: 'P = IV',
        },
        correctAnswer: 'B',
        explanation: 'Newton\'s second law states that Force = mass * acceleration.',
      },
      {
        question: 'What is the SI unit of Force?',
        options: {
          A: 'Joule',
          B: 'Watt',
          C: 'Newton',
          D: 'Pascal',
        },
        correctAnswer: 'C',
        explanation: 'The standard SI unit of force is the Newton (N = kg*m/s^2).',
      },
    ],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await Promise.all([
      Subject.deleteMany({}),
      Material.deleteMany({}),
      Quiz.deleteMany({}),
      Activity.deleteMany({}),
    ]);

    console.log('🌱 Inserting Subjects...');
    await Subject.insertMany(sampleSubjects);

    console.log('🌱 Inserting Study Materials...');
    await Material.insertMany(sampleMaterials);

    console.log('🌱 Inserting Quizzes...');
    await Quiz.insertMany(sampleQuizzes);

    // Create a default test user if one doesn't exist
    const existingStudent = await User.findOne({ email: 'student@example.com' });
    if (!existingStudent) {
      console.log('👤 Creating default demo student account (student@example.com)...');
      await User.create({
        name: 'Demo Student',
        email: 'student@example.com',
        password: 'password123',
        studyGoalMinutes: 60,
      });
    }

    console.log('✅ Database seeded successfully with MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
