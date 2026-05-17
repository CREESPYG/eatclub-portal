# Training Portal - Specification Document

## Project Overview

**Project Name:** Corporate Training Portal  
**Type:** Single Page Web Application (React)  
**Core Functionality:** A comprehensive employee training platform with modular courses, progress tracking, quizzes, and a professional dashboard  
**Target Users:** Company employees across all levels

---

## UI/UX Specification

### Layout Structure

**Main Layout:**
- Fixed sidebar navigation (280px width on desktop)
- Main content area with scrollable content
- Top header bar with user profile and notifications
- Mobile: Collapsible hamburger menu

**Page Sections:**
1. Dashboard (Home)
2. Training Modules (with tabs for categories)
3. Course Detail View
4. Quiz Interface
5. Progress Tracker

**Responsive Breakpoints:**
- Mobile: < 768px (sidebar collapses to hamburger)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Primary: `#1E3A5F` (Deep Navy Blue)
- Secondary: `#F4A261` (Warm Amber/Coral)
- Accent: `#2A9D8F` (Teal)
- Background: `#FAFBFC` (Off-white)
- Surface: `#FFFFFF` (White)
- Text Primary: `#1A1A2E` (Near Black)
- Text Secondary: `#6B7280` (Gray)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Orange)
- Error: `#EF4444` (Red)

**Typography:**
- Headings: "Libre Baskerville", serif (elegant, distinctive)
- Body: "Source Sans 3", sans-serif (clean, readable)
- Font sizes:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

**Spacing System:**
- Base unit: 8px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

**Visual Effects:**
- Card shadows: `0 4px 20px rgba(30, 58, 95, 0.08)`
- Hover lift: `transform: translateY(-4px)` with shadow increase
- Border radius: 12px (cards), 8px (buttons), 20px (pills)
- Subtle gradient overlays on hero sections

### Components

**Sidebar Navigation:**
- Logo at top
- Nav items with icons
- Active state: filled background with accent color
- Hover: subtle background change
- User profile section at bottom

**Module Cards:**
- Image thumbnail
- Title and description
- Progress bar
- Duration and lesson count
- Status badge (Not Started, In Progress, Completed)

**Tab System:**
- Horizontal tabs for categories
- Animated underline indicator
- Active tab with accent color

**Course Content:**
- Lesson list with video/text indicators
- Expandable sections
- Checkmark for completed lessons
- Lock icon for locked content

**Quiz Interface:**
- Question card with options
- Progress indicator
- Timer (optional)
- Submit button with confirmation

**Progress Dashboard:**
- Overall completion circular progress
- Category-wise progress bars
- Recent activity timeline
- Achievement badges
- Stats cards (courses completed, hours spent, etc.)

---

## Functionality Specification

### Core Features

**1. Dashboard:**
- Welcome message with user name
- Overall progress visualization
- Quick stats (courses in progress, completed, total hours)
- Recent courses widget
- Upcoming deadlines
- Achievement highlights

**2. Training Modules:**
Categories:
- Onboarding (Company orientation, policies, culture)
- Technical Skills (Job-specific training)
- Soft Skills (Communication, leadership, teamwork)
- Compliance (Safety, legal, HR policies)
- Leadership (Management training)

Each category has:
- Multiple courses
- Each course has multiple lessons
- Each lesson has content (text/video) + quiz

**3. Course Detail:**
- Course overview (description, objectives)
- Lesson list with progress indicators
- Start/Continue button
- Certificate badge on completion

**4. Quiz System:**
- Multiple choice questions
- Immediate feedback on answers
- Score calculation
- Pass/Fail threshold (70%)
- Retry option on failure

**5. Progress Tracking:**
- Per-course progress percentage
- Per-category progress
- Total learning hours
- Quiz scores history
- Completion certificates

**6. Navigation:**
- Breadcrumb system
- Back button on detail pages
- Smooth scroll to sections
- Keyboard navigation support

### User Interactions

- Click to expand/collapse modules
- Click to start/continue courses
- Quiz answer selection with visual feedback
- Progress auto-save on lesson completion
- Mobile swipe for tab navigation

### Data Handling

- Local storage for progress persistence
- Mock data for courses and quizzes
- State management via React hooks

---

## Acceptance Criteria

1. ✅ Dashboard loads with user stats and recent courses
2. ✅ All 5 training categories display as tabs
3. ✅ Each category shows related courses
4. ✅ Course detail shows lesson list with progress
5. ✅ Quiz can be taken with score calculation
6. ✅ Progress persists across page refreshes
7. ✅ Fully responsive on mobile/tablet/desktop
8. ✅ Smooth animations on all interactions
9. ✅ Professional, distinctive design (not generic)
10. ✅ Fast loading with no console errors