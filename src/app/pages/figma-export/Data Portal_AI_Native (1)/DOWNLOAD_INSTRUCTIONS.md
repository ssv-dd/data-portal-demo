# 📥 How to Download and Use This Code in Cursor

## Option 1: Export from Figma Make (Recommended)

### Step 1: Export the Project
1. Look for the **"Export"** or **"Download"** button in the Figma Make interface (usually in the top-right corner)
2. Click it to download a ZIP file containing your entire project
3. Extract the ZIP file to your desired location

### Step 2: Open in Cursor
```bash
# Navigate to the extracted folder
cd path/to/extracted-folder

# Install dependencies
npm install

# Run the development server
npm run dev
```

That's it! The app should now be running at `http://localhost:5173`

---

## Option 2: Manual Recreation (If Export Not Available)

If you don't see an export button, you can manually recreate the project using the code exports I've provided:

### Step 1: Set Up Project Structure

```bash
# Create project directory
mkdir doordash-bi-prototype
cd doordash-bi-prototype

# Initialize the project
npm init -y
```

### Step 2: Install Dependencies

```bash
# Install all dependencies at once
npm install @emotion/react@11.14.0 @emotion/styled@11.14.1 @monaco-editor/react@^4.7.0 @mui/icons-material@7.3.5 @mui/material@7.3.5 @popperjs/core@2.11.8 @radix-ui/react-accordion@1.2.3 @radix-ui/react-alert-dialog@1.1.6 @radix-ui/react-aspect-ratio@1.1.2 @radix-ui/react-avatar@1.1.3 @radix-ui/react-checkbox@1.1.4 @radix-ui/react-collapsible@1.1.3 @radix-ui/react-context-menu@2.2.6 @radix-ui/react-dialog@1.1.6 @radix-ui/react-dropdown-menu@2.1.6 @radix-ui/react-hover-card@1.1.6 @radix-ui/react-label@2.1.2 @radix-ui/react-menubar@1.1.6 @radix-ui/react-navigation-menu@1.2.5 @radix-ui/react-popover@1.1.6 @radix-ui/react-progress@1.1.2 @radix-ui/react-radio-group@1.2.3 @radix-ui/react-scroll-area@1.2.3 @radix-ui/react-select@2.1.6 @radix-ui/react-separator@1.1.2 @radix-ui/react-slider@1.2.3 @radix-ui/react-slot@1.1.2 @radix-ui/react-switch@1.1.3 @radix-ui/react-tabs@1.1.3 @radix-ui/react-toggle@1.1.2 @radix-ui/react-toggle-group@1.1.2 @radix-ui/react-tooltip@1.1.8 class-variance-authority@0.7.1 clsx@2.1.1 cmdk@1.1.1 date-fns@3.6.0 embla-carousel-react@8.6.0 input-otp@1.4.2 lucide-react@0.487.0 motion@12.23.24 next-themes@0.4.6 react-day-picker@8.10.1 react-dnd@16.0.1 react-dnd-html5-backend@16.0.1 react-hook-form@7.55.0 react-popper@2.3.0 react-resizable-panels@2.1.7 react-responsive-masonry@2.7.1 react-router@7.13.0 react-slick@0.31.0 recharts@2.15.2 sonner@2.0.3 tailwind-merge@3.2.0 tw-animate-css@1.3.8 vaul@1.1.2 react@18.3.1 react-dom@18.3.1

npm install -D @tailwindcss/vite@4.1.12 @types/react@^18.3.1 @types/react-dom@^18.3.1 @vitejs/plugin-react@4.7.0 tailwindcss@4.1.12 vite@6.3.5
```

### Step 3: Create Directory Structure

```bash
mkdir -p src/app/{components/{layout,ui},context,data,pages}
mkdir -p src/styles
```

### Step 4: Copy Files

Use the code from these markdown files to create each file:

1. **CODE_EXPORT_CONFIG.md** - Contains:
   - package.json
   - vite.config.ts
   - postcss.config.mjs
   - tsconfig.json
   - tsconfig.node.json
   - index.html
   - src/main.tsx

2. **Styles** - Create these in `src/styles/`:
   - index.css
   - fonts.css  
   - tailwind.css
   - theme.css (see current project file)

3. **Core App Files**:
   - src/app/App.tsx
   - src/app/routes.ts
   - src/app/data/mock-data.ts

4. **Components** - I'll provide a helper script below

### Step 5: Use Cursor AI to Generate Missing Files

Instead of manually copying every single file, use Cursor's AI:

```
1. Open Cursor
2. Open the project folder
3. Create the file structure above
4. For each missing component, ask Cursor AI:
   "Create a [component-name] component that [describe functionality]"
   
Example:
"Create an AIAssistantSidebar component with:
- Title prop
- Welcome message prop  
- Suggestion chips array
- Input field with placeholder '@ for objects, / for commands, ↕ for history'
- DoorDash branding (#FF3A00)"
```

---

## Option 3: Quick Clone Helper Script

Here's a Node.js script to help you extract all files from this project. Save this as `extract-files.js`:

```javascript
const fs = require('fs');
const path = require('path');

// List of all files to extract
const files = [
  'src/app/App.tsx',
  'src/app/routes.ts',
  'src/app/data/mock-data.ts',
  'src/app/components/layout/root-layout.tsx',
  'src/app/components/layout/top-nav.tsx',
  'src/app/components/ai-assistant-sidebar.tsx',
  'src/app/components/dashboard-card.tsx',
  // Add more files as needed
];

console.log('Files in this project:');
console.log('='.repeat(50));
files.forEach(file => {
  console.log(`📄 ${file}`);
});
console.log('='.repeat(50));
console.log('\nUse the COMPLETE_CODE_EXPORT.md file for all code snippets');
```

---

## 🎯 Recommended Approach

**For the fastest setup:**

1. ✅ **Use Figma Make's Export feature** if available (top-right corner)
2. ✅ Extract the ZIP file
3. ✅ Run `npm install` in the extracted folder
4. ✅ Run `npm run dev`
5. ✅ Open in Cursor and start customizing

**If Export is not available:**

1. ✅ Follow Option 2 to manually recreate
2. ✅ Use Cursor AI to help generate components
3. ✅ Reference COMPLETE_CODE_EXPORT.md for structure

---

## 🚨 Important: Replacing Figma Assets

The home page uses `figma:asset` imports that won't work outside Figma Make. Replace them:

### Before (Figma Make):
```tsx
import analysisImage1 from 'figma:asset/d6b9d1d8fdb529e192abe6751b36c052d614bcb5.png';
```

### After (Cursor):
```tsx
// Option 1: Use placeholder
const analysisImage1 = 'https://via.placeholder.com/800x400';

// Option 2: Use local images
const analysisImage1 = '/images/analysis1.png';

// Option 3: Use hosted images
const analysisImage1 = 'https://yourdomain.com/images/analysis1.png';
```

---

## 📋 Checklist

Before running the app in Cursor, make sure:

- [ ] All dependencies are installed (`npm install`)
- [ ] All configuration files are in place (package.json, vite.config.ts, etc.)
- [ ] All style files are created (theme.css, tailwind.css, etc.)
- [ ] Core app files exist (App.tsx, routes.ts)
- [ ] Layout components are created
- [ ] Page components are created  
- [ ] UI components are in place (use shadcn CLI or copy from project)
- [ ] Mock data file exists
- [ ] figma:asset imports are replaced with real image URLs
- [ ] TypeScript types are properly defined

---

## 🔧 Troubleshooting

### "Cannot find module 'figma:asset'"
Replace all `figma:asset` imports with regular image URLs or local paths.

### "Module not found: Can't resolve './components/ui/button'"
Install shadcn components:
```bash
npx shadcn@latest init
npx shadcn@latest add button
```

### "React is not defined"
Make sure React 18.3.1 is installed:
```bash
npm install react@18.3.1 react-dom@18.3.1
```

### Build errors with Tailwind
Ensure `@tailwindcss/vite` plugin is in vite.config.ts and tailwind.css is imported in index.css.

---

## 💡 Next Steps in Cursor

Once you have the app running:

1. **Remove mock data** - Replace with real API calls
2. **Add authentication** - Implement user login
3. **Connect to database** - Use Supabase, Firebase, or your backend
4. **Add tests** - Set up Jest and React Testing Library
5. **Deploy** - Use Vercel, Netlify, or your preferred platform

---

## 📚 Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## ✅ You're All Set!

You now have everything you need to take this DoorDash BI prototype from Figma Make to Cursor and continue building.

Good luck with your development! 🚀
