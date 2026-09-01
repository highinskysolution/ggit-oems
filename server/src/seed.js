import mongoose from 'mongoose';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Question from './models/Question.js';
import Exam from './models/Exam.js';
import Result from './models/Result.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting GGIT Academic Database Initialization...');

    // Clean all collections for fresh initialization
    await Promise.all([
      User.deleteMany({}),
      Subject.deleteMany({}),
      Question.deleteMany({}),
      Exam.deleteMany({}),
      Result.deleteMany({}),
    ]);

    // 1. Create Master Admin Account (Controller of Examinations)
    const adminUser = await User.create({
      name: 'Dr. Vikram Malhotra (Admin)',
      email: 'admin@oems.com',
      password: 'admin123',
      role: 'admin',
      department: 'Examination Control Division',
    });

    // 2. Create 1 Authorized Faculty Examiner Account
    const teacherUser = await User.create({
      name: 'Prof. Rajesh Sharma (Faculty)',
      email: 'teacher@oems.com',
      password: 'admin123',
      role: 'teacher',
      department: 'BCA',
    });

    console.log('✅ Initialized Master Admin: admin@oems.com / admin123');
    console.log('✅ Initialized Authorized Faculty: teacher@oems.com / admin123');

    // 3. Create EXACT 6 Academic Curriculum Subjects: Web Framework, Operating System, Java, DBMS, SE, Python
    const wfSubject = await Subject.create({
      subject_code: 'BCA301',
      subject_name: 'Web Application Frameworks (Web Framework)',
    });

    const osSubject = await Subject.create({
      subject_code: 'BCA302',
      subject_name: 'Operating Systems & Architecture (Operating System)',
    });

    const javaSubject = await Subject.create({
      subject_code: 'BCA303',
      subject_name: 'Core & Advanced Java Programming (Java)',
    });

    const dbmsSubject = await Subject.create({
      subject_code: 'BCA304',
      subject_name: 'Database Management Systems (DBMS)',
    });

    const seSubject = await Subject.create({
      subject_code: 'BCA305',
      subject_name: 'Software Engineering (SE)',
    });

    const pythonSubject = await Subject.create({
      subject_code: 'BCA306',
      subject_name: 'Python Programming & Data Structures (Python)',
    });

    console.log('✅ Seeded 6 Core Curriculum Subjects: Web Framework, OS, Java, DBMS, SE, Python');

    // 4. Questions for 1: Web Framework
    const wfQuestions = await Question.insertMany([
      {
        subject: wfSubject._id,
        question_text: 'In modern React framework, what mechanism is used to calculate the minimal set of DOM changes required?',
        options: ['Direct Real DOM Mutation', 'Virtual DOM Diffing Algorithm', 'Shadow DOM Encapsulation', 'CSSOM Tree Parser'],
        correct_option: 1,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'React compares the Virtual DOM with a previous snapshot using its reconciliation/diffing algorithm to apply minimal real DOM updates.',
      },
      {
        subject: wfSubject._id,
        question_text: 'In Express.js web framework, what is the role of the next() function in middleware execution?',
        options: [
          'Terminates the HTTP request immediately',
          'Passes control to the next middleware function in the request-response pipeline',
          'Renders the HTML template',
          'Restarts the Node.js server',
        ],
        correct_option: 1,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'Calling next() invokes the next registered middleware in the Express processing stack.',
      },
      {
        subject: wfSubject._id,
        question_text: 'Which React Hook is primarily utilized for handling side effects like data fetching and subscription listeners?',
        options: ['useState', 'useReducer', 'useEffect', 'useMemo'],
        correct_option: 2,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'useEffect serves the purpose of lifecycle side-effects in functional React components.',
      },
      {
        subject: wfSubject._id,
        question_text: 'What HTTP status code is universally returned when a requested RESTful resource cannot be found on the server?',
        options: ['200 OK', '401 Unauthorized', '404 Not Found', '500 Internal Server Error'],
        correct_option: 2,
        marks: 1,
        difficulty: 'Easy',
        explanation: '404 indicates that the server cannot locate the requested URI resource.',
      },
    ]);

    // 5. Questions for 2: Operating System
    const osQuestions = await Question.insertMany([
      {
        subject: osSubject._id,
        question_text: 'Which of the following is NOT one of Coffman\'s four necessary conditions for a deadlock to occur?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correct_option: 2,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'Deadlock requires NO PREEMPTION. If resources can be preempted, deadlock is prevented.',
      },
      {
        subject: osSubject._id,
        question_text: 'Which CPU scheduling algorithm allocates a fixed cyclic time quantum to each runnable process in the ready queue?',
        options: ['First-Come First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Multilevel Queue'],
        correct_option: 2,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'Round Robin is a preemptive scheduling algorithm that assigns each ready process a uniform time slice.',
      },
      {
        subject: osSubject._id,
        question_text: 'What is the primary objective of Virtual Memory implementation using Demand Paging in modern OS?',
        options: [
          'To increase CPU core cache capacity',
          'To execute programs whose memory requirements exceed available physical RAM',
          'To permanently store kernel binary files on ROM',
          'To accelerate network socket transfers',
        ],
        correct_option: 1,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'Virtual memory allows programs larger than physical memory to execute via paging mechanisms.',
      },
    ]);

    // 6. Questions for 3: Java
    const javaQuestions = await Question.insertMany([
      {
        subject: javaSubject._id,
        question_text: 'Which OOP pillar in Java allows a subclass to provide a specific implementation of a method already defined in its superclass?',
        options: ['Encapsulation', 'Method Overriding (Runtime Polymorphism)', 'Abstraction', 'Data Hiding'],
        correct_option: 1,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'Method overriding enables runtime polymorphism where the sub-class method executes based on object reference.',
      },
      {
        subject: javaSubject._id,
        question_text: 'Which Java memory area is responsible for storing object instances created dynamically with the "new" keyword?',
        options: ['Stack Memory', 'Heap Memory', 'Program Counter Register', 'Native Method Stack'],
        correct_option: 1,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'In Java, all objects and their instance variables are allocated on the Heap memory.',
      },
      {
        subject: javaSubject._id,
        question_text: 'Which keyword in Java prevents a class from being subclassed / inherited?',
        options: ['static', 'finally', 'final', 'abstract'],
        correct_option: 2,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'A final class cannot be extended by any other class in Java.',
      },
    ]);

    // 7. Questions for 4: DBMS
    const dbmsQuestions = await Question.insertMany([
      {
        subject: dbmsSubject._id,
        question_text: 'Which normal form eliminates transitive functional dependencies where non-prime attributes depend on other non-prime attributes?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correct_option: 2,
        marks: 2,
        difficulty: 'Medium',
        explanation: '3NF requires that the relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.',
      },
      {
        subject: dbmsSubject._id,
        question_text: 'In transaction processing, which ACID property guarantees that all modifications are preserved permanently upon commit?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct_option: 3,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'Durability ensures that once a transaction commits, its effects survive system crashes.',
      },
      {
        subject: dbmsSubject._id,
        question_text: 'Which SQL clause is strictly mandatory when applying filter conditions on grouped and aggregated dataset results?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
        correct_option: 1,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'HAVING is used to filter aggregated group values because WHERE cannot be applied directly on aggregates.',
      },
    ]);

    // 8. Questions for 5: Software Engineering (SE)
    const seQuestions = await Question.insertMany([
      {
        subject: seSubject._id,
        question_text: 'Which Software Development Life Cycle (SDLC) model is most suitable for projects with clear, stable, and fixed requirements upfront?',
        options: ['Spiral Model', 'Waterfall Model', 'Agile Scrum', 'Rapid Application Development (RAD)'],
        correct_option: 1,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'Waterfall is a linear-sequential life cycle model best applied when requirements are well understood upfront.',
      },
      {
        subject: seSubject._id,
        question_text: 'What international documentation standard defines the format and guidelines for Software Requirements Specifications (SRS)?',
        options: ['IEEE 829', 'IEEE 830-1998', 'ISO 9001', 'CMMI Level 5'],
        correct_option: 1,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'IEEE 830-1998 is the international standard recommendation for Software Requirements Specifications (SRS).',
      },
      {
        subject: seSubject._id,
        question_text: 'In software architecture, what design principle advocates high cohesion and loose coupling?',
        options: [
          'Tangled inter-module dependencies with shared global state',
          'Single well-defined module responsibility with minimal interdependence on other modules',
          'Procedural monolithic design only',
          'Redundant code duplication',
        ],
        correct_option: 1,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'High cohesion inside a module and loose coupling between modules promotes modularity and maintainability.',
      },
    ]);

    // 9. Questions for 6: Python
    const pythonQuestions = await Question.insertMany([
      {
        subject: pythonSubject._id,
        question_text: 'Which of the following built-in data types in Python is IMMUTABLE?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correct_option: 2,
        marks: 1,
        difficulty: 'Easy',
        explanation: 'Tuples, integers, floats, and strings are immutable in Python, meaning their values cannot be changed in-place.',
      },
      {
        subject: pythonSubject._id,
        question_text: 'What is the output of the Python expression: [x**2 for x in range(4) if x % 2 == 0]?',
        options: ['[0, 1, 4, 9]', '[0, 4]', '[1, 9]', '[0, 2, 4]'],
        correct_option: 1,
        marks: 2,
        difficulty: 'Medium',
        explanation: 'range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Their squares are 0**2=0 and 2**2=4 -> [0, 4].',
      },
      {
        subject: pythonSubject._id,
        question_text: 'What mechanism in CPython ensures that only one thread executes Python bytecode at any given moment?',
        options: ['Global Interpreter Lock (GIL)', 'Just-In-Time (JIT) Compiler', 'Garbage Collector Cycle', 'Thread Pool Executor'],
        correct_option: 0,
        marks: 2,
        difficulty: 'Hard',
        explanation: 'The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple native threads from executing bytecode simultaneously.',
      },
    ]);

    console.log(`✅ Seeded Questions: WF (${wfQuestions.length}) + OS (${osQuestions.length}) + Java (${javaQuestions.length}) + DBMS (${dbmsQuestions.length}) + SE (${seQuestions.length}) + Python (${pythonQuestions.length})`);

    // 10. Create Active Published Examinations for ALL 6 Subjects
    const wfTotal = wfQuestions.reduce((s, q) => s + q.marks, 0); // 5 Marks
    const osTotal = osQuestions.reduce((s, q) => s + q.marks, 0); // 5 Marks
    const javaTotal = javaQuestions.reduce((s, q) => s + q.marks, 0); // 4 Marks
    const dbmsTotal = dbmsQuestions.reduce((s, q) => s + q.marks, 0); // 4 Marks
    const seTotal = seQuestions.reduce((s, q) => s + q.marks, 0); // 4 Marks
    const pyTotal = pythonQuestions.reduce((s, q) => s + q.marks, 0); // 5 Marks

    await Exam.create({
      title: 'BCA Semester III: Web Application Frameworks Comprehensive Exam',
      subject: wfSubject._id,
      created_by: adminUser._id,
      duration_mins: 15,
      total_marks: wfTotal,
      passing_marks: 2,
      questions: wfQuestions.map((q) => q._id),
      is_active: true,
      instructions: '1. Covering React Virtual DOM, Express.js middleware, and REST architecture. 2. Proctoring and timer active.',
    });

    await Exam.create({
      title: 'BCA Semester IV: Operating Systems & Architecture Test',
      subject: osSubject._id,
      created_by: adminUser._id,
      duration_mins: 15,
      total_marks: osTotal,
      passing_marks: 2,
      questions: osQuestions.map((q) => q._id),
      is_active: true,
      instructions: '1. Deadlocks, CPU Scheduling, and Virtual Memory. 2. Real-time timer active.',
    });

    await Exam.create({
      title: 'BCA Semester III: Object Oriented Programming with Java Assessment',
      subject: javaSubject._id,
      created_by: adminUser._id,
      duration_mins: 15,
      total_marks: javaTotal,
      passing_marks: 2,
      questions: javaQuestions.map((q) => q._id),
      is_active: true,
      instructions: '1. Java OOP, Polymorphism, Heap Memory, and Final classes.',
    });

    await Exam.create({
      title: 'BCA Semester III: Database Management Systems (DBMS) Mid-Term',
      subject: dbmsSubject._id,
      created_by: adminUser._id,
      duration_mins: 15,
      total_marks: dbmsTotal,
      passing_marks: 2,
      questions: dbmsQuestions.map((q) => q._id),
      is_active: true,
      instructions: '1. Normalization, ACID Transactions, and SQL HAVING aggregations.',
    });

    await Exam.create({
      title: 'BCA Semester III: Software Engineering (SE) Semester Exam',
      subject: seSubject._id,
      created_by: adminUser._id,
      duration_mins: 15,
      total_marks: seTotal,
      passing_marks: 2,
      questions: seQuestions.map((q) => q._id),
      is_active: true,
      instructions: '1. SDLC Waterfall, IEEE 830 SRS, and High Cohesion/Low Coupling modularity.',
    });

    await Exam.create({
      title: 'BCA Semester IV: Python Programming & Data Structures Quiz',
      subject: pythonSubject._id,
      created_by: adminUser._id,
      duration_mins: 15,
      total_marks: pyTotal,
      passing_marks: 2,
      questions: pythonQuestions.map((q) => q._id),
      is_active: true,
      instructions: '1. Python Immutability, List Comprehensions, and Global Interpreter Lock (GIL).',
    });

    console.log('✅ Seeded 6 Active Examinations for Web Framework, OS, Java, DBMS, SE, Python');
    console.log('🎉 Database Initialization Completed Successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
    throw error;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  import('dotenv/config').then(async () => {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oems_db';
      await mongoose.connect(uri);
      await seedDatabase();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
