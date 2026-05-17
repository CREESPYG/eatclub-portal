import { useState, useEffect } from 'react';
import { trainingCategories, quizQuestions, initialProgress, achievementsList } from '../data/trainingData';

// Icons as simple SVG components
const Icons = {
  dashboard: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
  school: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>,
  trending: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>,
  emoji: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
  settings: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  menu: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
  close: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
  check: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  play: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  lock: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
  arrowBack: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
  schedule: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>,
  star: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  warning: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  trophy: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>
};

export default function TrainingApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('trainingProgress');
    return saved ? JSON.parse(saved) : initialProgress;
  });

  useEffect(() => {
    localStorage.setItem('trainingProgress', JSON.stringify(progress));
  }, [progress]);

  const navigate = (page, category = null, course = null, lesson = null) => {
    setCurrentPage(page);
    setSelectedCategory(category);
    setSelectedCourse(course);
    setCurrentLesson(lesson);
    setQuizState(null);
    setSidebarOpen(true);
  };

  const markLessonComplete = (lessonId) => {
    if (!progress.completedLessons.includes(lessonId)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalHours: prev.totalHours + 0.5
      }));
    }
  };

  const saveQuizResult = (lessonId, score, total) => {
    setProgress(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [lessonId]: { score, total, percentage: Math.round((score/total)*100) } }
    }));
    markLessonComplete(lessonId);
  };

  const getCourseProgress = (course) => {
    const lessonIds = course.lessonsList.map(l => l.id);
    const completed = lessonIds.filter(id => progress.completedLessons.includes(id)).length;
    return { completed, total: lessonIds.length, percentage: Math.round((completed / lessonIds.length) * 100) };
  };

  const getCategoryProgress = (category) => {
    let total = 0, completed = 0;
    category.courses.forEach(course => {
      const prog = getCourseProgress(course);
      total += prog.total;
      completed += prog.completed;
    });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getOverallProgress = () => {
    let total = 0, completed = 0;
    trainingCategories.forEach(cat => {
      cat.courses.forEach(course => {
        total += course.lessonsList.length;
        course.lessonsList.forEach(lesson => {
          if (progress.completedLessons.includes(lesson.id)) completed++;
        });
      });
    });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard
          navigate={navigate}
          progress={progress}
          categories={trainingCategories}
          getCourseProgress={getCourseProgress}
          getOverallProgress={getOverallProgress}
        />;
      case 'courses':
        return <Courses
          category={selectedCategory}
          navigate={navigate}
          getCourseProgress={getCourseProgress}
        />;
      case 'courseDetail':
        return <CourseDetail
          course={selectedCourse}
          navigate={navigate}
          progress={progress}
          markLessonComplete={markLessonComplete}
          getCourseProgress={getCourseProgress}
        />;
      case 'lesson':
        return <LessonView
          lesson={currentLesson}
          course={selectedCourse}
          navigate={navigate}
          progress={progress}
          markLessonComplete={markLessonComplete}
          setQuizState={setQuizState}
        />;
      case 'quiz':
        return <Quiz
          lesson={currentLesson}
          course={selectedCourse}
          navigate={navigate}
          quizState={quizState}
          setQuizState={setQuizState}
          saveQuizResult={saveQuizResult}
          progress={progress}
        />;
      default:
        return <Dashboard navigate={navigate} progress={progress} categories={trainingCategories} getCourseProgress={getCourseProgress} getOverallProgress={getOverallProgress} />;
    }
  };

  return (
    <div className="training-app">
      {/* Sidebar */}
      <aside className={`training-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LearnHub</span>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            {Icons.close}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            {Icons.dashboard}
            <span>Dashboard</span>
          </button>

          {trainingCategories.map(cat => (
            <button
              key={cat.id}
              className={`nav-item ${currentPage === 'courses' && selectedCategory?.id === cat.id ? 'active' : ''}`}
              onClick={() => navigate('courses', cat)}
            >
              <span className="nav-icon">{cat.icon === 'rocket_launch' ? '🚀' : cat.icon === 'code' ? '💻' : cat.icon === 'psychology' ? '🧠' : cat.icon === 'gavel' ? '⚖️' : '👥'}</span>
              <span>{cat.name}</span>
              <span className="nav-badge">{getCategoryProgress(cat).percentage}%</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{progress.user.avatar}</div>
            <div className="user-info">
              <div className="user-name">{progress.user.name}</div>
              <div className="user-role">{progress.user.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="training-main">
        <header className="training-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {Icons.menu}
          </button>
          <div className="header-title">
            {currentPage === 'dashboard' && 'Dashboard'}
            {currentPage === 'courses' && selectedCategory?.name}
            {currentPage === 'courseDetail' && selectedCourse?.title}
            {currentPage === 'lesson' && currentLesson?.title}
            {currentPage === 'quiz' && 'Quiz'}
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{progress.streak || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">{progress.totalHours}h</span>
            </div>
          </div>
        </header>

        <div className="training-content">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

// Dashboard Component
function Dashboard({ navigate, progress, categories, getCourseProgress, getOverallProgress }) {
  const overall = getOverallProgress();

  const inProgressCourses = [];
  categories.forEach(cat => {
    cat.courses.forEach(course => {
      const prog = getCourseProgress(course);
      if (prog.completed > 0 && prog.percentage < 100) {
        inProgressCourses.push({ ...course, category: cat.name, ...prog });
      }
    });
  });

  const recommendedCourses = [];
  categories.forEach(cat => {
    cat.courses.forEach(course => {
      const prog = getCourseProgress(course);
      if (prog.completed === 0) {
        recommendedCourses.push({ ...course, category: cat.name, color: cat.color });
      }
    });
  });

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Welcome back, {progress.user.name.split(' ')[0]}! 👋</h1>
          <p>Ready to continue your learning journey?</p>
        </div>
        <div className="overall-progress-card">
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F4A261" strokeWidth="8"
                strokeDasharray={`${overall.percentage * 2.83} 283`}
                transform="rotate(-90 50 50)"
                className="progress-circle"
              />
            </svg>
            <div className="progress-text">
              <span className="progress-percent">{overall.percentage}%</span>
              <span className="progress-label">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-lg">📚</div>
          <div className="stat-content">
            <span className="stat-number">{overall.completed}</span>
            <span className="stat-label">Lessons Done</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-lg">⏰</div>
          <div className="stat-content">
            <span className="stat-number">{progress.totalHours}</span>
            <span className="stat-label">Hours Spent</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-lg">📊</div>
          <div className="stat-content">
            <span className="stat-number">{inProgressCourses.length}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-lg">🏆</div>
          <div className="stat-content">
            <span className="stat-number">{Object.keys(progress.quizScores).length}</span>
            <span className="stat-label">Quizzes Passed</span>
          </div>
        </div>
      </div>

      {inProgressCourses.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            <span>📖</span> Continue Learning
          </h2>
          <div className="courses-grid">
            {inProgressCourses.slice(0, 3).map(course => (
              <div key={course.id} className="course-card" onClick={() => navigate('courseDetail', null, course)}>
                <div className="course-thumbnail">{course.thumbnail}</div>
                <div className="course-info">
                  <div className="course-category">{course.category}</div>
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-meta">
                    <span>⏱️ {course.duration}</span>
                    <span>📝 {course.lessons} lessons</span>
                  </div>
                  <div className="course-progress-bar">
                    <div className="progress-fill" style={{width: `${course.percentage}%`}}></div>
                  </div>
                  <div className="course-progress-text">{course.percentage}% complete</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">
          <span>✨</span> Recommended For You
        </h2>
        <div className="courses-grid">
          {recommendedCourses.slice(0, 4).map(course => (
            <div key={course.id} className="course-card recommended" onClick={() => navigate('courseDetail', null, course)}>
              <div className="course-thumbnail" style={{background: course.color + '20'}}>{course.thumbnail}</div>
              <div className="course-info">
                <div className="course-category" style={{color: course.color}}>{course.category}</div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span>⏱️ {course.duration}</span>
                  <span>📝 {course.lessons} lessons</span>
                </div>
                <button className="btn btn-primary">Start Course</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Courses List Component
function Courses({ category, navigate, getCourseProgress }) {
  if (!category) {
    return (
      <div className="categories-view">
        <div className="categories-header">
          <h2>Choose a Category</h2>
          <p>Select a training category to explore courses</p>
        </div>
        <div className="categories-grid">
          {trainingCategories.map(cat => {
            const prog = getCategoryProgress(cat);
            return (
              <div key={cat.id} className="category-card" onClick={() => navigate('courses', cat)}>
                <div className="category-icon" style={{background: cat.color + '20', color: cat.color}}>
                  {cat.icon === 'rocket_launch' ? '🚀' : cat.icon === 'code' ? '💻' : cat.icon === 'psychology' ? '🧠' : cat.icon === 'gavel' ? '⚖️' : '👥'}
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-count">{cat.courses.length} courses</p>
                <div className="category-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${prog.percentage}%`, background: cat.color}}></div>
                  </div>
                  <span>{prog.percentage}% complete</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="courses-view">
      <div className="courses-header">
        <button className="back-btn" onClick={() => navigate('dashboard')}>
          {Icons.arrowBack}
          <span>Back</span>
        </button>
        <div className="category-info">
          <div className="category-icon-lg" style={{background: category.color + '20', color: category.color}}>
            {category.icon === 'rocket_launch' ? '🚀' : category.icon === 'code' ? '💻' : category.icon === 'psychology' ? '🧠' : category.icon === 'gavel' ? '⚖️' : '👥'}
          </div>
          <div>
            <h2>{category.name}</h2>
            <p>{category.courses.length} courses available</p>
          </div>
        </div>
      </div>

      <div className="courses-list">
        {category.courses.map(course => {
          const prog = getCourseProgress(course);
          return (
            <div key={course.id} className="course-item" onClick={() => navigate('courseDetail', category, course)}>
              <div className="course-item-icon">{course.thumbnail}</div>
              <div className="course-item-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-item-meta">
                  <span>⏱️ {course.duration}</span>
                  <span>📝 {course.lessons} lessons</span>
                </div>
              </div>
              <div className="course-item-status">
                {prog.percentage === 100 ? (
                  <span className="status-badge completed">✓ Completed</span>
                ) : prog.percentage > 0 ? (
                  <span className="status-badge in-progress">{prog.percentage}%</span>
                ) : (
                  <span className="status-badge not-started">Start</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Course Detail Component
function CourseDetail({ course, navigate, progress, markLessonComplete, getCourseProgress }) {
  const prog = getCourseProgress(course);

  const getLessonStatus = (lesson) => {
    if (progress.completedLessons.includes(lesson.id)) return 'completed';
    const lessonIndex = course.lessonsList.findIndex(l => l.id === lesson.id);
    const prevLesson = course.lessonsList[lessonIndex - 1];
    if (lessonIndex === 0) return 'available';
    if (prevLesson && progress.completedLessons.includes(prevLesson.id)) return 'available';
    return 'locked';
  };

  const firstIncompleteLesson = course.lessonsList.find(l => !progress.completedLessons.includes(l.id));

  return (
    <div className="course-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('courses', selectedCategory || trainingCategories[0])}>
          {Icons.arrowBack}
          <span>Back to Courses</span>
        </button>
      </div>

      <div className="detail-hero">
        <div className="detail-thumbnail">{course.thumbnail}</div>
        <div className="detail-info">
          <span className="detail-category">{selectedCategory?.name || 'General'}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="detail-meta">
            <span>⏱️ {course.duration}</span>
            <span>📝 {course.lessons} lessons</span>
            <span>✅ {prog.completed} completed</span>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('lesson', selectedCategory, course, firstIncompleteLesson || course.lessonsList[0])}
          >
            {prog.percentage > 0 ? 'Continue Learning' : 'Start Course'}
          </button>
        </div>
        <div className="detail-progress-card">
          <div className="progress-circle-lg">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F4A261" strokeWidth="10"
                strokeDasharray={`${prog.percentage * 2.51} 251`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="progress-percent-lg">{prog.percentage}%</span>
          </div>
          <p>Course Progress</p>
        </div>
      </div>

      <div className="lessons-section">
        <h2>Course Content</h2>
        <div className="lessons-list">
          {course.lessonsList.map((lesson, index) => {
            const status = getLessonStatus(lesson);
            return (
              <div
                key={lesson.id}
                className={`lesson-item ${status}`}
                onClick={() => status !== 'locked' && navigate('lesson', selectedCategory, course, lesson)}
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-content">
                  <h4>{lesson.title}</h4>
                  <div className="lesson-meta">
                    <span className="lesson-type">
                      {lesson.type === 'video' ? '🎥 Video' : lesson.type === 'text' ? '📖 Reading' : '📝 Quiz'}
                    </span>
                    <span className="lesson-duration">{lesson.duration}</span>
                  </div>
                </div>
                <div className="lesson-status-icon">
                  {status === 'completed' && <span className="status-complete">✓</span>}
                  {status === 'locked' && <span className="status-locked">🔒</span>}
                  {status === 'available' && <span className="status-play">▶</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Lesson View Component
function LessonView({ lesson, course, navigate, progress, markLessonComplete, setQuizState }) {
  const isCompleted = progress.completedLessons.includes(lesson.id);
  const quizData = quizQuestions[lesson.id];

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    const currentIndex = course.lessonsList.findIndex(l => l.id === lesson.id);
    if (currentIndex < course.lessonsList.length - 1) {
      navigate('lesson', selectedCategory, course, course.lessonsList[currentIndex + 1]);
    } else {
      navigate('courseDetail', selectedCategory, course);
    }
  };

  return (
    <div className="lesson-view">
      <div className="lesson-header">
        <button className="back-btn" onClick={() => navigate('courseDetail', selectedCategory, course)}>
          {Icons.arrowBack}
          <span>Back to Course</span>
        </button>
      </div>

      <div className="lesson-content-area">
        <div className="lesson-type-badge">
          {lesson.type === 'video' ? '🎥 Video Lesson' : lesson.type === 'text' ? '📖 Reading Material' : '📝 Quiz'}
        </div>

        <h1>{lesson.title}</h1>

        {lesson.type === 'video' && (
          <div className="video-placeholder">
            <div className="video-icon">▶️</div>
            <p>Video content would be displayed here</p>
            <span className="video-duration">{lesson.duration}</span>
          </div>
        )}

        {lesson.type === 'text' && (
          <div className="reading-content">
            <p>This is the reading material for <strong>{lesson.title}</strong>.</p>
            <p>In a complete implementation, this would contain the full text content, images, and other learning materials.</p>
            <ul>
              <li>Key concept 1 - Important information about the topic</li>
              <li>Key concept 2 - Essential details to remember</li>
              <li>Key concept 3 - Practical application tips</li>
              <li>Key concept 4 - Common mistakes to avoid</li>
            </ul>
            <p>Take your time to review this material carefully before proceeding to the next lesson or quiz.</p>
          </div>
        )}

        {lesson.type === 'quiz' && quizData && (
          <div className="quiz-prompt">
            <div className="quiz-icon">📝</div>
            <h3>Ready for the Quiz?</h3>
            <p>Test your knowledge with {quizData.length} questions. You need 70% to pass.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('quiz', selectedCategory, course, lesson)}>
              Start Quiz
            </button>
          </div>
        )}
      </div>

      {lesson.type !== 'quiz' && (
        <div className="lesson-footer">
          {isCompleted ? (
            <span className="completed-badge">✓ Lesson Completed</span>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleComplete}>
              Mark as Complete & Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Quiz Component
function Quiz({ lesson, course, navigate, quizState, setQuizState, saveQuizResult, progress }) {
  const quizData = quizQuestions[lesson.id];

  if (!quizData) {
    return <div className="quiz-error">No quiz questions available</div>;
  }

  if (!quizState) {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      showResult: false,
      score: 0
    });
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  const { currentQuestion, answers, showResult, score } = quizState;
  const question = quizData[currentQuestion];

  const handleAnswer = (optionIndex) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion]: optionIndex }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: currentQuestion + 1 }));
    } else {
      // Calculate score
      let correct = 0;
      quizData.forEach((q, i) => {
        if (answers[i] === q.correct) correct++;
      });
      const percentage = Math.round((correct / quizData.length) * 100);
      const passed = percentage >= 70;

      setQuizState(prev => ({
        ...prev,
        showResult: true,
        score: correct,
        total: quizData.length,
        percentage,
        passed
      }));

      if (passed) {
        saveQuizResult(lesson.id, correct, quizData.length);
      }
    }
  };

  if (showResult) {
    const percentage = Math.round((score / quizData.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="quiz-result">
        <div className={`result-icon ${passed ? 'passed' : 'failed'}`}>
          {passed ? '🏆' : '😔'}
        </div>
        <h2>{passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
        <div className="result-stats">
          <div className="result-score">
            <span className="score-number">{percentage}%</span>
            <span className="score-label">Your Score</span>
          </div>
          <div className="result-detail">
            <p>{score} out of {quizData.length} correct</p>
            <p>{passed ? 'You passed the quiz!' : 'You need 70% to pass'}</p>
          </div>
        </div>
        <div className="result-actions">
          {passed ? (
            <button className="btn btn-primary" onClick={() => navigate('courseDetail', selectedCategory, course)}>
              Continue to Next Lesson
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setQuizState(null)}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={() => navigate('lesson', selectedCategory, course, lesson)}>
          {Icons.arrowBack}
          <span>Exit Quiz</span>
        </button>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {quizData.length}
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{width: `${((currentQuestion + 1) / quizData.length) * 100}%`}}
        ></div>
      </div>

      <div className="question-card">
        <h3 className="question-text">{question.question}</h3>

        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${answers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswer(index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-footer">
        <button
          className="btn btn-primary btn-lg"
          onClick={nextQuestion}
          disabled={answers[currentQuestion] === undefined}
        >
          {currentQuestion < quizData.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}

// Helper for selectedCategory (used in LessonView)
let selectedCategory = null;