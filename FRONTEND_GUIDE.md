# Frontend Development Guide

Complete guide for developing and maintaining the AI Quiz App frontend.

## Project Overview

The frontend is built with:
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main page with state management
│   ├── globals.css          # Global styles
│   └── favicon.ico
├── components/
│   ├── QuizForm.tsx         # Quiz creation form
│   ├── QuizTaking.tsx       # Quiz taking interface
│   ├── QuizResults.tsx      # Results display
│   └── QuizHistory.tsx      # Quiz history view
├── lib/
│   └── config.ts            # API configuration
├── public/                  # Static assets
├─��� .env.local               # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Component Architecture

### Page Component (app/page.tsx)

**Responsibility**: Main state management and page routing

**State:**
- `currentPage`: Current view (home, taking, results, history)
- `currentQuiz`: Active quiz data
- `results`: Quiz results data

**Props Passed:**
- `QuizForm`: `onQuizGenerated`
- `QuizTaking`: `quiz`, `onQuizSubmitted`
- `QuizResults`: `results`, `onBackToHome`
- `QuizHistory`: `onBack`

### QuizForm Component

**Responsibility**: Quiz creation and generation

**Features:**
- Topic input field
- Difficulty selector (Easy/Medium/Hard)
- Questions slider (5-20)
- Form validation
- Loading state
- Error handling

**Props:**
```typescript
interface QuizFormProps {
  onQuizGenerated: (quiz: any) => void;
}
```

**State:**
- `topic`: string
- `difficulty`: string
- `numQuestions`: number
- `loading`: boolean
- `error`: string

**API Call:**
```typescript
POST /api/generate-quiz/
{
  topic: string,
  difficulty: string,
  num_questions: number
}
```

### QuizTaking Component

**Responsibility**: Quiz interface and answer tracking

**Features:**
- Question display
- Multiple choice options
- Progress bar
- Navigation (Previous/Next)
- Answer tracking
- Submit button

**Props:**
```typescript
interface QuizTakingProps {
  quiz: Quiz;
  onQuizSubmitted: (results: any) => void;
}
```

**State:**
- `currentQuestionIndex`: number
- `answers`: Record<number, string>
- `loading`: boolean
- `error`: string

**API Call:**
```typescript
POST /api/submit-quiz/
{
  quiz_id: number,
  answers: Array<{
    question_id: number,
    selected_answer: string
  }>
}
```

### QuizResults Component

**Responsibility**: Results display and feedback

**Features:**
- Circular progress indicator
- Performance level feedback
- Score breakdown
- Personalized feedback
- Action buttons

**Props:**
```typescript
interface QuizResultsProps {
  results: ResultsData;
  onBackToHome: () => void;
}
```

**Performance Levels:**
- 90%+: Excellent (Green)
- 75-89%: Good (Blue)
- 60-74%: Fair (Yellow)
- <60%: Needs Improvement (Red)

### QuizHistory Component

**Responsibility**: Quiz history display and statistics

**Features:**
- Quiz list with details
- Difficulty badges
- Creation date
- Statistics dashboard
- Empty state handling

**Props:**
```typescript
interface QuizHistoryProps {
  onBack: () => void;
}
```

**API Call:**
```typescript
GET /api/quizzes/
```

## Styling Guide

### Color Scheme

```css
/* Primary Colors */
--blue-600: #2563eb
--blue-700: #1d4ed8
--cyan-600: #06b6d4
--cyan-700: #0891b2

/* Background Colors */
--slate-900: #0f172a
--slate-800: #1e293b
--slate-700: #334155
--slate-600: #475569

/* Status Colors */
--green-400: #4ade80
--yellow-400: #facc15
--red-400: #f87171
```

### Tailwind Classes Used

**Layout:**
- `flex`, `grid`: Flexbox and grid layouts
- `gap-*`: Spacing between items
- `p-*`, `px-*`, `py-*`: Padding
- `m-*`, `mx-*`, `my-*`: Margin

**Typography:**
- `text-*`: Font sizes
- `font-bold`, `font-semibold`: Font weights
- `text-white`, `text-slate-*`: Text colors

**Components:**
- `rounded-lg`: Border radius
- `border-*`: Borders
- `shadow-xl`: Box shadows
- `bg-gradient-to-r`: Gradients

**States:**
- `hover:`: Hover states
- `disabled:`: Disabled states
- `focus:`: Focus states
- `transition-*`: Animations

## API Integration

### Configuration

API base URL is configured in `lib/config.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

Environment variable in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Error Handling

All API calls include error handling:

```typescript
try {
  const response = await fetch(`${API_BASE_URL}/endpoint/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch');
  }

  const data = await response.json();
  // Handle success
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}
```

### Loading States

All async operations show loading indicators:

```typescript
{loading ? (
  <span className="flex items-center justify-center gap-2">
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    Loading...
  </span>
) : (
  'Submit'
)}
```

## Development Workflow

### Running Development Server

```bash
npm run dev
```

Access at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Component Development Checklist

When creating new components:

- [ ] Define TypeScript interfaces for props
- [ ] Add proper error handling
- [ ] Include loading states
- [ ] Add accessibility attributes (aria-*, alt text)
- [ ] Use semantic HTML
- [ ] Implement responsive design
- [ ] Add proper styling with Tailwind
- [ ] Test with different screen sizes
- [ ] Handle edge cases
- [ ] Add comments for complex logic

## Performance Optimization

### Code Splitting

Next.js automatically code-splits at the page level. Components are lazy-loaded as needed.

### Image Optimization

Use Next.js Image component for optimization:

```typescript
import Image from 'next/image';

<Image
  src="/image.png"
  alt="Description"
  width={100}
  height={100}
  priority
/>
```

### CSS Optimization

Tailwind CSS is configured to purge unused styles in production.

### Bundle Analysis

```bash
npm run build
# Check .next/static for bundle sizes
```

## Testing

### Manual Testing Checklist

- [ ] Quiz generation with various topics
- [ ] Difficulty level selection
- [ ] Question count variation
- [ ] Quiz taking with all options
- [ ] Answer submission
- [ ] Results calculation
- [ ] Quiz history display
- [ ] Error handling (network, validation)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Navigation between pages

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

### Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Approach

```typescript
// Mobile first
<div className="text-sm md:text-base lg:text-lg">
  Content
</div>
```

## Accessibility

### Best Practices

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add aria-* attributes where needed
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Color Contrast**: Maintain sufficient contrast ratios
5. **Alt Text**: Provide alt text for images
6. **Focus States**: Visible focus indicators

### Example

```typescript
<button
  onClick={handleClick}
  aria-label="Submit quiz"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Submit
</button>
```

## Common Patterns

### Form Handling

```typescript
const [formData, setFormData] = useState({
  topic: '',
  difficulty: 'medium',
  numQuestions: 5,
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle submission
};
```

### Conditional Rendering

```typescript
{loading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{!loading && !error && <Content />}
```

### List Rendering

```typescript
{items.map((item) => (
  <div key={item.id} className="...">
    {item.name}
  </div>
))}
```

## Debugging

### Browser DevTools

1. **React DevTools**: Inspect component hierarchy
2. **Network Tab**: Monitor API calls
3. **Console**: Check for errors and warnings
4. **Application Tab**: View local storage and cookies

### Common Issues

**CORS Error:**
- Check API_BASE_URL in .env.local
- Verify backend CORS configuration
- Clear browser cache

**API Not Found:**
- Verify backend is running
- Check endpoint URLs
- Review API documentation

**Styling Issues:**
- Clear .next folder: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind config

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically on push

```bash
# Or deploy manually
vercel deploy
```

### Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Development (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Production

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Code Style

### Naming Conventions

- **Components**: PascalCase (QuizForm.tsx)
- **Functions**: camelCase (handleSubmit)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL)
- **Variables**: camelCase (currentPage)

### File Organization

```typescript
// 1. Imports
import { useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export default function Component({ prop }: Props) {
  // ...
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/)

## Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Contributing

When contributing to the frontend:

1. Create a new branch
2. Make changes following the style guide
3. Test thoroughly
4. Submit a pull request
5. Ensure all tests pass

---

**Last Updated**: 2024
**Version**: 1.0.0
