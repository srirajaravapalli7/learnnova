import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Download,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Network,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
  Database,
  BrainCircuit,
  Globe2,
  Award,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sun,
  Moon,
  LogIn,
  UserRound,
  Flame,
  BarChart3,
  MapPin,
  Timer,
  PanelsTopLeft,
  MousePointer2,
  BookMarked,
  ShieldCheck,
} from "lucide-react";
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

const STORAGE_KEY = "campusly-lms-v1";
const THEME_KEY = "learnsphere-theme-v1";
const CampusScene = lazy(() => import("./CampusScene.jsx"));

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 0, 0);
  return date.toISOString();
};

const sampleCourses = [
  {
    id: "java",
    title: "Java Programming",
    description: "Build a strong foundation in Java, object-oriented programming, and modern application development.",
    instructor: "Dr. Maya Patel",
    category: "Programming",
    duration: "8 weeks",
    students: 128,
    rosterIds: ["student", "jamie", "taylor"],
    color: "coral",
    icon: "code",
    enrolled: true,
    progress: 68,
    materials: ["Getting started with Java.pdf", "OOP concepts — lecture slides.pdf"],
    modules: ["Java fundamentals", "Object-oriented programming", "Collections & generics", "Building your first app"],
  },
  {
    id: "web",
    title: "Web Development",
    description: "Learn to create responsive websites with HTML, CSS, JavaScript, and today's best practices.",
    instructor: "Prof. Ethan Brooks",
    category: "Development",
    duration: "10 weeks",
    students: 96,
    rosterIds: ["student", "jordan", "morgan"],
    color: "blue",
    icon: "globe",
    enrolled: true,
    progress: 42,
    materials: ["HTML & CSS quick reference.pdf", "Responsive layouts — workshop.pdf"],
    modules: ["HTML essentials", "CSS & responsive design", "JavaScript foundations", "Publish your portfolio"],
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    description: "Understand relational database design, SQL, normalization, and how to work with data confidently.",
    instructor: "Dr. Noah Williams",
    category: "Data",
    duration: "6 weeks",
    students: 84,
    rosterIds: ["jamie", "taylor", "morgan"],
    color: "purple",
    icon: "database",
    enrolled: false,
    progress: 0,
    materials: ["SQL fundamentals.pdf", "Database design workbook.pdf"],
    modules: ["Relational data models", "SQL queries", "Normalization", "Transactions & indexing"],
  },
  {
    id: "networks",
    title: "Computer Networks",
    description: "Explore how the internet works, from network protocols and architecture to security fundamentals.",
    instructor: "Prof. Aisha Rahman",
    category: "Technology",
    duration: "7 weeks",
    students: 73,
    rosterIds: ["jordan", "jamie", "taylor"],
    color: "mint",
    icon: "network",
    enrolled: false,
    progress: 0,
    materials: ["Networking essentials.pdf", "OSI model — study guide.pdf"],
    modules: ["Network architecture", "The OSI & TCP/IP models", "Routing and switching", "Network security"],
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    description: "Get introduced to machine learning, intelligent systems, and the ideas shaping tomorrow.",
    instructor: "Dr. Sofia Chen",
    category: "Data",
    duration: "9 weeks",
    students: 112,
    rosterIds: ["student", "jordan", "morgan"],
    color: "amber",
    icon: "brain",
    enrolled: true,
    progress: 21,
    materials: ["AI foundations.pdf", "Introduction to machine learning.pdf"],
    modules: ["What is AI?", "Search & problem solving", "Machine learning basics", "Responsible AI"],
  },
  {
    id: "math",
    title: "Discrete Mathematics",
    description: "Explore logic, sets, combinatorics, and the mathematical foundations behind modern computing.",
    instructor: "Dr. Lina Foster",
    category: "Mathematics",
    duration: "7 weeks",
    students: 61,
    rosterIds: ["student", "taylor"],
    color: "blue",
    icon: "math",
    enrolled: false,
    progress: 0,
    materials: ["Logic & proof methods.pdf", "Combinatorics problem set.pdf"],
    modules: ["Logic and proof", "Sets and relations", "Counting & combinatorics", "Graphs and trees"],
  },
  {
    id: "library",
    title: "Digital Research Methods",
    description: "Find, evaluate, organize, and cite high-quality digital sources for academic work.",
    instructor: "Prof. Amara Okafor",
    category: "Research",
    duration: "4 weeks",
    students: 48,
    rosterIds: ["jamie", "morgan"],
    color: "purple",
    icon: "library",
    enrolled: false,
    progress: 0,
    materials: ["Research source checklist.pdf", "Citation style guide.pdf"],
    modules: ["Research question design", "Finding scholarly sources", "Evaluating evidence", "Citation & academic integrity"],
  },
  {
    id: "design",
    title: "Visual Design Foundations",
    description: "Build a confident visual language with typography, color, composition, and inclusive design.",
    instructor: "Prof. Camille Laurent",
    category: "Design",
    duration: "6 weeks",
    students: 54,
    rosterIds: ["jordan", "student"],
    color: "coral",
    icon: "design",
    enrolled: false,
    progress: 0,
    materials: ["Principles of visual hierarchy.pdf", "Accessible color toolkit.pdf"],
    modules: ["Composition and balance", "Type as a system", "Color & contrast", "Designing for everyone"],
  },
];

const sampleStudentDirectory = {
  student: { name: "Alex Morgan", email: "alex.morgan@learnnova.edu", program: "Computer Science · Year 2" },
  jamie: { name: "Jamie Rivera", email: "jamie.rivera@learnnova.edu", program: "Software Engineering · Year 3" },
  taylor: { name: "Taylor Brooks", email: "taylor.brooks@learnnova.edu", program: "Computer Science · Year 1" },
  jordan: { name: "Jordan Lee", email: "jordan.lee@learnnova.edu", program: "Information Systems · Year 2" },
  morgan: { name: "Morgan Ellis", email: "morgan.ellis@learnnova.edu", program: "Data Science · Year 3" },
};

const departments = [
  {
    id: "programming",
    name: "Programming Academy",
    shortLabel: "01 · COMPUTING",
    kind: "programming",
    position: [-6.4, 0, 1.65],
    width: 3.2,
    height: 2.55,
    depth: 2.35,
    floors: 3,
    columns: 5,
    accent: "#48b7d1",
    description: "A hands-on home for software craft, systems thinking, and the next generation of digital tools.",
    featuredCourse: "Java Programming",
    courseQuery: "Java Programming",
    duration: "8 weeks",
    icon: Code2,
  },
  {
    id: "mathematics",
    name: "Mathematics Center",
    shortLabel: "02 · MATHEMATICS",
    kind: "math",
    position: [-2.7, 0, -3.1],
    width: 2.55,
    height: 3.25,
    depth: 2.45,
    floors: 4,
    columns: 4,
    accent: "#c5a36d",
    description: "Where rigorous ideas become practical insight—from discrete structures to the logic behind computation.",
    featuredCourse: "Discrete Mathematics",
    courseQuery: "Discrete Mathematics",
    duration: "7 weeks",
    icon: Target,
  },
  {
    id: "library",
    name: "Digital Library",
    shortLabel: "03 · KNOWLEDGE",
    kind: "library",
    position: [0.45, 0, 1.2],
    width: 3.75,
    height: 1.8,
    depth: 2.45,
    floors: 2,
    columns: 6,
    accent: "#65aeb9",
    description: "A quiet, connected place to find trusted sources, deepen your research, and follow a question further.",
    featuredCourse: "Digital Research Methods",
    courseQuery: "Digital Research Methods",
    duration: "4 weeks",
    icon: BookMarked,
  },
  {
    id: "design",
    name: "Design Studio",
    shortLabel: "04 · CREATIVE ARTS",
    kind: "studio",
    position: [4.1, 0, -3.35],
    width: 3.05,
    height: 2.1,
    depth: 2.3,
    floors: 2,
    columns: 5,
    accent: "#bd8b71",
    description: "An open studio for visual problem-solving, thoughtful interfaces, and design that welcomes everyone.",
    featuredCourse: "Visual Design Foundations",
    courseQuery: "Visual Design Foundations",
    duration: "6 weeks",
    icon: PanelsTopLeft,
  },
  {
    id: "ai",
    name: "AI Research Center",
    shortLabel: "05 · INTELLIGENCE",
    kind: "ai",
    position: [7.1, 0, 3.15],
    width: 3.05,
    height: 2.8,
    depth: 2.35,
    floors: 3,
    columns: 5,
    accent: "#68b9cf",
    description: "Explore machine intelligence with curiosity, scientific care, and a commitment to responsible research.",
    featuredCourse: "Artificial Intelligence",
    courseQuery: "Artificial Intelligence",
    duration: "9 weeks",
    icon: BrainCircuit,
  },
];

const sampleAssignments = [
  {
    id: "a1",
    courseId: "java",
    title: "Object-Oriented Programming Project",
    description: "Build a small library management application using classes, inheritance, and encapsulation.",
    dueDate: daysFromNow(2),
    maxMarks: 100,
  },
  {
    id: "a2",
    courseId: "web",
    title: "Responsive Portfolio Website",
    description: "Create a multi-section portfolio that works beautifully on mobile and desktop screens.",
    dueDate: daysFromNow(5),
    maxMarks: 50,
  },
  {
    id: "a3",
    courseId: "ai",
    title: "AI in Everyday Life — Reflection",
    description: "Choose an AI-powered product and explain how it works, its benefits, and its limitations.",
    dueDate: daysFromNow(8),
    maxMarks: 30,
  },
  {
    id: "a4",
    courseId: "dbms",
    title: "Design a Relational Database",
    description: "Create an ER diagram and normalized schema for a campus event booking system.",
    dueDate: daysFromNow(11),
    maxMarks: 40,
  },
  {
    id: "a5",
    courseId: "java",
    title: "Java Collections Quiz",
    description: "Review lists, maps, sets, and generics with a short written quiz.",
    dueDate: daysFromNow(-3),
    maxMarks: 20,
  },
];

const sampleAnnouncements = [
  {
    id: "n1",
    title: "Welcome to your new semester",
    body: "We're glad you're here! Explore your courses and check the assignment calendar to plan your first few weeks.",
    author: "Academic Office",
    date: daysFromNow(-1),
    pinned: true,
  },
  {
    id: "n2",
    title: "Library study rooms now open",
    body: "Small-group study rooms can now be reserved through the student portal. Drop by the library desk if you need help.",
    author: "Student Services",
    date: daysFromNow(-2),
    pinned: false,
  },
  {
    id: "n3",
    title: "Upcoming guest lecture: AI for good",
    body: "Join Dr. Sofia Chen this Friday at 2:00 PM in the Innovation Hall for a conversation about responsible AI.",
    author: "Dr. Sofia Chen",
    date: daysFromNow(-3),
    pinned: false,
  },
];

const seedData = () => ({
  courses: sampleCourses,
  assignments: sampleAssignments,
  announcements: sampleAnnouncements,
  submissions: [
    { id: "s1", assignmentId: "a1", student: "Alex Morgan", studentId: "student", answer: "I built the library app with Book and Member classes, plus a borrowing flow.", submittedAt: daysFromNow(-1), marks: 88, feedback: "A thoughtful implementation. Nice work on the class structure." },
    { id: "s2", assignmentId: "a2", student: "Alex Morgan", studentId: "student", answer: "My portfolio draft is ready for review.", submittedAt: daysFromNow(-2), marks: null, feedback: "" },
    { id: "s3", assignmentId: "a3", student: "Alex Morgan", studentId: "student", answer: "I chose a music recommendation app and reflected on personalization and privacy.", submittedAt: daysFromNow(-1), marks: 26, feedback: "Clear examples and a balanced discussion." },
    { id: "s4", assignmentId: "a1", student: "Jamie Rivera", studentId: "jamie", answer: "My submitted project uses a set of classes to model the library.", submittedAt: daysFromNow(-2), marks: null, feedback: "" },
  ],
  activity: [
    { id: "r1", title: "You enrolled in Artificial Intelligence", detail: "Artificial Intelligence", date: daysFromNow(-1), icon: "book" },
    { id: "r2", title: "Assignment submitted", detail: "AI in Everyday Life — Reflection", date: daysFromNow(-1), icon: "check" },
    { id: "r3", title: "You earned 88 / 100", detail: "Object-Oriented Programming Project", date: daysFromNow(-2), icon: "award" },
    { id: "r4", title: "You continued learning", detail: "Web Development · CSS & responsive design", date: daysFromNow(-3), icon: "book" },
  ],
  studyHours: [
    { day: "Mon", hours: 1.8 },
    { day: "Tue", hours: 2.6 },
    { day: "Wed", hours: 1.2 },
    { day: "Thu", hours: 3.1 },
    { day: "Fri", hours: 2.3 },
    { day: "Sat", hours: 3.7 },
    { day: "Sun", hours: 2.1 },
  ],
  studyStreak: 7,
  certificates: [
    { id: "certificate-1", title: "Foundations of Programming", courseTitle: "Programming Primer", instructor: "Dr. Maya Patel", issuedAt: daysFromNow(-74), credentialId: "LS-26-00418", score: 94, hours: 18 },
    { id: "certificate-2", title: "Research & Citation Essentials", courseTitle: "Academic Skills Workshop", instructor: "Prof. Amara Okafor", issuedAt: daysFromNow(-36), credentialId: "LS-26-00307", score: 97, hours: 6 },
  ],
});

const readStored = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Could not read LearnNova data from local storage; using sample data.", error);
    return null;
  }
};

const courseIcon = (icon, size = 22) => {
  const icons = {
    code: Code2,
    globe: Globe2,
    database: Database,
    network: Network,
    brain: BrainCircuit,
    math: Target,
    library: BookMarked,
    design: PanelsTopLeft,
  };
  const Icon = icons[icon] || BookOpen;
  return <Icon size={size} strokeWidth={1.8} />;
};

const dateText = (date, options = { month: "short", day: "numeric" }) =>
  new Intl.DateTimeFormat("en", options).format(new Date(date));

const relativeDate = (date) => {
  const days = Math.ceil((new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
};

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
    } catch (error) {
      console.error("Could not read the LearnNova theme preference.", error);
      return "dark";
    }
  });
  const [store, setStore] = useState(() => {
    const saved = readStored();
    const defaults = seedData();
    const savedData = saved?.data;
    const savedUser = saved?.user;
    const user = savedUser?.email?.endsWith("@campusly.edu")
      ? { ...savedUser, email: savedUser.email.replace(/@campusly\.edu$/, "@learnnova.edu") }
      : savedUser || null;
    const defaultCourses = new Map(defaults.courses.map((course) => [course.id, course]));
    const savedCourses = savedData?.courses || defaults.courses;
    const migrationCourses = savedData && !savedData.learnSphereV2
      ? defaults.courses.filter((course) => ["math", "library", "design"].includes(course.id) && !savedCourses.some((savedCourse) => savedCourse.id === course.id))
      : [];
    const courses = [...savedCourses, ...migrationCourses].map((course) => ({
      ...course,
      rosterIds: course.rosterIds ?? defaultCourses.get(course.id)?.rosterIds ?? [],
    }));
    return {
      user,
      data: savedData ? { ...defaults, ...savedData, courses, learnSphereV2: true } : { ...defaults, learnSphereV2: true },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: store.user, data: store.data }));
    } catch (error) {
      console.error("Could not save LearnNova data to local storage.", error);
    }
  }, [store]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Could not save the LearnNova theme preference.", error);
    }
  }, [theme]);

  const updateData = (updater) => {
    setStore((current) => ({ ...current, data: typeof updater === "function" ? updater(current.data) : updater }));
  };

  const addActivity = (title, detail, icon = "book") => {
    updateData((data) => ({
      ...data,
      activity: [{ id: crypto.randomUUID(), title, detail, date: new Date().toISOString(), icon }, ...data.activity].slice(0, 8),
    }));
  };

  const login = (role) => {
    const user = role === "instructor"
      ? { id: "instructor", name: "Dr. Maya Patel", email: "instructor@learnnova.edu", role: "instructor", title: "Instructor" }
      : { id: "student", name: "Alex Morgan", email: "student@learnnova.edu", role: "student", title: "Computer Science · Year 2" };
    setStore((current) => ({ ...current, user }));
  };

  const logout = () => setStore((current) => ({ ...current, user: null }));
  const updateUser = (updates) => setStore((current) => ({ ...current, user: { ...current.user, ...updates } }));
  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

  return (
    <Routes>
      <Route path="/login" element={store.user ? <Navigate to="/app" replace /> : <LoginPage onLogin={login} />} />
      <Route path="/" element={<CampusHome user={store.user} data={store.data} theme={theme} onToggleTheme={toggleTheme} />} />
      <Route path="/campus" element={<CampusHome user={store.user} data={store.data} theme={theme} onToggleTheme={toggleTheme} />} />
      <Route element={store.user ? <AppLayout user={store.user} onLogout={logout} data={store.data} updateData={updateData} addActivity={addActivity} updateUser={updateUser} theme={theme} onToggleTheme={toggleTheme} /> : <Navigate to="/login" replace />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={store.user ? "/app" : "/"} replace />} />
    </Routes>
  );
}

function BrandLogo({ className = "" }) {
  return (
    <Link className={`brand ${className}`.trim()} to="/">
      <span className="brand-mark"><GraduationCap size={21} /></span>
      <span className="brand-lockup">
        <strong>LearnNova</strong>
        <small>LEARNNOVA UNIVERSITY</small>
        <span className="brand-tagline">Explore. Learn. Evolve.</span>
      </span>
    </Link>
  );
}

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("student@learnnova.edu");
  const [password, setPassword] = useState("learn123");
  const [error, setError] = useState("");

  const setSelectedRole = (nextRole) => {
    setRole(nextRole);
    setEmail(nextRole === "student" ? "student@learnnova.edu" : "instructor@learnnova.edu");
    setPassword(nextRole === "student" ? "learn123" : "teach123");
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const valid = role === "student"
      ? email === "student@learnnova.edu" && password === "learn123"
      : email === "instructor@learnnova.edu" && password === "teach123";
    if (!valid) {
      setError("Those credentials don't match the selected demo account.");
      return;
    }
    onLogin(role);
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-visual-inner">
          <BrandLogo className="brand-light" />
          <div className="login-quote">
            <span className="eyebrow eyebrow-light"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE</span>
            <h1>Learning that<br />moves you <em>forward.</em></h1>
            <p>A little progress each day adds up to big results. Find your focus, follow your curiosity, and make this semester yours.</p>
            <div className="login-visual-footer">
              <div className="avatar-stack">
                <span className="tiny-avatar tiny-one">JM</span><span className="tiny-avatar tiny-two">AK</span><span className="tiny-avatar tiny-three">RL</span><span className="tiny-avatar tiny-four">+</span>
              </div>
              <span>Join a community of curious minds</span>
            </div>
          </div>
          <span className="visual-orbit orbit-one" /><span className="visual-orbit orbit-two" />
          <div className="visual-card-float"><span className="float-icon"><TrendingUp size={18} /></span><span><b>You're on a roll</b><small>3 days of learning in a row</small></span><ArrowUpRight size={17} /></div>
        </div>
        <div className="login-visual-bottom"><span>© {new Date().getFullYear()} LearnNova University</span><span>Explore. Learn. Evolve. <Sparkles size={13} /></span></div>
      </section>
      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-mobile-brand"><BrandLogo /></div>
          <div className="login-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Your learning space is just a few clicks away.</p>
          </div>
          <div className="role-picker" aria-label="Select account type">
            <button type="button" className={role === "student" ? "role-option selected" : "role-option"} onClick={() => setSelectedRole("student")}><GraduationCap size={17} /> Student</button>
            <button type="button" className={role === "instructor" ? "role-option selected" : "role-option"} onClick={() => setSelectedRole("instructor")}><Users size={17} /> Instructor</button>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="login-email">Email address</label>
            <div className="input-with-icon"><Mail size={17} /><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></div>
            <div className="password-label"><label htmlFor="login-password">Password</label><button type="button" className="text-button">Forgot password?</button></div>
            <div className="input-with-icon"><LockKeyhole size={17} /><input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-primary login-submit" type="submit">Sign in <ArrowRight size={17} /></button>
          </form>
          <div className="demo-hint"><div className="demo-hint-icon"><CircleHelp size={17} /></div><div><b>Demo account ready</b><p>{role === "student" ? "student@learnnova.edu · learn123" : "instructor@learnnova.edu · teach123"}</p></div><CheckCircle2 size={17} className="demo-check" /></div>
          <p className="login-legal">By continuing, you agree to our <button className="text-button">Terms of Service</button> and <button className="text-button">Privacy Policy</button>.</p>
        </div>
      </section>
    </main>
  );
}

const primaryNavigation = [
  { label: "3D Campus", to: "/", icon: MapPin, public: true },
  { label: "Course Catalog", to: "/browse", icon: Search },
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Assignments", to: "/assignments", icon: FileText },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Certificates", to: "/certificates", icon: Award },
];

function TopNavigation({ user, data, theme, onToggleTheme, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const notifications = (data?.announcements || []).slice(0, 2);

  return (
    <header className="top-navigation">
      <BrandLogo />
      <nav className="main-nav-links" aria-label="Main navigation">
        {primaryNavigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `main-nav-link ${isActive ? "main-nav-link-active" : ""}`}>
            <Icon size={15} strokeWidth={1.8} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="top-navigation-actions">
        {user && <label className="top-search"><Search size={16} /><input aria-label="Search courses" placeholder="Search courses" onKeyDown={(event) => { if (event.key === "Enter") navigate(`/browse?q=${encodeURIComponent(event.currentTarget.value)}`); }} /></label>}
        <button className="icon-button theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        {user && <div className="notification-wrap">
          <button className={`icon-button notification-button ${notificationsOpen ? "icon-button-active" : ""}`} onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={18} />{notifications.length > 0 && <i />}</button>
          {notificationsOpen && <div className="notification-popover"><div className="popover-heading"><b>Announcements</b><Link to="/announcements">See all</Link></div>{notifications.length ? notifications.map((notice) => <div className="notification-item" key={notice.id}><span className="notification-dot" /><span><b>{notice.title}</b><small>{dateText(notice.date)}</small></span></div>) : <p className="notification-empty">You're all caught up.</p>}</div>}
        </div>}
        {user ? <div className="profile-menu-wrap">
          <button className="profile-menu-trigger" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}><span className="avatar">{initials(user.name)}</span><span className="profile-menu-copy"><b>{user.name}</b><small>{user.role === "instructor" ? "Instructor" : "Student"}</small></span><ChevronDown size={15} /></button>
          {profileOpen && <div className="profile-menu">
            <Link to="/profile" onClick={() => setProfileOpen(false)}><UserRound size={16} /> Profile</Link>
            <Link to={user.role === "student" ? "/grades" : "/announcements"} onClick={() => setProfileOpen(false)}>{user.role === "student" ? <Award size={16} /> : <MessageSquareText size={16} />}{user.role === "student" ? "Grades" : "Announcements"}</Link>
            <Link to="/settings" onClick={() => setProfileOpen(false)}><Settings size={16} /> Settings</Link>
            <button onClick={onLogout}><LogOut size={16} /> Sign out</button>
          </div>}
        </div> : <Link className="button button-primary nav-sign-in" to="/login">Sign in <ArrowRight size={15} /></Link>}
      </div>
    </header>
  );
}

function AppLayout({ user, onLogout, data, updateData, addActivity, updateUser, theme, onToggleTheme }) {
  return (
    <div className="app-shell">
      <TopNavigation user={user} data={data} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />
      <main className="page-content"><Outlet context={{ user, data, updateData, addActivity, updateUser, theme, onToggleTheme }} /></main>
      <footer className="app-footer"><span>© {new Date().getFullYear()} LearnNova University</span><Link to="/">Return to the 3D campus <ArrowRight size={14} /></Link></footer>
    </div>
  );
}

function CampusHome({ user, data, theme, onToggleTheme }) {
  const [selectedId, setSelectedId] = useState(departments[0].id);
  const selected = departments.find((department) => department.id === selectedId) || departments[0];
  const Icon = selected.icon;
  const matchingCourse = data.courses.find((course) => course.title === selected.courseQuery);
  const catalogHref = user ? `/browse?q=${encodeURIComponent(selected.courseQuery)}` : "/login";

  return (
    <div className="campus-home">
      <TopNavigation user={user} data={data} theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <section className="campus-hero">
          <div className="campus-hero-copy">
            <span className="campus-kicker"><span /> VIRTUAL UNIVERSITY CAMPUS 3.0</span>
            <h1>Explore the LearnNova<br /><em>Learning Universe</em></h1>
            <p>Step into our interactive 3D digital campus. Select an architectural department building to explore accredited curricula, research faculties, and dynamic classrooms.</p>
            <div className="campus-hero-meta"><span><MapPin size={14} /> A university without boundaries</span><span className="campus-meta-divider" /><span>EST. 2026 · LEARNNOVA UNIVERSITY</span></div>
          </div>
          <div className="campus-scene-shell">
            <div className="campus-scene-topline"><span><span className="scene-live-dot" /> CAMPUS MODEL · INTERACTIVE</span><span>MOVE TO EXPLORE</span></div>
            <div className="campus-scene-viewport">
              <Suspense fallback={<div className="campus-scene-loading">Preparing the LearnNova campus…</div>}>
                <CampusScene departments={departments} selectedId={selectedId} onSelect={setSelectedId} />
              </Suspense>
              <div className="scene-interaction-hint"><MousePointer2 size={14} /> Select a building to explore</div>
            </div>
            <article className="department-spotlight" style={{ "--department-accent": selected.accent }}>
              <span className="department-number">{selected.shortLabel}</span>
              <div className="department-title"><span className="department-icon"><Icon size={18} /></span><h2>{selected.name}</h2></div>
              <p>{selected.description}</p>
              <div className="department-course"><span>FEATURED COURSE</span><b>{matchingCourse?.title || selected.featuredCourse}</b><small><Timer size={13} /> {matchingCourse?.duration || selected.duration}</small></div>
              <Link className="department-link" to={catalogHref}>Explore department <ArrowRight size={15} /></Link>
            </article>
            <div className="campus-department-rail" aria-label="Select a university department">
              {departments.map((department, index) => {
                const DepartmentIcon = department.icon;
                return <button type="button" className={`campus-department-tab ${selected.id === department.id ? "campus-tab-active" : ""}`} key={department.id} onClick={() => setSelectedId(department.id)} aria-pressed={selected.id === department.id}>
                  <span className="department-tab-index">0{index + 1}</span><DepartmentIcon size={16} /><span>{department.name}</span>
                </button>;
              })}
            </div>
          </div>
        </section>
        <section className="campus-bottom-strip"><div><span className="eyebrow">LEARN WITH PURPOSE</span><p>Five distinct departments. One connected learning universe.</p></div><Link to={user ? "/browse" : "/login"}>Discover the course catalog <ArrowRight size={15} /></Link></section>
      </main>
      <footer className="campus-footer"><span>© {new Date().getFullYear()} LearnNova University</span><span>Explore. Learn. Evolve.</span></footer>
    </div>
  );
}

function AnalyticsPage() {
  const { user, data } = useLms();
  const courses = user.role === "instructor" ? data.courses : data.courses.filter((course) => course.enrolled);
  const submissions = data.submissions.filter((submission) => user.role === "instructor" || submission.studentId === user.id);
  const graded = submissions.filter((submission) => submission.marks !== null);
  const average = graded.length ? Math.round(graded.reduce((total, submission) => {
    const assignment = data.assignments.find((item) => item.id === submission.assignmentId);
    return total + submission.marks / (assignment?.maxMarks || 100) * 100;
  }, 0) / graded.length) : 0;
  const hours = data.studyHours || [];
  const weeklyHours = hours.reduce((total, item) => total + item.hours, 0);
  const completion = courses.length ? Math.round(courses.reduce((total, course) => total + Number(course.progress || 0), 0) / courses.length) : 0;

  return <div className="analytics-page">
    <PageHeading eyebrow="YOUR LEARNING, IN PERSPECTIVE" title="Study analytics" description="A clear view of your study rhythm, progress, and academic performance." />
    <section className="analytics-overview">
      <div className="analytics-primary-stat"><span className="analytics-label"><Timer size={15} /> STUDY TIME THIS WEEK</span><b>{weeklyHours.toFixed(1)}<small> hrs</small></b><span className="analytics-stat-note">Across your active learning week</span><div className="analytics-mini-bars">{hours.map((day) => <span key={day.day} title={`${day.hours} hours on ${day.day}`} style={{ height: `${Math.max(14, day.hours / Math.max(...hours.map((item) => item.hours), 1) * 100)}%` }} />)}</div></div>
      <div className="analytics-progress-stat"><div className="analytics-progress-ring" style={{ "--progress": `${completion}%` }}><span>{completion}<small>%</small></span></div><div><span className="analytics-label">COURSE COMPLETION</span><b>{courses.length} active courses</b><span className="analytics-stat-note">Average progress across your courses</span></div></div>
      <div className="analytics-grade-stat"><span className="analytics-label"><Award size={15} /> ACADEMIC AVERAGE</span><b>{average}<small>%</small></b><span className="analytics-stat-note">{graded.length ? `${graded.length} graded submissions` : "Grades appear as work is reviewed"}</span><div className="grade-indicator"><span style={{ width: `${average}%` }} /></div></div>
    </section>
    <div className="analytics-content-grid">
      <section className="panel analytics-chart-panel"><div className="panel-heading"><div><span className="eyebrow">WEEKLY RHYTHM</span><h2>Study hours</h2></div><span className="chart-period"><span /> Last 7 days</span></div><div className="study-chart">{hours.map((day) => <div className="study-chart-column" key={day.day}><span className="study-chart-hours">{day.hours.toFixed(1)}h</span><div className="study-chart-track"><span style={{ height: `${Math.max(7, day.hours / Math.max(...hours.map((item) => item.hours), 1) * 100)}%` }} /></div><small>{day.day}</small></div>)}</div></section>
      <section className="panel analytics-streak-panel"><div className="panel-heading"><div><span className="eyebrow">CONSISTENCY BUILDS MASTERY</span><h2>Your study streak</h2></div><Flame size={18} /></div><div className="streak-number">{data.studyStreak || 0}<span> days</span></div><p>Small, focused sessions add up. Keep showing up for your goals.</p><div className="streak-week">{hours.map((day, index) => <span key={day.day} className={index < Math.min(data.studyStreak || 0, 7) ? "streak-day-active" : ""}>{day.day.slice(0, 1)}</span>)}</div></section>
    </div>
    <section className="analytics-courses"><div className="section-heading"><div><span className="eyebrow">COURSE BY COURSE</span><h2>Learning progress</h2></div><Link className="subtle-link" to="/courses">View courses <ArrowRight size={14} /></Link></div>{courses.length ? courses.map((course) => <div className="analytics-course-row" key={course.id}><div className={`analytics-course-mark cover-${course.color || "blue"}`}>{courseIcon(course.icon, 17)}</div><div className="analytics-course-name"><b>{course.title}</b><span>{course.instructor}</span></div><div className="analytics-course-track"><span style={{ width: `${course.progress || 0}%` }} /></div><strong>{course.progress || 0}%</strong></div>) : <EmptyState icon={BookOpen} title="Your progress starts with a course" text="Browse the catalog and enroll to see your learning analytics." action={<Link className="button button-primary" to="/browse">Browse courses <ArrowRight size={15} /></Link>} />}</section>
  </div>;
}

function CertificatesPage() {
  const { data } = useLms();
  const certificates = data.certificates || [];

  const downloadCertificate = (certificate) => {
    const escapeXml = (value) => String(value).replace(/[<>&'"]/g, (character) => ({
      "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;",
    })[character]);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850"><rect width="1200" height="850" fill="#0b1220"/><rect x="34" y="34" width="1132" height="782" fill="none" stroke="#73899a" stroke-width="2"/><rect x="52" y="52" width="1096" height="746" fill="none" stroke="#263b4b" stroke-width="1"/><text x="600" y="170" text-anchor="middle" fill="#8ca0ae" font-family="Arial,sans-serif" font-size="18" letter-spacing="7">LEARNNOVA UNIVERSITY</text><text x="600" y="295" text-anchor="middle" fill="#f3f5f6" font-family="Georgia,serif" font-size="52">Certificate of Achievement</text><text x="600" y="380" text-anchor="middle" fill="#94a7b3" font-family="Arial,sans-serif" font-size="21">This certificate is awarded for the successful completion of</text><text x="600" y="465" text-anchor="middle" fill="#6ec2d5" font-family="Georgia,serif" font-size="40">${escapeXml(certificate.title)}</text><text x="600" y="540" text-anchor="middle" fill="#d4dce0" font-family="Arial,sans-serif" font-size="20">${escapeXml(certificate.courseTitle)} · ${certificate.score}%</text><text x="600" y="645" text-anchor="middle" fill="#8496a4" font-family="Arial,sans-serif" font-size="17">Issued ${escapeXml(dateText(certificate.issuedAt, { month: "long", day: "numeric", year: "numeric" }))} · Credential ${escapeXml(certificate.credentialId)}</text><text x="600" y="730" text-anchor="middle" fill="#8496a4" font-family="Arial,sans-serif" font-size="15">Explore. Learn. Evolve.</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${certificate.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-certificate.svg`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return <div className="certificates-page">
    <PageHeading eyebrow="RECOGNITION OF YOUR WORK" title="Certificates" description="A record of the skills and ideas you've taken further." />
    <div className="certificate-summary"><div className="certificate-summary-mark"><Award size={21} /></div><div><b>{certificates.length} credentials earned</b><span>Share your achievements or save a keepsake.</span></div><span className="certificate-summary-count">{String(certificates.length).padStart(2, "0")} <small>AWARDED</small></span></div>
    {certificates.length ? <div className="certificate-grid">{certificates.map((certificate) => <article className="certificate-card" key={certificate.id}>
      <div className="certificate-preview"><div className="certificate-preview-inner"><span className="certificate-wordmark">LEARNNOVA UNIVERSITY</span><span className="certificate-seal"><Award size={25} /></span><span className="certificate-preview-label">CERTIFICATE OF ACHIEVEMENT</span><b>{certificate.title}</b><span className="certificate-preview-course">{certificate.courseTitle}</span><span className="certificate-preview-rule" /><small>{certificate.score}% · {certificate.hours} learning hours</small></div></div>
      <div className="certificate-details"><div><h2>{certificate.title}</h2><p>{certificate.courseTitle} <span>·</span> Issued {dateText(certificate.issuedAt, { month: "short", day: "numeric", year: "numeric" })}</p></div><button className="button button-outline" onClick={() => downloadCertificate(certificate)}><Download size={15} /> Download</button><span className="certificate-credential">CREDENTIAL ID <b>{certificate.credentialId}</b></span></div>
    </article>)}</div> : <EmptyState icon={Award} title="Your first certificate is ahead" text="Complete a course or workshop to earn a certificate that reflects your progress." action={<Link className="button button-primary" to="/browse">Explore courses <ArrowRight size={15} /></Link>} />}
    <div className="certificate-note"><ShieldCheck size={17} /><span>Each credential includes a unique ID and can be verified by LearnNova University.</span></div>
  </div>;
}

function useLms() {
  return useOutletContext();
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Dashboard() {
  const { user, data } = useLms();
  const isInstructor = user.role === "instructor";
  const firstName = isInstructor ? user.name.replace(/^(Dr\.|Prof\.)\s*/, "").split(" ")[0] : user.name.split(" ")[0];
  const myCourses = isInstructor ? data.courses : data.courses.filter((course) => course.enrolled);
  const myAssignments = data.assignments.filter((assignment) => isInstructor || myCourses.some((course) => course.id === assignment.courseId));
  const mySubmissions = data.submissions.filter((submission) => submission.studentId === user.id);
  const pending = myAssignments.filter((assignment) => !mySubmissions.some((submission) => submission.assignmentId === assignment.id));
  const completed = mySubmissions.length;
  const graded = mySubmissions.filter((submission) => submission.marks !== null);
  const instructorGraded = data.submissions.filter((submission) => submission.marks !== null);
  const instructorAverage = instructorGraded.length ? Math.round(instructorGraded.reduce((total, submission) => {
    const assignment = data.assignments.find((item) => item.id === submission.assignmentId);
    return total + submission.marks / (assignment?.maxMarks || 100) * 100;
  }, 0) / instructorGraded.length) : 0;
  const average = graded.length ? Math.round(graded.reduce((total, submission) => {
    const assignment = data.assignments.find((item) => item.id === submission.assignmentId);
    return total + submission.marks / (assignment?.maxMarks || 100) * 100;
  }, 0) / graded.length) : 0;
  const upcoming = myAssignments.filter((assignment) => new Date(assignment.dueDate) >= new Date()).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3);
  const recent = data.activity.slice(0, 4);

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome"><div className="welcome-copy"><span className="eyebrow eyebrow-light"><Sparkles size={14} /> YOUR LEARNING SPACE</span><h1>{isInstructor ? (new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening") : "Welcome back"},<br /><em>{firstName}.</em></h1><p>{isInstructor ? "Here's what's happening across your courses today." : "Every step forward is progress. Here's what's happening with your learning."}</p><Link className="welcome-button" to={isInstructor ? "/courses" : "/browse"}>{isInstructor ? "Manage your courses" : "Explore courses"} <ArrowRight size={16} /></Link></div><div className="welcome-art" aria-hidden="true"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-planet"><GraduationCap size={43} strokeWidth={1.35} /></div><div className="art-spark art-spark-one">✦</div><div className="art-spark art-spark-two">✧</div><span className="art-caption">learn at<br />your pace</span></div><div className="welcome-index"><span>01</span><span className="index-line" /><span>04</span></div></div>
      <div className="dashboard-meta"><span><CalendarDays size={15} /> {dateText(new Date(), { weekday: "long", month: "long", day: "numeric" })}</span><span className="meta-divider" /><span className="semester-tag"><span /> Fall semester · {new Date().getFullYear()}</span></div>
      <div className="stats-grid">
        <StatCard label={isInstructor ? "Active courses" : "Enrolled courses"} value={myCourses.length} hint={isInstructor ? `${data.courses.reduce((total, course) => total + Number(course.students || 0), 0)} students enrolled` : "Keep up your momentum"} icon={BookOpen} theme="blue" trend={<><ArrowUpRight size={14} /> +2 this month</>} />
        <StatCard label={isInstructor ? "To review" : "Pending assignments"} value={isInstructor ? data.submissions.filter((submission) => submission.marks === null).length : pending.length} hint={isInstructor ? "Submissions need your feedback" : "A little at a time goes far"} icon={Clock3} theme="amber" trend={<><span className="trend-dot" /> {isInstructor ? "Ready when you are" : `${pending.length} coming up`}</>} />
        <StatCard label={isInstructor ? "Submissions graded" : "Completed assignments"} value={isInstructor ? data.submissions.filter((submission) => submission.marks !== null).length : completed} hint={isInstructor ? "Across all your courses" : "You're building great habits"} icon={CheckCircle2} theme="mint" trend={<><ArrowUpRight size={14} /> +3 this week</>} />
        <StatCard label={isInstructor ? "Course average" : "Average grade"} value={isInstructor ? `${instructorAverage}%` : `${average}%`} hint={isInstructor ? "Across graded submissions" : graded.length ? "Looking good — keep going" : "Grades appear after review"} icon={TrendingUp} theme="purple" trend={<><ArrowUpRight size={14} /> {graded.length ? "+4.2% this term" : "Your progress"}</>} />
      </div>
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">KEEP THE MOMENTUM</span><h2>{isInstructor ? "Your courses" : "Pick up where you left off"}</h2></div><Link to={isInstructor ? "/courses" : "/courses"} className="subtle-link">View all <ArrowRight size={15} /></Link></div>
        <div className="course-grid dashboard-course-grid">{myCourses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} compact />)}</div>
      </section>
      <div className="dashboard-lower">
        <section className="panel recent-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR JOURNEY</span><h2>Recent activity</h2></div><button className="icon-button" aria-label="More activity"><MoreHorizontal size={20} /></button></div><div className="activity-list">{recent.map((item, index) => <ActivityItem key={item.id} item={item} last={index === recent.length - 1} />)}</div><button className="panel-footer-button">See all activity <ArrowRight size={15} /></button></section>
        <section className="panel deadlines-panel"><div className="panel-heading"><div><span className="eyebrow">PLAN AHEAD</span><h2>Upcoming deadlines</h2></div><Link to="/assignments" className="mini-calendar-link"><CalendarDays size={17} /></Link></div>{upcoming.length ? <div className="deadline-list">{upcoming.map((assignment) => {
          const course = data.courses.find((item) => item.id === assignment.courseId);
          const done = mySubmissions.some((submission) => submission.assignmentId === assignment.id);
          return <div className="deadline-item" key={assignment.id}><div className={`deadline-date ${new Date(assignment.dueDate) - new Date() < 3 * 86400000 ? "deadline-soon" : ""}`}><b>{dateText(assignment.dueDate, { day: "2-digit" })}</b><span>{dateText(assignment.dueDate, { month: "short" })}</span></div><div className="deadline-copy"><b>{assignment.title}</b><span>{course?.title || "Course"} · {relativeDate(assignment.dueDate)}</span></div>{done ? <CheckCircle2 size={17} className="deadline-done" /> : <ChevronRight size={17} className="deadline-arrow" />}</div>;
        })}</div> : <EmptyState icon={CheckCircle2} title="You're all caught up" text="No upcoming deadlines right now." /> }<Link to="/assignments" className="panel-footer-button">View assignment planner <ArrowRight size={15} /></Link></section>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, icon: Icon, theme, trend }) {
  return <div className="stat-card"><div className={`stat-icon stat-${theme}`}><Icon size={19} strokeWidth={1.8} /></div><span className="stat-trend">{trend}</span><p className="stat-label">{label}</p><div className="stat-value">{value}</div><span className="stat-hint">{hint}</span></div>;
}

function ActivityItem({ item, last }) {
  const icon = item.icon === "check" ? <Check size={16} /> : item.icon === "award" ? <Award size={16} /> : <BookOpen size={16} />;
  return <div className="activity-item"><div className={`activity-icon activity-${item.icon}`}>{icon}</div><div className="activity-copy"><b>{item.title}</b><span>{item.detail}</span></div><time>{relativeDate(item.date)}</time>{!last && <span className="activity-line" />}</div>;
}

function EmptyState({ icon: Icon = BookOpen, title, text, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

function CourseCard({ course, compact = false, onAction, actionLabel, actionIcon, onOpen, showProgress = true }) {
  return <article className={`course-card ${compact ? "course-card-compact" : ""}`} onClick={onOpen} role={onOpen ? "button" : undefined} tabIndex={onOpen ? 0 : undefined} onKeyDown={(event) => { if (onOpen && (event.key === "Enter" || event.key === " ")) onOpen(); }}>
    <div className={`course-cover cover-${course.color || "blue"}`}><span className="cover-category">{course.category}</span><div className="cover-illustration">{courseIcon(course.icon, compact ? 32 : 39)}</div><span className="cover-duration"><Clock3 size={12} /> {course.duration}</span><span className="cover-ornament ornament-a" /><span className="cover-ornament ornament-b" /></div>
    <div className="course-card-body"><div className="course-title-line"><h3>{course.title}</h3><button className="card-more icon-button" aria-label={`More options for ${course.title}`} onClick={(event) => event.stopPropagation()}><MoreHorizontal size={19} /></button></div><p>{course.description}</p><div className="course-instructor"><span className="instructor-avatar">{initials(course.instructor)}</span><span>{course.instructor}</span></div>
      {showProgress && course.enrolled && <div className="course-progress"><div className="progress-label"><span>Course progress</span><b>{course.progress || 0}%</b></div><div className="progress-track"><span style={{ width: `${course.progress || 0}%` }} /></div></div>}
      <div className="course-card-bottom"><span className="course-students"><Users size={14} /> {course.students || 0} students</span>{onAction && <button className={`course-action ${actionLabel === "Enrolled" ? "course-action-done" : ""}`} onClick={(event) => { event.stopPropagation(); onAction(course); }}>{actionIcon || <ArrowRight size={15} />} {actionLabel}</button>}</div>
    </div>
  </article>;
}

function CoursesPage() {
  const { user, data, updateData } = useLms();
  const [dialog, setDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const mine = user.role === "instructor" ? data.courses : data.courses.filter((course) => course.enrolled);
  const removeCourse = (course) => {
    if (!window.confirm(`Delete "${course.title}"? This will also remove its assignments and submissions.`)) return;
    updateData((current) => ({ ...current, courses: current.courses.filter((item) => item.id !== course.id), assignments: current.assignments.filter((item) => item.courseId !== course.id), submissions: current.submissions.filter((submission) => current.assignments.some((assignment) => assignment.id === submission.assignmentId && assignment.courseId !== course.id)) }));
  };
  const saveCourse = (course) => {
    updateData((current) => ({
      ...current,
      courses: course.id ? current.courses.map((item) => item.id === course.id ? { ...item, ...course } : item) : [...current.courses, { ...course, id: crypto.randomUUID(), students: 0, rosterIds: [], enrolled: false, progress: 0 }],
    }));
    setDialog(null);
  };

  return <>
    <PageHeading eyebrow={user.role === "instructor" ? "COURSE MANAGEMENT" : "YOUR LEARNING"} title={user.role === "instructor" ? "My courses" : "My courses"} description={user.role === "instructor" ? "Create, update, and keep an eye on your courses." : "Your learning journey, all in one place."} action={user.role === "instructor" ? <button className="button button-primary" onClick={() => setDialog({ mode: "create" })}><Plus size={17} /> Create course</button> : <Link className="button button-primary" to="/browse"><Plus size={17} /> Find a course</Link>} />
    {user.role === "instructor" && <div className="management-summary"><div className="summary-icon"><BookOpen size={20} /></div><div><b>{data.courses.length} active courses</b><span>Across your learning catalog</span></div><div className="summary-divider" /><div><b>{data.courses.reduce((sum, course) => sum + Number(course.students || 0), 0)} learners</b><span>Learning with you</span></div><div className="summary-action"><button className="button button-outline" onClick={() => setDialog({ mode: "create" })}><Plus size={16} /> New course</button></div></div>}
    {mine.length ? <div className="course-grid course-page-grid">{mine.map((course) => <div className="managed-course-wrap" key={course.id}><CourseCard course={course} onOpen={() => setSelected(course)} onAction={user.role === "instructor" ? () => setDialog({ mode: "edit", course }) : undefined} actionLabel={user.role === "instructor" ? "Edit course" : "Continue learning"} actionIcon={user.role === "instructor" ? <Pencil size={14} /> : <ArrowRight size={15} />} /><div className="managed-actions"><span>{user.role === "instructor" ? `${data.assignments.filter((item) => item.courseId === course.id).length} assignments` : `${course.modules.length} modules`}</span>{user.role === "instructor" && <><button className="roster-button" onClick={() => setSelected(course)}><Users size={13} /> View students</button><button className="danger-text-button" onClick={() => removeCourse(course)}><Trash2 size={14} /> Delete</button></>}</div></div>)}</div> : <EmptyState icon={BookOpen} title="Your learning starts here" text="Browse the catalog and enroll in a course that sparks your curiosity." action={<Link className="button button-primary" to="/browse">Browse courses <ArrowRight size={16} /></Link>} />}
    {dialog && <CourseFormDialog course={dialog.course} onClose={() => setDialog(null)} onSave={saveCourse} />}
    {selected && <CourseDetailDialog course={selected} showStudents={user.role === "instructor"} onClose={() => setSelected(null)} />}
  </>;
}

function CourseFormDialog({ course, onClose, onSave }) {
  const [form, setForm] = useState(() => course ? { ...course, materialText: course.materials.join("\n"), moduleText: course.modules.join("\n") } : { title: "", description: "", instructor: "Dr. Maya Patel", category: "Programming", duration: "6 weeks", color: "blue", icon: "code", students: 0, rosterIds: [], enrolled: false, progress: 0, materialText: "", moduleText: "" });
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError("Add a course title and description to continue."); return; }
    onSave({ ...form, materials: form.materialText.split("\n").map((item) => item.trim()).filter(Boolean), modules: form.moduleText.split("\n").map((item) => item.trim()).filter(Boolean) });
  };
  const addFileName = (event) => {
    const file = event.target.files?.[0];
    if (file) change("materialText", `${form.materialText}${form.materialText ? "\n" : ""}${file.name}`);
  };
  return <Modal title={course ? "Edit course" : "Create a course"} subtitle="Set up the details your students will see." onClose={onClose} wide><form className="dialog-form" onSubmit={submit}>
    <div className="form-grid"><div className="form-field form-full"><label>Course title</label><input autoFocus value={form.title} onChange={(event) => change("title", event.target.value)} placeholder="e.g. Introduction to Data Science" required /></div>
      <div className="form-field form-full"><label>Description</label><textarea rows="3" value={form.description} onChange={(event) => change("description", event.target.value)} placeholder="What will students learn in this course?" required /></div>
      <div className="form-field"><label>Instructor</label><input value={form.instructor} onChange={(event) => change("instructor", event.target.value)} /></div><div className="form-field"><label>Duration</label><input value={form.duration} onChange={(event) => change("duration", event.target.value)} placeholder="e.g. 8 weeks" /></div>
      <div className="form-field"><label>Category</label><select value={form.category} onChange={(event) => change("category", event.target.value)}>{["Programming", "Development", "Data", "Technology", "Design", "Business"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="form-field"><label>Course color</label><select value={form.color} onChange={(event) => change("color", event.target.value)}>{["blue", "purple", "mint", "coral", "amber"].map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></div>
      <div className="form-field form-full"><div className="label-with-action"><label>Learning materials</label><button type="button" className="text-button" onClick={() => fileRef.current?.click()}><Upload size={14} /> Add a file</button></div><textarea rows="2" value={form.materialText} onChange={(event) => change("materialText", event.target.value)} placeholder="Add material names, one per line" /><input ref={fileRef} type="file" className="visually-hidden" onChange={addFileName} /></div>
      <div className="form-field form-full"><label>Modules or lessons</label><textarea rows="3" value={form.moduleText} onChange={(event) => change("moduleText", event.target.value)} placeholder={"One module per line\nCourse introduction\nCore concepts"} /></div>
    </div>
    {error && <p className="form-error">{error}</p>}<div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{course ? "Save changes" : "Create course"} <ArrowRight size={16} /></button></div>
  </form></Modal>;
}

function CourseDetailDialog({ course, onClose, showStudents = false }) {
  const students = (course.rosterIds || []).map((id) => sampleStudentDirectory[id]).filter(Boolean);
  return (
    <Modal title={course.title} subtitle={`${course.category} · ${course.duration} · ${course.instructor}`} onClose={onClose} wide>
      <div className={`detail-cover cover-${course.color}`}>{courseIcon(course.icon, 44)}<p>{course.description}</p></div>
      <div className="detail-columns">
        <section>
          <h3>Course modules</h3>
          {course.modules.map((module, index) => <div className="module-row" key={module}><span className="module-number">{String(index + 1).padStart(2, "0")}</span><span>{module}</span><ChevronRight size={16} /></div>)}
        </section>
        <section>
          <h3>Learning materials</h3>
          {course.materials.length ? course.materials.map((material) => <div className="material-row" key={material}><span className="material-icon"><FileText size={16} /></span><span>{material}</span></div>) : <p className="muted-copy">No materials have been added yet.</p>}
          <p className="material-note"><CircleHelp size={14} /> Materials are available to enrolled students.</p>
        </section>
      </div>
      {showStudents && <section className="roster-section"><div className="roster-heading"><div><h3>Enrolled students</h3><span>{course.students || 0} learners · showing sample roster</span></div><Users size={17} /></div>{students.length ? <div className="roster-list">{students.map((student) => <div className="roster-row" key={student.email}><span className="avatar avatar-small">{initials(student.name)}</span><span className="roster-person"><b>{student.name}</b><small>{student.email}</small></span><span className="roster-program">{student.program}</span></div>)}</div> : <p className="muted-copy">No students are enrolled in this course yet.</p>}</section>}
      <div className="dialog-actions"><button className="button button-outline" onClick={onClose}>Close</button></div>
    </Modal>
  );
}

function BrowsePage() {
  const { data, user, updateData, addActivity } = useLms();
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All courses");
  const [selected, setSelected] = useState(null);
  const categories = ["All courses", ...new Set(data.courses.map((course) => course.category))];
  const filtered = data.courses.filter((course) => (category === "All courses" || course.category === category) && `${course.title} ${course.description} ${course.instructor}`.toLowerCase().includes(query.toLowerCase()));
  const enroll = (course) => {
    if (course.enrolled) return;
    updateData((current) => ({ ...current, courses: current.courses.map((item) => item.id === course.id ? { ...item, enrolled: true, progress: 0, students: Number(item.students || 0) + 1, rosterIds: [...new Set([...(item.rosterIds || []), user.id])] } : item) }));
    addActivity("You enrolled in a new course", course.title);
  };
  return <>
    <PageHeading eyebrow="THE COURSE CATALOG" title="Find your next thing." description="Explore topics, build skills, and follow your curiosity." />
    <div className="browse-toolbar"><label className="browse-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, topics, or instructors..." /></label><div className="filter-control"><Filter size={16} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div></div>
    <div className="browse-results-line"><span><b>{filtered.length}</b> {filtered.length === 1 ? "course" : "courses"} to explore</span><span className="browse-sort">Sorted by <b>Recommended</b> <ChevronDown size={14} /></span></div>
    {filtered.length ?     <div className="course-grid browse-grid">{filtered.map((course) => <CourseCard key={course.id} course={course} showProgress={false} onOpen={() => setSelected(course)} onAction={() => course.enrolled ? setSelected(course) : enroll(course)} actionLabel={course.enrolled ? "View course" : "Enroll now"} actionIcon={course.enrolled ? <BookOpen size={15} /> : <ArrowRight size={15} />} />)}</div> : <EmptyState icon={Search} title="No courses found" text="Try a different search or category." action={<button className="button button-outline" onClick={() => { setQuery(""); setCategory("All courses"); }}>Clear filters</button>} />}
    <div className="catalog-note"><Sparkles size={16} /><span>New courses are added throughout the semester. Check back soon for something that inspires you.</span></div>
    {selected && <CourseDetailDialog course={selected} onClose={() => setSelected(null)} />}
  </>;
}

function AssignmentsPage() {
  const { user, data, updateData, addActivity } = useLms();
  const isInstructor = user.role === "instructor";
  const enrolled = data.courses.filter((course) => course.enrolled);
  const assignments = data.assignments.filter((assignment) => isInstructor || enrolled.some((course) => course.id === assignment.courseId)).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState("All");
  const [reviewing, setReviewing] = useState(null);
  const mySubmissions = data.submissions.filter((submission) => submission.studentId === user.id);
  const submissionFor = (assignment) => mySubmissions.find((submission) => submission.assignmentId === assignment.id);
  const filtered = assignments.filter((assignment) => {
    if (isInstructor && tab === "Needs review") return data.submissions.some((submission) => submission.assignmentId === assignment.id && submission.marks === null);
    if (tab === "Upcoming") return new Date(assignment.dueDate) >= new Date();
    if (tab === "Submitted") return Boolean(submissionFor(assignment));
    if (tab === "Past due") return new Date(assignment.dueDate) < new Date() && !submissionFor(assignment);
    return true;
  });
  const submitAssignment = (assignment, answer, fileName) => {
    updateData((current) => ({ ...current, submissions: [...current.submissions, { id: crypto.randomUUID(), assignmentId: assignment.id, student: user.name, studentId: user.id, answer, fileName, submittedAt: new Date().toISOString(), marks: null, feedback: "" }] }));
    addActivity("Assignment submitted", assignment.title, "check");
  };
  const saveGrade = (submission, marks, feedback) => {
    updateData((current) => ({ ...current, submissions: current.submissions.map((item) => item.id === submission.id ? { ...item, marks: Number(marks), feedback } : item) }));
    setReviewing(null);
  };
  const removeAssignment = (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}" and its submissions?`)) return;
    updateData((current) => ({ ...current, assignments: current.assignments.filter((item) => item.id !== assignment.id), submissions: current.submissions.filter((item) => item.assignmentId !== assignment.id) }));
  };
  const createAssignment = (assignment) => {
    updateData((current) => ({ ...current, assignments: [...current.assignments, { ...assignment, id: crypto.randomUUID() }] }));
    setDialogOpen(false);
  };

  return <>
    <PageHeading eyebrow={isInstructor ? "TEACHING TOOLS" : "STAY ON TRACK"} title={isInstructor ? "Assignments" : "Your assignments"} description={isInstructor ? "Create work for your courses and give students meaningful feedback." : "All your coursework and deadlines, in one clear view."} action={isInstructor ? <button className="button button-primary" onClick={() => setDialogOpen(true)}><Plus size={17} /> Create assignment</button> : <div className="assignment-summary-chip"><Clock3 size={16} /><b>{assignments.filter((item) => !submissionFor(item) && new Date(item.dueDate) >= new Date()).length}</b> to complete</div>} />
    <div className="assignment-tabs">{(isInstructor ? ["All", "Needs review"] : ["All", "Upcoming", "Submitted", "Past due"]).map((label) => <button key={label} onClick={() => setTab(label)} className={`assignment-tab ${tab === label ? "assignment-tab-active" : ""}`}>{label}{label === "Needs review" && <span className="tab-count">{data.submissions.filter((item) => item.marks === null).length}</span>}</button>)}</div>
    <div className="assignment-list">{filtered.map((assignment) => {
      const course = data.courses.find((item) => item.id === assignment.courseId);
      const submission = submissionFor(assignment);
      const late = new Date(assignment.dueDate) < new Date() && !submission;
      const reviewed = submission?.marks !== null && submission?.marks !== undefined;
      return <article className={`assignment-card ${late ? "assignment-card-late" : ""}`} key={assignment.id}>
        <div className={`assignment-course-icon cover-${course?.color || "blue"}`}>{courseIcon(course?.icon || "code", 22)}</div>
        <div className="assignment-main"><div className="assignment-topline"><span className="assignment-course-label">{course?.title || "Course"}</span><span className={`status-pill ${late ? "status-red" : reviewed ? "status-green" : submission ? "status-blue" : "status-amber"}`}>{late ? "Past due" : reviewed ? "Graded" : submission ? "Submitted" : "To do"}</span></div><h3>{assignment.title}</h3><p>{assignment.description}</p><div className="assignment-meta"><span className={late ? "late-copy" : ""}><CalendarDays size={14} /> Due {dateText(assignment.dueDate, { month: "long", day: "numeric" })} · {relativeDate(assignment.dueDate)}</span><span><Target size={14} /> {assignment.maxMarks} points</span></div>
          {isInstructor ? <div className="submission-block"><div className="submission-block-heading"><b>Student submissions</b><span>{data.submissions.filter((item) => item.assignmentId === assignment.id).length} submitted</span></div>{data.submissions.filter((item) => item.assignmentId === assignment.id).length ? data.submissions.filter((item) => item.assignmentId === assignment.id).map((item) => <div className="submission-row" key={item.id}><div className="avatar avatar-small">{initials(item.student)}</div><div className="submission-student"><b>{item.student}</b><span>Submitted {relativeDate(item.submittedAt)}</span></div>{item.marks !== null ? <span className="graded-score">{item.marks}/{assignment.maxMarks}</span> : <span className="status-pill status-amber">Needs review</span>}<button className="button button-outline button-small" onClick={() => setReviewing({ submission: item, assignment })}>{item.marks !== null ? "View / edit grade" : "Review"} <ArrowRight size={14} /></button></div>) : <p className="muted-copy">No submissions yet. Students' work will appear here.</p>}</div> :
            <div className="student-submission-area">{submission ? <div className={`submission-result ${reviewed ? "result-graded" : ""}`}><div className="result-symbol">{reviewed ? <Award size={18} /> : <CheckCircle2 size={18} />}</div><div className="result-copy"><b>{reviewed ? `Graded · ${submission.marks} / ${assignment.maxMarks}` : "Your work is submitted"}</b><span>{reviewed ? submission.feedback || "Your instructor has graded this assignment." : `Submitted ${relativeDate(submission.submittedAt)} · Waiting for instructor review`}</span>{submission.fileName && <span className="file-chip"><FileText size={13} /> {submission.fileName}</span>}</div><span className="result-check"><CheckCircle2 size={17} /></span></div> : <SubmissionForm assignment={assignment} onSubmit={submitAssignment} disabled={late} />}</div>}
        </div>
        {isInstructor && <button className="assignment-more icon-button" aria-label={`Delete ${assignment.title}`} onClick={() => removeAssignment(assignment)}><Trash2 size={17} /></button>}
      </article>;
    })}{!filtered.length && <EmptyState icon={FileText} title={tab === "Needs review" ? "All caught up" : "Nothing to see here"} text={tab === "Needs review" ? "New student submissions will appear here." : "There are no assignments in this section yet."} />}</div>
    {dialogOpen && <AssignmentFormDialog courses={data.courses} onClose={() => setDialogOpen(false)} onSave={createAssignment} />}
    {reviewing && <GradeDialog submission={reviewing.submission} assignment={reviewing.assignment} onClose={() => setReviewing(null)} onSave={saveGrade} />}
  </>;
}

function SubmissionForm({ assignment, onSubmit, disabled }) {
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const submit = (event) => {
    event.preventDefault();
    if (!answer.trim() && !file) { setError("Write a response or attach a file before submitting."); return; }
    onSubmit(assignment, answer.trim(), file);
    setAnswer("");
  };
  return <form className="submission-form" onSubmit={submit}><label htmlFor={`answer-${assignment.id}`}>Your response</label><textarea id={`answer-${assignment.id}`} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Share your answer or add a note for your instructor..." rows="3" disabled={disabled} /><input className="visually-hidden" type="file" ref={fileRef} onChange={(event) => setFile(event.target.files?.[0]?.name || "")} /><div className="submission-form-actions">{file ? <span className="file-chip"><FileText size={13} /> {file}<button type="button" onClick={() => setFile("")} aria-label="Remove file"><X size={13} /></button></span> : <button type="button" className="attach-button" disabled={disabled} onClick={() => fileRef.current?.click()}><Upload size={14} /> Attach a file</button>}<span className="submission-form-spacer" />{error && <span className="form-error-inline">{error}</span>}<button type="submit" className="button button-primary button-small" disabled={disabled}><Upload size={14} /> {disabled ? "Deadline passed" : "Submit work"}</button></div></form>;
}

function AssignmentFormDialog({ courses, onClose, onSave }) {
  const availableCourses = courses;
  const [form, setForm] = useState({ title: "", description: "", courseId: availableCourses[0]?.id || "", dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), maxMarks: 100 });
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.courseId) { setError("Choose a course and add an assignment title."); return; }
    onSave({ ...form, maxMarks: Number(form.maxMarks), dueDate: new Date(`${form.dueDate}T23:59:00`).toISOString() });
  };
  return <Modal title="Create an assignment" subtitle="Give students clear instructions and a deadline." onClose={onClose}><form className="dialog-form" onSubmit={submit}><div className="form-field"><label>Assignment title</label><input autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Week 3 project" /></div><div className="form-field"><label>Course</label><select value={form.courseId} onChange={(event) => setForm({ ...form, courseId: event.target.value })}>{availableCourses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></div><div className="form-field"><label>Instructions</label><textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What should students work on?" /></div><div className="form-grid"><div className="form-field"><label>Due date</label><input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></div><div className="form-field"><label>Maximum points</label><input type="number" min="1" value={form.maxMarks} onChange={(event) => setForm({ ...form, maxMarks: event.target.value })} /></div></div>{error && <p className="form-error">{error}</p>}<div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Create assignment <ArrowRight size={16} /></button></div></form></Modal>;
}

function GradeDialog({ submission, assignment, onClose, onSave }) {
  const [marks, setMarks] = useState(submission.marks ?? "");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (marks === "" || Number(marks) < 0 || Number(marks) > Number(assignment.maxMarks)) { setError(`Enter a score from 0 to ${assignment.maxMarks}.`); return; }
    onSave(submission, marks, feedback.trim());
  };
  return <Modal title="Review submission" subtitle={`${submission.student} · ${assignment.title}`} onClose={onClose}><div className="student-answer"><span className="eyebrow">STUDENT RESPONSE</span><p>{submission.answer || "File submission attached."}</p>{submission.fileName && <span className="file-chip"><FileText size={13} /> {submission.fileName}</span>}</div><form className="dialog-form" onSubmit={submit}><div className="form-field"><label>Score (out of {assignment.maxMarks})</label><input type="number" min="0" max={assignment.maxMarks} value={marks} onChange={(event) => setMarks(event.target.value)} placeholder="Enter score" required /></div><div className="form-field"><label>Feedback for the student</label><textarea rows="4" value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Share what went well and what they can improve..." /></div>{error && <p className="form-error">{error}</p>}<div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Check size={16} /> Save grade</button></div></form></Modal>;
}

function GradesPage() {
  const { data, user } = useLms();
  const mySubmissions = data.submissions.filter((submission) => submission.studentId === user.id && submission.marks !== null);
  const average = mySubmissions.length ? Math.round(mySubmissions.reduce((sum, item) => {
    const assignment = data.assignments.find((candidate) => candidate.id === item.assignmentId);
    return sum + item.marks / (assignment?.maxMarks || 100) * 100;
  }, 0) / mySubmissions.length) : 0;
  return <>
    <PageHeading eyebrow="YOUR PROGRESS" title="Grades & feedback" description="Celebrate what you've accomplished and see where to grow next." />
    <div className="grade-overview"><div className="grade-overview-main"><span className="eyebrow eyebrow-light">CURRENT AVERAGE</span><div className="grade-average">{mySubmissions.length ? `${average}%` : "—"}</div><p>{mySubmissions.length ? "You're making meaningful progress. Keep showing up." : "Your grades will appear here after your first assignment is reviewed."}</p></div><div className="grade-overview-badge"><div className="grade-badge-icon"><Award size={23} /></div><b>{mySubmissions.length}</b><span>assignments<br />graded</span></div><div className="grade-overview-orbit" /></div>
    <section className="grade-list-section"><div className="section-heading"><div><span className="eyebrow">KEEP GROWING</span><h2>Graded assignments</h2></div><span className="grade-count">{mySubmissions.length} results</span></div>{mySubmissions.length ? <div className="grade-table"><div className="grade-table-head"><span>ASSIGNMENT</span><span>COURSE</span><span>GRADE</span><span>FEEDBACK</span></div>{mySubmissions.map((submission) => { const assignment = data.assignments.find((item) => item.id === submission.assignmentId); const course = data.courses.find((item) => item.id === assignment?.courseId); return <div className="grade-row" key={submission.id}><div className="grade-assignment"><span className={`grade-row-icon cover-${course?.color || "blue"}`}>{courseIcon(course?.icon || "code", 17)}</span><span><b>{assignment?.title || "Assignment"}</b><small>Graded {dateText(submission.submittedAt)}</small></span></div><span className="grade-course">{course?.title || "Course"}</span><span className={`grade-score ${submission.marks / (assignment?.maxMarks || 100) >= .7 ? "grade-score-good" : "grade-score-low"}`}>{submission.marks}<small> / {assignment?.maxMarks}</small></span><span className="grade-feedback">{submission.feedback || "No written feedback"}</span></div>; })}</div> : <EmptyState icon={Award} title="Your grades are on their way" text="Once an instructor reviews your work, you'll find your scores and feedback here." />}</section>
  </>;
}

function AnnouncementsPage() {
  const { data, user, updateData } = useLms();
  const [dialogOpen, setDialogOpen] = useState(false);
  const saveAnnouncement = (announcement) => {
    updateData((current) => ({ ...current, announcements: [{ ...announcement, id: crypto.randomUUID(), author: user.name, date: new Date().toISOString() }, ...current.announcements] }));
    setDialogOpen(false);
  };
  const remove = (announcement) => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) return;
    updateData((current) => ({ ...current, announcements: current.announcements.filter((item) => item.id !== announcement.id) }));
  };
  return <>
    <PageHeading eyebrow="CAMPUSLY COMMUNITY" title="Announcements" description="The latest updates from your instructors and campus community." action={user.role === "instructor" && <button className="button button-primary" onClick={() => setDialogOpen(true)}><Plus size={17} /> Post announcement</button>} />
    <div className="announcement-feature"><div className="announcement-feature-icon"><MessageSquareText size={23} /></div><div><span className="eyebrow eyebrow-light">STAY IN THE LOOP</span><h2>Good things are happening.</h2><p>Important updates, helpful reminders, and a little inspiration from around campus.</p></div><div className="feature-spark">✦</div></div>
    <div className="announcement-list">{data.announcements.map((announcement) => <article className={`announcement-card ${announcement.pinned ? "announcement-pinned" : ""}`} key={announcement.id}><div className="announcement-card-top"><div className="announcement-meta"><span className="announcement-icon"><MessageSquareText size={17} /></span><span>{announcement.author}</span><i />{dateText(announcement.date, { month: "long", day: "numeric" })}{announcement.pinned && <span className="pinned-tag"><Sparkles size={12} /> Pinned</span>}</div>{user.role === "instructor" && <button className="icon-button" aria-label="Delete announcement" onClick={() => remove(announcement)}><Trash2 size={17} /></button>}</div><h3>{announcement.title}</h3><p>{announcement.body}</p><button className="announcement-readmore">Read more <ArrowRight size={14} /></button></article>)}{!data.announcements.length && <EmptyState icon={MessageSquareText} title="No announcements yet" text="New updates will appear here." />}</div>
    {dialogOpen && <AnnouncementFormDialog onClose={() => setDialogOpen(false)} onSave={saveAnnouncement} />}
  </>;
}

function AnnouncementFormDialog({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const submit = (event) => { event.preventDefault(); if (title.trim() && body.trim()) onSave({ title: title.trim(), body: body.trim(), pinned }); };
  return <Modal title="Post an announcement" subtitle="Share an update with your learning community." onClose={onClose}><form className="dialog-form" onSubmit={submit}><div className="form-field"><label>Headline</label><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What's the update?" required /></div><div className="form-field"><label>Message</label><textarea rows="5" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add the details students should know..." required /></div><label className="checkbox-field"><input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} /><span>Pin this announcement to the top</span></label><div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><MessageSquareText size={16} /> Publish</button></div></form></Modal>;
}

function ProfilePage() {
  const { user, updateUser, data } = useLms();
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const student = user.role === "student";
  const courseCount = student ? data.courses.filter((course) => course.enrolled).length : data.courses.length;
  const save = (event) => { event.preventDefault(); if (!name.trim()) return; updateUser({ name: name.trim() }); setSaved(true); window.setTimeout(() => setSaved(false), 2500); };
  return <>
    <PageHeading eyebrow="YOUR SPACE" title="My profile" description="A little snapshot of who you are and what you're learning." />
    <div className="profile-layout"><section className="profile-card panel"><div className="profile-cover"><span className="profile-cover-star">✧</span><div className={`profile-big-avatar ${user.role === "instructor" ? "avatar-purple" : ""}`}>{initials(user.name)}</div></div><div className="profile-identity"><span className="role-tag">{student ? "STUDENT" : "INSTRUCTOR"}</span><h2>{user.name}</h2><p>{user.title}</p><span className="profile-email"><Mail size={15} /> {user.email}</span></div><div className="profile-stats"><div><b>{courseCount}</b><span>{student ? "Courses" : "Courses teaching"}</span></div><div><b>{student ? data.submissions.filter((item) => item.studentId === user.id).length : data.submissions.length}</b><span>Submissions</span></div><div><b>2024</b><span>Member since</span></div></div></section><section className="panel profile-edit-panel"><div className="panel-heading"><div><span className="eyebrow">PERSONAL DETAILS</span><h2>About you</h2></div><div className="profile-edit-icon"><Pencil size={17} /></div></div><form className="profile-edit-form" onSubmit={save}><div className="form-field"><label>Full name</label><input value={name} onChange={(event) => setName(event.target.value)} /></div><div className="form-field"><label>Email address</label><input value={user.email} disabled /></div><div className="form-field"><label>{student ? "Program" : "Role"}</label><input value={user.title} disabled /></div><div className="profile-save-line"><span>{saved && <span className="save-confirm"><CheckCircle2 size={15} /> Profile updated</span>}</span><button className="button button-primary" type="submit">Save changes <ArrowRight size={15} /></button></div></form></section></div>
  </>;
}

function SettingsPage() {
  const { data, updateData } = useLms();
  const settings = data.settings || { emailUpdates: true, deadlineReminders: true, announcementAlerts: true };
  const toggle = (key) => updateData((current) => ({ ...current, settings: { ...settings, [key]: !settings[key] } }));
  const reset = () => {
    if (!window.confirm("Restore the sample courses, assignments, and announcements? Your current demo changes will be replaced.")) return;
    const resetData = seedData();
    updateData({ ...resetData, settings });
  };
  return <>
    <PageHeading eyebrow="MAKE IT YOURS" title="Settings" description="Choose how LearnNova keeps you in the loop." />
    <div className="settings-layout"><section className="panel settings-panel"><div className="panel-heading"><div><span className="eyebrow">NOTIFICATIONS</span><h2>Your preferences</h2></div><span className="settings-heading-icon"><Bell size={18} /></span></div><p className="settings-intro">Choose the updates you would like to receive in your LearnNova workspace.</p><SettingRow title="Email updates" description="Get a weekly summary of your learning activity." value={settings.emailUpdates} onChange={() => toggle("emailUpdates")} /><SettingRow title="Deadline reminders" description="A heads-up before an assignment is due." value={settings.deadlineReminders} onChange={() => toggle("deadlineReminders")} /><SettingRow title="Announcement alerts" description="Stay informed when your instructors share an update." value={settings.announcementAlerts} onChange={() => toggle("announcementAlerts")} /></section><section className="panel settings-panel"><div className="panel-heading"><div><span className="eyebrow">DEMO DATA</span><h2>Start fresh</h2></div><span className="settings-heading-icon"><Download size={18} /></span></div><p className="settings-intro">Restore the sample content if you want to explore LearnNova from the beginning.</p><div className="reset-row"><div><b>Restore sample data</b><span>Courses, assignments, grades, and announcements</span></div><button className="button button-outline" onClick={reset}>Restore data</button></div></section><div className="settings-note"><CircleHelp size={17} /><span>Your learning data is saved on this device only. Clearing your browser storage will remove it.</span></div></div>
  </>;
}

function SettingRow({ title, description, value, onChange }) {
  return <div className="setting-row"><div><b>{title}</b><span>{description}</span></div><button type="button" className={`toggle-switch ${value ? "toggle-on" : ""}`} role="switch" aria-checked={value} aria-label={title} onClick={onChange}><span /></button></div>;
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`modal-card ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><h2 id="modal-title">{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div>{children}</section></div>;
}

export default App;

