# NETMAXIN Theme System Guide

## Available Themes

The website now includes 6 unique, professionally-designed themes:

### 1. **Light Theme** (Default)
- Clean, bright interface with soft grays
- Perfect for professional/corporate settings
- Purple primary color with golden accents
- Excellent contrast for readability

### 2. **Dark Theme** (Default for new users)
- Modern dark interface with slate backgrounds
- Vibrant purple and cyan gradients
- Reduced eye strain in low-light conditions
- Premium glass-morphism effects

### 3. **Corporate Theme**
- Professional, traditional business aesthetic
- Deep blue primary color (#1e40af equivalent)
- Conservative golden accents
- Business-focused typography
- Light background for document-like appearance

### 4. **Corporate Dark Theme**
- Dark variant of corporate theme
- Deep blue on dark background
- Formal, enterprise-grade appearance
- Combines corporate professionalism with dark mode benefits

### 5. **Minimal Theme**
- Clean, stripped-down interface
- Grayscale with subtle accents
- Maximum focus on content
- Perfect for content-heavy pages
- Reduced visual noise

### 6. **Minimal Dark Theme**
- Dark minimal aesthetic
- High contrast with essential elements
- Perfect for accessibility
- Distraction-free experience

## Theme Switching

### For Users
Users can switch themes using the theme selector in the navigation bar. The theme preference is saved to localStorage and persists across sessions.

### For Developers
Use the `<ThemeSelector />` component in navigation or create custom theme switchers:

```tsx
import ThemeSelector from '@/components/theme-selector'

export default function MyComponent() {
  return <ThemeSelector />
}
```

## Animation System

All components now include smooth entrance and interactive animations:

### Available Animation Classes

- `.animate-fade-in` - Fade in effect
- `.animate-slide-up` - Slide up from bottom
- `.animate-slide-down` - Slide down from top
- `.animate-slide-left` - Slide from left
- `.animate-slide-right` - Slide from right
- `.animate-pulse-glow` - Pulsing glow effect
- `.animate-float` - Floating animation

### Using Animations

```tsx
<div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
  Content
</div>
```

### Scroll-Based Animations

Use the `useScrollAnimation` hook for elements that should animate when they come into view:

```tsx
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

export default function Component() {
  const { elementRef, isVisible } = useScrollAnimation()
  
  return (
    <div ref={elementRef} className={isVisible ? 'animate-slide-up' : ''}>
      Content
    </div>
  )
}
```

## Performance Optimizations

1. **Lazy Animations**: Animations only trigger on viewport intersection
2. **GPU Acceleration**: Use of `will-change` for smooth 60fps animations
3. **Optimized Scrolling**: Custom scrolling carousel with performance in mind
4. **Theme Loading**: Themes load instantly from localStorage with no flash
5. **CSS-based Animations**: Efficient keyframe animations instead of JS

## Customizing Themes

To add or modify themes, edit `/app/globals.css`:

```css
[data-theme="your-theme"] {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.65 0.22 280);
  --accent: oklch(0.60 0.25 260);
  /* ... other color variables ... */
}
```

Then add the theme option to `THEMES` array in `/components/theme-selector.tsx`.

## Glass Morphism Effect

The site uses glass-morphism for a modern, premium feel:

```tsx
<div className="glass dark:glass-dark">
  Content with frosted glass effect
</div>
```

## Color Variables

Each theme defines these CSS variables:
- `--background` - Page background
- `--foreground` - Text color
- `--card` - Card backgrounds
- `--primary` - Primary action color
- `--accent` - Accent/highlight color
- `--border` - Border color
- `--muted` - Muted text color
- `--ring` - Focus ring color

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties (Variables)
- CSS Animations
- IntersectionObserver API
- localStorage

## Best Practices

1. Always use semantic color variables instead of hardcoded colors
2. Add animation delays for staggered effects: `style={{animationDelay: '0.1s'}}`
3. Use `hover:scale-105` for interactive feedback
4. Test all themes during development
5. Ensure sufficient contrast ratios for accessibility
