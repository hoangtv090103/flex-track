<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# FlexTrack Copilot Instructions

This is a Next.js fitness tracking application called FlexTrack built with TypeScript and Tailwind CSS.

## Project Overview

FlexTrack is a mobile-first fitness tracking application designed for athletes and fitness enthusiasts to log their workouts efficiently. The app focuses on performance optimization and user-friendly UI/UX.

## Key Technologies & Patterns

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom color scheme (blue and gray)
- **Database**: Firebase Firestore for data persistence
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React for consistent iconography

## Design Guidelines

### Color Scheme
- Primary: Blue shades (`primary-600`, `primary-500`, etc.)
- Secondary: Gray shades (`gray-600`, `gray-500`, etc.)
- Accent: Green for success states, red for errors

### Mobile-First Approach
- All components should be designed for mobile first
- Use responsive design principles
- Optimize for touch interactions
- Consider performance on mobile devices

### UI/UX Principles
- Keep forms simple and fast to fill
- Use clear visual feedback for user actions
- Minimize steps required to log workout data
- Provide instant visual confirmation of completed actions

## Code Standards

### TypeScript
- Use proper interfaces for all data structures
- Leverage type safety for API calls and state management
- Define clear types in `src/types/index.ts`

### Component Structure
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use proper prop typing

### Styling
- Use Tailwind utility classes consistently
- Follow the established design system
- Create reusable component classes in globals.css
- Maintain responsive design patterns

### Data Management
- Use Firebase Firestore for data persistence
- Implement proper error handling for all database operations
- Cache data locally when appropriate
- Ensure real-time data synchronization

## File Organization

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── lib/          # Utilities and configurations
├── services/     # API and data services
└── types/        # TypeScript type definitions
```

## Features to Maintain

1. **Workout Logging**: Fast and efficient exercise/set/rep tracking
2. **History View**: Comprehensive workout history with filtering
3. **Progress Charts**: Visual progress tracking over time
4. **Statistics**: Comprehensive workout analytics
5. **Mobile Performance**: Optimized for frequent mobile usage

## When Writing Code

- Prioritize mobile performance and responsiveness
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Include proper error handling and loading states
- Add appropriate TypeScript types
- Follow the established UI patterns and color scheme
- Ensure accessibility with proper ARIA labels and semantic HTML
- Test on mobile devices or mobile viewport

## Firebase Integration

- Use the configured Firebase instance from `src/lib/firebase.ts`
- Implement proper error handling for all Firebase operations
- Use Firestore best practices for data structure
- Consider offline capabilities and data synchronization

## Performance Considerations

- Optimize bundle size for mobile networks
- Use proper image optimization
- Implement lazy loading where appropriate
- Minimize re-renders with proper React optimization techniques
