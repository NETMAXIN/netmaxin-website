# Quick Start - Themes & Animations

## Switch Themes (For Users)
1. Open the website
2. Click the theme selector icon (☀️/🌙/💼/⚪) in the top navigation
3. Choose from 6 themes:
   - ☀️ Light
   - 🌙 Dark
   - 💼 Corporate
   - 🏢 Corporate Dark
   - ⚪ Minimal
   - ⚫ Minimal Dark
4. Your preference is saved automatically

## Add Animations (For Developers)

### Simple Animation
```tsx
<div className="animate-slide-up">
  This slides in from the bottom
</div>
```

### With Staggered Effect
```tsx
{items.map((item, idx) => (
  <div
    key={idx}
    className="animate-slide-up hover:scale-105"
    style={{animationDelay: `${idx * 0.1}s`}}
  >
    {item}
  </div>
))}
```

### Scroll-Triggered Animation
```tsx
'use client'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

export default function Section() {
  const { elementRef, isVisible } = useScrollAnimation()
  
  return (
    <div 
      ref={elementRef} 
      className={isVisible ? 'animate-slide-up' : 'opacity-0'}
    >
      Content appears when scrolled into view
    </div>
  )
}
```

## Available Animation Classes

| Class | Effect |
|-------|--------|
| `animate-fade-in` | Fade in smoothly |
| `animate-slide-up` | Slide up from bottom |
| `animate-slide-down` | Slide down from top |
| `animate-slide-left` | Slide from left |
| `animate-slide-right` | Slide from right |
| `animate-pulse-glow` | Pulsing glow effect |
| `animate-float` | Floating movement |

## Glass Effect

```tsx
<div className="glass dark:glass-dark">
  This has a frosted glass effect
</div>
```

## Gradient Text

```tsx
<h1 className="gradient-text">
  Gradient colored text
</h1>
```

## Theme Colors in CSS

Each theme provides these variables:
- `--background` - Main background
- `--foreground` - Text color
- `--primary` - Primary action color
- `--accent` - Accent color
- `--border` - Border color

Use them in your styles:
```css
.my-element {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

## Hover Effects

```tsx
<div className="hover:scale-105 hover:shadow-lg transition-all duration-300">
  Hover me!
</div>
```

## Common Patterns

### Card with Animation
```tsx
<div className="glass dark:glass-dark p-6 rounded-xl animate-slide-up hover:scale-105 transition-transform">
  Card content
</div>
```

### Button with Glow
```tsx
<button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/60 transition-all">
  Click me
</button>
```

### Text Reveal on Scroll
```tsx
const { elementRef, isVisible } = useScrollAnimation()
<h2 ref={elementRef} className={isVisible ? 'animate-slide-up' : ''}>
  Title
</h2>
```

## Performance Tips

1. ✅ Use `will-change: transform` for animated elements
2. ✅ Prefer CSS animations over JavaScript
3. ✅ Stagger animations with delays for visual flow
4. ✅ Use Intersection Observer for scroll animations
5. ❌ Avoid animating large numbers of elements at once
6. ❌ Don't use `animation` on hover (use `transition` instead)

## Troubleshooting

**Theme not changing?**
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

**Animations not smooth?**
- Check browser performance: DevTools → Performance tab
- Reduce number of simultaneous animations
- Use GPU acceleration: `transform` instead of `position`

**Animation too fast/slow?**
- Adjust in globals.css animation definitions
- Use `animation-delay` for timing

## Need Help?

See:
- `THEME_GUIDE.md` - Detailed theme documentation
- `UPDATES_SUMMARY.md` - Complete feature overview
- Component source code for implementation examples
