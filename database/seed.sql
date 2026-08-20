-- ===================================================
-- AI-Powered Study Assistant Sample Seed Data
-- ===================================================

USE study_assistant;

-- Insert Subjects
INSERT INTO subjects (id, name, description, icon) VALUES
(1, 'Mathematics', 'Algebra, calculus, geometry, and mathematical concepts.', '📘'),
(2, 'Computer Science', 'Programming, data structures, algorithms, and web development.', '💻'),
(3, 'Physics', 'Mechanics, thermodynamics, electromagnetism, and optics.', '🔬'),
(4, 'Chemistry', 'Organic, inorganic, physical chemistry, and chemical reactions.', '🧪'),
(5, 'Biology', 'Cell biology, genetics, ecology, and human anatomy.', '🧬'),
(6, 'Artificial Intelligence', 'Machine learning, neural networks, and prompt engineering.', '🤖');

-- Insert Sample Study Materials
INSERT INTO materials (subject_id, title, description, content, type, url) VALUES
(1, 'Calculus Basics: Limits & Derivatives', 'Comprehensive introduction to limits, derivatives, and rates of change.', 'Calculus is the mathematical study of continuous change. Differential calculus focuses on rates of change and slopes of curves, while integral calculus deals with accumulation of quantities and areas under curves.', 'Notes', 'https://example.com/materials/calculus-basics'),
(1, 'Linear Algebra Essentials', 'Understanding matrices, vectors, eigenvalues and transformations.', 'Linear algebra is central to almost all areas of mathematics and computer science, especially machine learning and graphics.', 'Article', 'https://example.com/materials/linear-algebra'),
(2, 'React Fundamentals & Component Architecture', 'Master the core concepts of React: JSX, Props, State, and Hooks.', 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.', 'Notes', 'https://example.com/materials/react-fundamentals'),
(2, 'Data Structures: Arrays and Linked Lists', 'Video walkthrough explaining memory layout of basic data structures.', 'Learn time and space complexity differences between continuous array memory and linked node references.', 'Video', 'https://example.com/materials/data-structures-video'),
(3, 'Newton''s Laws of Motion', 'Deep dive into classical mechanics and force interactions.', 'First Law: Law of Inertia. Second Law: F = ma. Third Law: For every action, there is an equal and opposite reaction.', 'Notes', 'https://example.com/materials/newtons-laws'),
(6, 'Introduction to Machine Learning', 'Supervised vs Unsupervised learning, models, and evaluation metrics.', 'Machine Learning is a subset of artificial intelligence focused on building systems that learn from data.', 'Article', 'https://example.com/materials/intro-ml');

-- Insert Sample Quizzes
INSERT INTO quizzes (id, subject_id, title, description, difficulty) VALUES
(1, 2, 'React & JavaScript Mastery', 'Test your knowledge on React hooks, state management, and modern JS.', 'Medium'),
(2, 1, 'Calculus & Derivatives Quiz', 'Practice problems on differentiation and limits.', 'Medium'),
(3, 3, 'Classical Mechanics Quiz', 'Test your understanding of Newton''s laws and energy conservation.', 'Easy');

-- Insert Sample Questions for Quiz 1 (React & JS)
INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 'What is React?', 'A relational database', 'A JavaScript library for building user interfaces', 'An operating system', 'A CSS preprocessor', 'B'),
(1, 'Which hook is used for managing component local state in React?', 'useEffect', 'useMemo', 'useState', 'useRef', 'C'),
(1, 'What does JSX stand for?', 'JavaScript XML', 'Java Syntax Extension', 'JSON Xylophone', 'JavaScript Xerox', 'A'),
(1, 'Which hook is used to perform side effects in functional components?', 'useLayout', 'useEffect', 'useCallback', 'useContext', 'B'),
(1, 'How do you pass data from a parent component to a child component in React?', 'Via State', 'Via Redux only', 'Via Props', 'Via LocalStorage', 'C');

-- Insert Sample Questions for Quiz 2 (Calculus)
INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
(2, 'What is the derivative of f(x) = x^2 with respect to x?', '2x', 'x', 'x^3 / 3', '2', 'A'),
(2, 'What is the derivative of a constant number c?', '1', 'c', '0', 'Infinity', 'C'),
(2, 'What is the derivative of sin(x)?', '-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)', 'B');

-- Insert Sample Questions for Quiz 3 (Physics)
INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
(3, 'What is Newton''s Second Law of Motion represented as?', 'E = mc^2', 'F = ma', 'P = IV', 'v = u + at', 'B'),
(3, 'What is the SI unit of force?', 'Joule', 'Watt', 'Newton', 'Pascal', 'C');
