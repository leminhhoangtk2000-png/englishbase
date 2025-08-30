# CommentSystem Component

## 📍 Location
`/src/components/exercises/CommentSystem.tsx`

## 🎯 Features
- **GitHub-style design** with Primer color system
- **Claps system** (👏) instead of likes
- **Nested replies** with visual hierarchy  
- **Mock data fallback** for demo purposes
- **Responsive design** with mobile support
- **Dark mode optimized** with proper contrast
- **TypeScript** with full type safety

## 🎨 Design
- Clean bordered container with GitHub colors
- Green submit buttons (GitHub-style)
- Proper typography hierarchy and spacing
- Smooth transitions and hover states
- Focus rings for accessibility

## 📋 Usage
```tsx
<CommentSystem 
  exerciseId="unique-exercise-id"
  currentUserId="user123"
  currentUserName="User Name"
  currentUserAvatar="/path/to/avatar.jpg"
  showCommentsInitially={true}  // Optional: show comments by default
/>
```

## 🔧 Props
- `exerciseId`: Unique identifier for the exercise
- `currentUserId`: ID of the current user (optional)
- `currentUserName`: Display name (default: "Khoavo Private")
- `currentUserAvatar`: Avatar image URL (optional)
- `showCommentsInitially`: Show comments expanded (default: false)

## 🚀 Integration
- Registered in `exercise-registry.ts` for MDX usage
- Available in all exercise MDX files
- Compatible with the exercise content system

## 💾 Data
Currently uses mock data for demonstration. Ready for API integration with the existing `/api/comments` endpoint.
