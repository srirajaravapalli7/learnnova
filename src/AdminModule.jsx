import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User management", icon: Users },
  { id: "courses", label: "Course management", icon: BookOpen },
  { id: "assignments", label: "Assignment management", icon: CheckCircle2 },
  { id: "enrollments", label: "Enrollments", icon: GraduationCap },
  { id: "profile", label: "Admin profile", icon: ShieldCheck },
];

const newCourseForm = () => ({
  title: "",
  description: "",
  instructor: "",
  category: "Programming",
  duration: "6 weeks",
  color: "blue",
  icon: "code",
  modulesText: "",
  materialsText: "",
});

const newAssignmentForm = (courses) => ({
  title: "",
  courseId: courses[0]?.id || "",
  description: "",
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  maxMarks: 100,
});

const displayDate = (date) => date
  ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date))
  : "—";

export function AdminLoginPage({ onLogin, authError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(authError || "");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onLogin({ email, password });
      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Could not sign in to the admin account.");
    } finally {
      setBusy(false);
    }
  };

  return <main className="login-page">
    <section className="login-visual">
      <Link className="brand brand-light" to="/"><span className="brand-mark"><GraduationCap size={21} /></span><span className="brand-lockup"><strong>LearnNova</strong><small>LEARNNOVA UNIVERSITY</small><span className="brand-tagline">Explore. Learn. Evolve.</span></span></Link>
      <div className="login-quote"><span className="eyebrow eyebrow-light"><ShieldCheck size={14} /> ADMIN WORKSPACE</span><h1>Lead learning<br />forward.</h1><p>Manage the LearnNova community, course catalog, and assignments from one dedicated workspace.</p></div>
      <div className="login-visual-bottom"><span>© {new Date().getFullYear()} LearnNova University</span><span>Administrator sign in</span></div>
    </section>
    <section className="login-form-side">
      <div className="login-form-wrap">
        <div className="login-heading"><span className="eyebrow">ADMIN ACCESS</span><h2>Admin sign in</h2><p>Sign in with your LearnNova administrator account.</p><p className="auth-demo-note">Local demo authentication stores account data in this browser.</p></div>
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="admin-email">Email address</label>
          <div className="input-with-icon"><Mail size={17} /><input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <div className="password-label"><label htmlFor="admin-password">Password</label></div>
          <div className="input-with-icon"><ShieldCheck size={17} /><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary login-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : "Sign in to admin"} {!busy && <ArrowRight size={17} />}</button>
        </form>
        <p className="login-switch"><Link to="/login">Sign in as a student</Link> · <Link to="/">Return to campus</Link></p>
        <p className="login-legal">This local-only demo is not suitable for real administrator credentials or sensitive data.</p>
      </div>
    </section>
  </main>;
}

export default function AdminModule({ admin, onLogout, users, sharedData, onUpdateSharedData, enrollments }) {
  const [section, setSection] = useState("overview");
  const [courseForm, setCourseForm] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const logout = () => {
    onLogout();
    navigate("/admin/login", { replace: true });
  };

  const saveCourse = (event) => {
    event.preventDefault();
    if (!courseForm.title.trim() || !courseForm.description.trim() || !courseForm.instructor.trim()) {
      setError("Enter a course title, description, and instructor.");
      return;
    }
    const { modulesText, materialsText, ...courseFields } = courseForm;
    const savedCourse = {
      ...courseFields,
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      instructor: courseForm.instructor.trim(),
      students: Number(courseForm.students || 0),
      rosterIds: courseForm.rosterIds || [],
      modules: modulesText.split("\n").map((item) => item.trim()).filter(Boolean),
      materials: materialsText.split("\n").map((item) => item.trim()).filter(Boolean),
      enrolled: false,
      progress: 0,
    };
    onUpdateSharedData((current) => ({
      ...current,
      courses: savedCourse.id
        ? current.courses.map((course) => course.id === savedCourse.id ? { ...course, ...savedCourse } : course)
        : [...current.courses, { ...savedCourse, id: crypto.randomUUID() }],
    }));
    setCourseForm(null);
    setError("");
  };

  const deleteCourse = (course) => {
    if (!window.confirm(`Delete "${course.title}" and its assignments?`)) return;
    onUpdateSharedData((current) => ({
      ...current,
      courses: current.courses.filter((item) => item.id !== course.id),
      assignments: current.assignments.filter((item) => item.courseId !== course.id),
    }));
  };

  const saveAssignment = (event) => {
    event.preventDefault();
    if (!assignmentForm.title.trim() || !assignmentForm.courseId) {
      setError("Choose a course and enter an assignment title.");
      return;
    }
    const savedAssignment = {
      ...assignmentForm,
      title: assignmentForm.title.trim(),
      description: assignmentForm.description.trim(),
      maxMarks: Number(assignmentForm.maxMarks),
      dueDate: new Date(`${assignmentForm.dueDate}T23:59:00`).toISOString(),
    };
    onUpdateSharedData((current) => ({
      ...current,
      assignments: savedAssignment.id
        ? current.assignments.map((item) => item.id === savedAssignment.id ? { ...item, ...savedAssignment } : item)
        : [...current.assignments, { ...savedAssignment, id: crypto.randomUUID() }],
    }));
    setAssignmentForm(null);
    setError("");
  };

  const deleteAssignment = (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"?`)) return;
    onUpdateSharedData((current) => ({
      ...current,
      assignments: current.assignments.filter((item) => item.id !== assignment.id),
    }));
  };

  return (
    <div className="app-shell admin-shell">
      <header className="top-navigation admin-navigation">
        <Link className="brand" to="/admin">
          <span className="brand-mark"><GraduationCap size={20} /></span>
          <span className="brand-lockup"><strong>LearnNova</strong><small>ADMINISTRATION</small></span>
        </Link>
        <div className="admin-nav-actions">
          <span className="admin-identity"><ShieldCheck size={16} /> {admin.name}</span>
          <Link className="button button-outline" to="/">Campus <ArrowRight size={14} /></Link>
          <button className="button button-outline" onClick={logout}><LogOut size={15} /> Sign out</button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin dashboard navigation">
          <span className="eyebrow">ADMIN WORKSPACE</span>
          <nav>{navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`admin-nav-item ${section === id ? "admin-nav-item-active" : ""}`} onClick={() => { setSection(id); setError(""); }}>
              <Icon size={16} /> {label}
            </button>
          ))}</nav>
          <div className="admin-sidebar-note"><ShieldCheck size={17} /><span>Admin data is stored locally in this browser.</span></div>
        </aside>
        <main className="admin-content">
          {section === "overview" && <Overview users={users} courses={sharedData.courses} assignments={sharedData.assignments} enrollments={enrollments} admin={admin} onNavigate={setSection} />}
          {section === "users" && <UserManagement users={users} />}
          {section === "courses" && <CourseManagement courses={sharedData.courses} onCreate={() => { setError(""); setCourseForm(newCourseForm()); }} onEdit={(course) => { setError(""); setCourseForm({ ...newCourseForm(), ...course, modulesText: (course.modules || []).join("\n"), materialsText: (course.materials || []).join("\n") }); }} onDelete={deleteCourse} />}
          {section === "assignments" && <AssignmentManagement assignments={sharedData.assignments} courses={sharedData.courses} onCreate={() => { setError(""); setAssignmentForm(newAssignmentForm(sharedData.courses)); }} onEdit={(assignment) => { setError(""); setAssignmentForm({ ...newAssignmentForm(sharedData.courses), ...assignment, dueDate: new Date(assignment.dueDate).toISOString().slice(0, 10) }); }} onDelete={deleteAssignment} />}
          {section === "enrollments" && <EnrollmentManagement enrollments={enrollments} />}
          {section === "profile" && <AdminProfile admin={admin} users={users.length} courses={sharedData.courses.length} />}
          {courseForm && <CourseEditor course={courseForm} error={error} onChange={(updates) => setCourseForm((current) => ({ ...current, ...updates }))} onClose={() => { setCourseForm(null); setError(""); }} onSave={saveCourse} />}
          {assignmentForm && <AssignmentEditor assignment={assignmentForm} courses={sharedData.courses} error={error} onChange={(updates) => setAssignmentForm((current) => ({ ...current, ...updates }))} onClose={() => { setAssignmentForm(null); setError(""); }} onSave={saveAssignment} />}
        </main>
      </div>
    </div>
  );
}

function Overview({ users, courses, assignments, enrollments, admin, onNavigate }) {
  const stats = [
    { label: "Registered users", value: users.length, icon: Users, section: "users" },
    { label: "Courses", value: courses.length, icon: BookOpen, section: "courses" },
    { label: "Assignments", value: assignments.length, icon: CheckCircle2, section: "assignments" },
    { label: "Enrollments", value: enrollments.length, icon: GraduationCap, section: "enrollments" },
  ];
  return <>
    <div className="admin-welcome"><span className="eyebrow eyebrow-light"><ShieldCheck size={14} /> ADMINISTRATION</span><h1>Welcome, {admin.name.split(" ")[0]}.</h1><p>Manage the LearnNova learning community and course catalog.</p></div>
    <div className="admin-stat-grid">{stats.map(({ label, value, icon: Icon, section }) => <button className="admin-stat-card" key={label} onClick={() => onNavigate(section)}><span><Icon size={18} /></span><small>{label}</small><b>{value}</b></button>)}</div>
    <div className="admin-overview-grid">
      <section className="panel admin-overview-panel"><div className="panel-heading"><div><span className="eyebrow">LEARNNOVA LMS</span><h2>Management tools</h2></div></div><div className="admin-shortcuts">{stats.slice(0, 3).map(({ label, icon: Icon, section }) => <button key={section} onClick={() => onNavigate(section)}><Icon size={17} /><span>{label}</span><ArrowRight size={15} /></button>)}</div></section>
      <section className="panel admin-overview-panel"><div className="panel-heading"><div><span className="eyebrow">ADMIN PROFILE</span><h2>Account details</h2></div><ShieldCheck size={18} /></div><div className="admin-profile-summary"><b>{admin.name}</b><span><Mail size={14} /> {admin.email}</span><span>Administrator · Member since {displayDate(admin.createdAt)}</span></div></section>
    </div>
  </>;
}

function UserManagement({ users }) {
  return <>
    <AdminHeading eyebrow="USER MANAGEMENT" title="Registered users" description="View student account details saved in this browser." />
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Student</th><th>Email</th><th>Student ID</th><th>Department</th><th>Joined</th></tr></thead><tbody>
      {users.map((user) => <tr key={user.id}><td><b>{user.name}</b></td><td>{user.email}</td><td>{user.studentId}</td><td>{user.department}</td><td>{displayDate(user.createdAt)}</td></tr>)}
      {!users.length && <tr><td className="admin-empty-cell" colSpan="5">No student accounts have been registered yet.</td></tr>}
    </tbody></table></div>
  </>;
}

function CourseManagement({ courses, onCreate, onEdit, onDelete }) {
  return <>
    <AdminHeading eyebrow="COURSE MANAGEMENT" title="Course catalog" description="Add, edit, and remove courses available across student workspaces." action={<button className="button button-primary" onClick={onCreate}><Plus size={16} /> Add course</button>} />
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Course</th><th>Instructor</th><th>Category</th><th>Duration</th><th>Actions</th></tr></thead><tbody>
      {courses.map((course) => <tr key={course.id}><td><b>{course.title}</b><small>{course.description}</small><details className="admin-course-details"><summary>View modules & materials</summary><span><b>Modules:</b> {(course.modules || []).join(" · ") || "None added"}</span><span><b>Materials:</b> {(course.materials || []).join(" · ") || "None added"}</span></details></td><td>{course.instructor}</td><td>{course.category}</td><td>{course.duration}</td><td><div className="admin-row-actions"><button aria-label={`Edit ${course.title}`} onClick={() => onEdit(course)}><Pencil size={15} /></button><button aria-label={`Delete ${course.title}`} onClick={() => onDelete(course)}><Trash2 size={15} /></button></div></td></tr>)}
      {!courses.length && <tr><td className="admin-empty-cell" colSpan="5">No courses are in the catalog.</td></tr>}
    </tbody></table></div>
  </>;
}

function AssignmentManagement({ assignments, courses, onCreate, onEdit, onDelete }) {
  return <>
    <AdminHeading eyebrow="ASSIGNMENT MANAGEMENT" title="Assignments" description="Manage assignment instructions, course links, and due dates." action={<button className="button button-primary" onClick={onCreate} disabled={!courses.length}><Plus size={16} /> Add assignment</button>} />
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Assignment</th><th>Course</th><th>Due date</th><th>Points</th><th>Actions</th></tr></thead><tbody>
      {assignments.map((assignment) => <tr key={assignment.id}><td><b>{assignment.title}</b><small>{assignment.description}</small></td><td>{courses.find((course) => course.id === assignment.courseId)?.title || "Course removed"}</td><td>{displayDate(assignment.dueDate)}</td><td>{assignment.maxMarks}</td><td><div className="admin-row-actions"><button aria-label={`Edit ${assignment.title}`} onClick={() => onEdit(assignment)}><Pencil size={15} /></button><button aria-label={`Delete ${assignment.title}`} onClick={() => onDelete(assignment)}><Trash2 size={15} /></button></div></td></tr>)}
      {!assignments.length && <tr><td className="admin-empty-cell" colSpan="5">No assignments have been created yet.</td></tr>}
    </tbody></table></div>
  </>;
}

function EnrollmentManagement({ enrollments }) {
  return <>
    <AdminHeading eyebrow="ENROLLMENT MANAGEMENT" title="Student enrollments" description="Review course enrollment records for registered students." />
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Student</th><th>Student ID</th><th>Department</th><th>Course</th><th>Progress</th></tr></thead><tbody>
      {enrollments.map(({ user, course }) => <tr key={`${user.id}-${course.id}`}><td><b>{user.name}</b><small>{user.email}</small></td><td>{user.studentId}</td><td>{user.department}</td><td>{course.title}</td><td>{Number(course.progress || 0)}%</td></tr>)}
      {!enrollments.length && <tr><td className="admin-empty-cell" colSpan="5">There are no student enrollments to display.</td></tr>}
    </tbody></table></div>
  </>;
}

function AdminProfile({ admin, users, courses }) {
  return <>
    <AdminHeading eyebrow="ADMIN PROFILE" title="Account information" description="Administrator details for this local LearnNova installation." />
    <section className="panel admin-profile-panel"><div className="admin-profile-avatar"><ShieldCheck size={25} /></div><div><span className="role-tag">ADMINISTRATOR</span><h2>{admin.name}</h2><p><Mail size={15} /> {admin.email}</p><p><CalendarDays size={15} /> Admin account created {displayDate(admin.createdAt)}</p></div><div className="admin-profile-counts"><span><b>{users}</b> registered users</span><span><b>{courses}</b> courses managed</span></div></section>
  </>;
}

function AdminHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading admin-page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function CourseEditor({ course, error, onChange, onClose, onSave }) {
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="admin-editor panel" role="dialog" aria-modal="true" aria-labelledby="course-editor-title">
      <div className="panel-heading"><div><span className="eyebrow">COURSE CATALOG</span><h2 id="course-editor-title">{course.id ? "Edit course" : "Add a course"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      <form className="admin-editor-form" onSubmit={onSave}>
        <label>Course title<input value={course.title} onChange={(event) => onChange({ title: event.target.value })} required /></label>
        <label>Description<textarea rows="3" value={course.description} onChange={(event) => onChange({ description: event.target.value })} required /></label>
        <div className="admin-editor-fields"><label>Instructor<input value={course.instructor} onChange={(event) => onChange({ instructor: event.target.value })} required /></label><label>Category<select value={course.category} onChange={(event) => onChange({ category: event.target.value })}>{["Programming", "Development", "Data", "Technology", "Design", "Mathematics", "Research", "Business"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <div className="admin-editor-fields"><label>Duration<input value={course.duration} onChange={(event) => onChange({ duration: event.target.value })} required /></label><label>Color<select value={course.color} onChange={(event) => onChange({ color: event.target.value })}>{["blue", "purple", "mint", "coral", "amber"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <label>Modules or lessons<textarea rows="3" value={course.modulesText} onChange={(event) => onChange({ modulesText: event.target.value })} placeholder="One module per line" /></label>
        <label>Learning materials<textarea rows="3" value={course.materialsText} onChange={(event) => onChange({ materialsText: event.target.value })} placeholder="One material per line" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">Save course <ArrowRight size={15} /></button></div>
      </form>
    </section>
  </div>;
}

function AssignmentEditor({ assignment, courses, error, onChange, onClose, onSave }) {
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="admin-editor panel" role="dialog" aria-modal="true" aria-labelledby="assignment-editor-title">
      <div className="panel-heading"><div><span className="eyebrow">ASSIGNMENT MANAGEMENT</span><h2 id="assignment-editor-title">{assignment.id ? "Edit assignment" : "Add an assignment"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      <form className="admin-editor-form" onSubmit={onSave}>
        <label>Assignment title<input value={assignment.title} onChange={(event) => onChange({ title: event.target.value })} required /></label>
        <label>Course<select value={assignment.courseId} onChange={(event) => onChange({ courseId: event.target.value })} required>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
        <label>Instructions<textarea rows="3" value={assignment.description} onChange={(event) => onChange({ description: event.target.value })} /></label>
        <div className="admin-editor-fields"><label>Due date<input type="date" value={assignment.dueDate} onChange={(event) => onChange({ dueDate: event.target.value })} required /></label><label>Maximum points<input type="number" min="1" value={assignment.maxMarks} onChange={(event) => onChange({ maxMarks: event.target.value })} required /></label></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">Save assignment <ArrowRight size={15} /></button></div>
      </form>
    </section>
  </div>;
}
