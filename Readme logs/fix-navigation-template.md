# Navigation Fixing Template

## Standard Navigation Setup for All Pages

### 1. HTML Structure
Replace any static navigation with:
```html
<!-- Navigation will be loaded dynamically -->
```

### 2. Required Script Structure
At the bottom of each page, before closing `</body>`:

```html
<script type="module">
    import { initNavigation } from '../js/navigation.js'; // Use '../js/navigation.js' for pages in /pages folder
    import { updateAuthUI } from '../js/roles.js';        // Use '../js/roles.js' for pages in /pages folder
    
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize navigation (page-name, isInSubfolder)
        initNavigation('PAGE_NAME', IS_IN_SUBFOLDER);
        
        // Update authentication UI
        updateAuthUI();
        
        // Page-specific initialization here...
    });
</script>
```

### 3. Resource Path Corrections
For pages in `/pages` folder:
- CSS: `../css/styles.css` (NOT `/css/styles.css`)
- Images: `../img/image.png` (NOT `/img/image.png`)
- JS: `../js/filename.js` (NOT `/js/filename.js`)

For root level pages:
- CSS: `css/styles.css`
- Images: `img/image.png`  
- JS: `js/filename.js`

### 4. Navigation Parameters
- `PAGE_NAME`: The identifier for the current page (used for highlighting active menu)
- `IS_IN_SUBFOLDER`: 
  - `true` for pages in `/pages` directory
  - `false` for root level pages (index.html)

## Common Navigation Issues & Solutions

### Issue 1: 404 on CSS/JS/Images
**Problem**: Using absolute paths like `/css/styles.css` in subfolder pages
**Solution**: Use relative paths like `../css/styles.css`

### Issue 2: Navigation not loading
**Problem**: Missing or incorrect script imports
**Solution**: Ensure correct relative paths in imports

### Issue 3: No active page highlighting
**Problem**: Wrong page name in initNavigation()
**Solution**: Use correct page identifier that matches navigation.js

### Issue 4: Authentication UI not updating
**Problem**: Missing updateAuthUI() call
**Solution**: Always call updateAuthUI() after initNavigation()

## Page-by-Page Checklist

### For /pages directory files:
- [ ] Remove static navigation HTML
- [ ] Add dynamic navigation comment
- [ ] Fix CSS path to `../css/styles.css`
- [ ] Fix image paths to `../img/`
- [ ] Fix JS imports to `../js/`
- [ ] Add navigation script with `true` for subfolder parameter
- [ ] Test navigation loads properly
- [ ] Test authentication UI works
- [ ] Test active page highlighting

### For root level files:
- [ ] Remove static navigation HTML  
- [ ] Add dynamic navigation comment
- [ ] Keep CSS path as `css/styles.css`
- [ ] Keep image paths as `img/`
- [ ] Keep JS imports as `js/`
- [ ] Add navigation script with `false` for subfolder parameter
- [ ] Test navigation loads properly
- [ ] Test authentication UI works
- [ ] Test active page highlighting

## Navigation System Features to Test

1. **Dynamic Loading**: Navigation HTML generates via navigation.js
2. **Path Resolution**: Correct paths for subfolder vs root pages  
3. **Authentication UI**: Login/logout buttons show correctly
4. **Role-based Access**: Menu items show/hide based on user role
5. **Active Highlighting**: Current page is highlighted
6. **Responsive Design**: Works on mobile and desktop
7. **Scroll Effects**: Navigation style changes on scroll
8. **Footer Integration**: Footer loads dynamically too

## Common Page Names for initNavigation():
- `'index'` - index.html
- `'empleos'` - empleos.html
- `'capacitaciones'` - capacitaciones.html
- `'clanes'` - clanes.html  
- `'perfil'` - perfil.html
- `'login'` - login.html
- `'register'` - register.html
- `'job-management'` - job-management.html
- etc.
