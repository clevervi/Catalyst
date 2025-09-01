# CATALYST HR SYSTEM - MANUAL TESTING CHECKLIST

## Testing Instructions
- [ ] Start local server: `python -m http.server 8000`
- [ ] Open browser: `http://localhost:8000`
- [ ] Test on multiple browsers (Chrome, Firefox, Edge)
- [ ] Test on multiple screen sizes (desktop, tablet, mobile)

## ✅ PHASE 1: BASIC FUNCTIONALITY (30 minutes)

### 1.1 Page Loading
- [ ] Home page (index.html) loads without errors
- [ ] CSS styles applied correctly
- [ ] Images load properly
- [ ] No console JavaScript errors

### 1.2 Navigation Bar
- [ ] **Logo**: Catalyst logo displays and links to home
- [ ] **Home**: Links to index.html
- [ ] **Jobs Dropdown**:
  - [ ] Search Jobs → empleos.html
  - [ ] Companies → empresas.html
  - [ ] Post Job (shows for authenticated HR users)
- [ ] **Training Dropdown**:
  - [ ] Training Platform → training-enhanced.html
  - [ ] Browse Courses → capacitaciones.html
  - [ ] My Courses (auth required)
  - [ ] Certificates (auth required)
- [ ] **Teams**: Links to clanes.html

### 1.3 Authentication (Login Modal)
- [ ] Click "Sign In" opens login modal
- [ ] **Demo Credentials Button**: Shows/hides demo accounts
- [ ] **Password Toggle**: Eye icon shows/hides password
- [ ] **Form Validation**: Requires email and password

#### Test Demo Logins:
- [ ] `
` / `demo123` → Basic access
- [ ] `admin@catalyst.com` / `demo123` → Admin access
- [ ] `th@catalyst.com` / `demo123` → HR access
- [ ] `manager@catalyst.com` / `demo123` → Manager access
- [ ] `banco@catalyst.com` / `demo123` → Bank rep access
- [ ] `hiring@catalyst.com` / `demo123` → Hiring manager access

### 1.4 Footer
- [ ] Company description visible
- [ ] Social media icons display (placeholder links)
- [ ] Professional links section
- [ ] Company links section
- [ ] Newsletter subscription form

---

## ✅ PHASE 2: ROLE-BASED ACCESS (45 minutes)

### 2.1 Authentication State Changes
After login, verify:
- [ ] **Navigation Updates**: Login/Register buttons → User dropdown
- [ ] **User Dropdown Contains**:
  - [ ] User name displayed
  - [ ] My Profile link
  - [ ] My Courses link
  - [ ] Favorites link
  - [ ] Sign Out option
- [ ] **Role-Specific Menus**: HR dropdown visible for HR roles only

### 2.2 Page Access Control
Test page access for different roles:

| Page | Public | User | HR/Manager | Admin |
|------|--------|------|------------|-------|
| index.html | ✅ | ✅ | ✅ | ✅ |
| empleos.html | ✅ | ✅ | ✅ | ✅ |
| perfil.html | ❌ | ✅ | ✅ | ✅ |
| admin-dashboard.html | ❌ | ❌ | ❌ | ✅ |
| hiring-dashboard.html | ❌ | ❌ | ✅ | ✅ |

Access testing:
- [ ] **While NOT logged in**: Protected pages redirect to login
- [ ] **As regular user**: Can access profile, blocked from admin areas
- [ ] **As HR user**: Can access HR tools and dashboards
- [ ] **As admin**: Can access all areas including admin dashboard

---

## ✅ PHASE 3: JOB MANAGEMENT (60 minutes)

### 3.1 Job Listings Page (empleos.html)
- [ ] **Page loads** with filter sidebar and job list
- [ ] **Filter Panel** on left side with:
  - [ ] Location dropdown
  - [ ] Area buttons (Frontend, Backend, etc.)
  - [ ] Experience level buttons
  - [ ] Work modality buttons
  - [ ] Contract type buttons
  - [ ] Apply Filters and Clear buttons

### 3.2 Job Cards Display
- [ ] **Static Job Cards** (3 featured jobs) show:
  - [ ] Job title and company name
  - [ ] Location and salary range
  - [ ] Job type badges (Remote, Hybrid, On-site)
  - [ ] Company logos/icons
  - [ ] "View Details" buttons
- [ ] **Dynamic Job Cards** load from JavaScript
- [ ] **Pagination** controls at bottom

### 3.3 Job Details Modal
- [ ] **Modal Opens** when clicking "View Details"
- [ ] **Job Information Displays**:
  - [ ] Complete job description
  - [ ] Requirements list
  - [ ] Benefits list
  - [ ] Company verification badge
  - [ ] Application statistics
- [ ] **Apply Now Button**:
  - [ ] Works when authenticated
  - [ ] Prompts login when not authenticated
  - [ ] Shows success message after applying

### 3.4 Job Search and Filtering
- [ ] **Text Search**: Can search by keywords
- [ ] **Filter Buttons**: Activate/deactivate correctly
- [ ] **Sort Dropdown**: Recent, salary, relevance options
- [ ] **Results Update**: Filters change displayed jobs
- [ ] **Clear Filters**: Resets all filters

---

## ✅ PHASE 4: TRAINING SYSTEM (45 minutes)

### 4.1 Course Listings
- [ ] **Featured Courses** section on home page shows:
  - [ ] 3 course cards with images
  - [ ] Technology badges (Frontend, Backend, Data Science)
  - [ ] Duration and student count
  - [ ] "View course" buttons
- [ ] **Training Page** (capacitaciones.html) loads properly

### 4.2 Course Interaction
- [ ] **Course Cards Clickable**: Open course details
- [ ] **Enrollment Process**: Requires authentication
- [ ] **My Courses** (authenticated users): Shows enrolled courses
- [ ] **Progress Tracking**: Basic progress indicators

---

## ✅ PHASE 5: USER PROFILE (30 minutes)

### 5.1 Profile Page (perfil.html)
- [ ] **Access Control**: Only authenticated users
- [ ] **Profile Information**: User data displayed
- [ ] **Edit Functionality**: Can modify profile
- [ ] **Application History**: Lists applied jobs
- [ ] **Saved Jobs**: Favorites functionality

---

## ✅ PHASE 6: RESPONSIVE DESIGN (45 minutes)

### 6.1 Mobile Testing (320px - 768px)
- [ ] **Navigation**: Hamburger menu works
- [ ] **Job Cards**: Stack vertically
- [ ] **Forms**: Remain usable on small screens
- [ ] **Modals**: Responsive and readable
- [ ] **Buttons**: Touch-friendly size

### 6.2 Tablet Testing (768px - 1024px)
- [ ] **Layout Adapts**: Proper column arrangements
- [ ] **Navigation**: Collapses appropriately
- [ ] **Content Readable**: Proper spacing maintained

### 6.3 Desktop Testing (1024px+)
- [ ] **Full Layout**: All elements properly positioned
- [ ] **Hover Effects**: Working on interactive elements
- [ ] **Dropdowns**: Proper positioning and functionality

---

## ✅ PHASE 7: DASHBOARD TESTING (60 minutes)

### 7.1 Admin Dashboard (admin@catalyst.com)
- [ ] **Page Access**: Only admins can access
- [ ] **System Statistics**: User, job, application counts
- [ ] **User Management**: List users with roles
- [ ] **System Overview**: Health indicators
- [ ] **Navigation**: Admin-specific menu items

### 7.2 HR Dashboard (th@catalyst.com, hiring@catalyst.com)
- [ ] **Recruitment Metrics**: Open positions, applications
- [ ] **Candidate Pipeline**: Application workflow
- [ ] **Resume Database Access**: Search candidates
- [ ] **Job Management**: Post and manage jobs

### 7.3 Manager Dashboard (manager@catalyst.com)
- [ ] **Team Overview**: Department statistics
- [ ] **Hiring Requests**: Job posting approvals
- [ ] **Performance Metrics**: Team hiring metrics

---

## ✅ PHASE 8: BROWSER COMPATIBILITY (30 minutes)

### 8.1 Chrome
- [ ] All functionality works
- [ ] CSS renders correctly
- [ ] JavaScript executes properly
- [ ] Console shows no errors

### 8.2 Firefox
- [ ] All functionality works
- [ ] CSS renders correctly
- [ ] JavaScript executes properly
- [ ] No compatibility issues

### 8.3 Edge
- [ ] All functionality works
- [ ] CSS renders correctly
- [ ] JavaScript executes properly
- [ ] No compatibility issues

---

## ✅ PHASE 9: PERFORMANCE & ACCESSIBILITY (30 minutes)

### 9.1 Performance
- [ ] **Page Load Speed**: < 3 seconds for main pages
- [ ] **Image Loading**: Optimized and fast
- [ ] **JavaScript Performance**: Smooth interactions
- [ ] **Network Requests**: Efficient loading

### 9.2 Basic Accessibility
- [ ] **Keyboard Navigation**: Tab through all elements
- [ ] **Focus Indicators**: Visible focus states
- [ ] **Alt Text**: Images have descriptions
- [ ] **Form Labels**: All inputs properly labeled
- [ ] **Color Contrast**: Readable text contrast

---

## ✅ PHASE 10: ERROR HANDLING (15 minutes)

### 10.1 Form Validation
- [ ] **Email Validation**: Rejects invalid emails
- [ ] **Required Fields**: Shows errors for empty fields
- [ ] **Password Strength**: Enforces minimum requirements
- [ ] **Error Messages**: Clear and in English

### 10.2 Edge Cases
- [ ] **Invalid URLs**: Graceful error handling
- [ ] **Network Issues**: Timeout handling
- [ ] **Authentication Failures**: Clear error messages
- [ ] **Session Expiry**: Proper logout behavior

---

## 🔧 AUTOMATED TESTING (Using test_utilities.js)

### Browser Console Tests
1. Open Developer Tools (F12)
2. Copy and paste `test_utilities.js` content
3. Run: `CatalystTester.runAllTests()`
4. Review results and fix any failures

### Test Commands:
```javascript
// Quick functionality check
CatalystTester.quickTest();

// Complete test suite
CatalystTester.runAllTests();

// Export results
CatalystTester.exportResults();
```

---

## 📋 FINAL CHECKLIST

### Before Declaring "READY FOR PRODUCTION":
- [ ] All Phase 1-10 tests completed
- [ ] No critical errors found
- [ ] All demo credentials working
- [ ] Responsive design tested
- [ ] Browser compatibility confirmed
- [ ] Basic accessibility verified
- [ ] Performance acceptable
- [ ] All role-based features working

### Common Issues to Watch For:
- [ ] **Console Errors**: Check browser console for JavaScript errors
- [ ] **404 Errors**: Missing images or files
- [ ] **Authentication Loops**: Login/logout issues
- [ ] **Mobile Layout**: Broken responsive design
- [ ] **Missing Features**: Non-functional buttons or links

---

## 📊 TEST EXECUTION TRACKING

### Testing Session Information:
- **Date**: ________________
- **Tester**: ________________  
- **Browser(s)**: ________________
- **Screen Size**: ________________
- **Duration**: ________________

### Phase Completion:
- [ ] Phase 1: Basic Functionality ___/___
- [ ] Phase 2: Role-Based Access ___/___
- [ ] Phase 3: Job Management ___/___
- [ ] Phase 4: Training System ___/___
- [ ] Phase 5: User Profile ___/___
- [ ] Phase 6: Responsive Design ___/___
- [ ] Phase 7: Dashboard Testing ___/___
- [ ] Phase 8: Browser Compatibility ___/___
- [ ] Phase 9: Performance & Accessibility ___/___
- [ ] Phase 10: Error Handling ___/___

### Overall Assessment:
- [ ] **PASS**: Ready for deployment
- [ ] **CONDITIONAL PASS**: Minor issues to fix
- [ ] **FAIL**: Critical issues found

### Notes:
_________________________________
_________________________________
_________________________________

---

*This checklist should be completed for each major testing session. Keep this document updated as issues are found and resolved.*
