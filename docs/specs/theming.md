---
id: VCR269
type: spec
---

# MR Theming

The app should embody a balance between serenity and unpredictability. Its aesthetic should be calming and minimal, inviting stillness, while also allowing space for gentle, organic randomness.

## Design Principles

- **Color Palette**: Soft earth tones and cool gradients (blues, muted greens, warm neutrals). Colors should feel natural, like water, stone, and sky.
- **Typography**: Clean, minimal fonts with a touch of elegance (sans-serif or humanist serif). Text should feel unobtrusive, allowing the user to focus inward.
- **Motion & Animation**: Subtle, organic movements that feel slightly unpredictable — rippling water, drifting particles, shifting gradients. The randomness should never feel chaotic, only softly surprising.
- **Overall Atmosphere**: A tranquil space where randomness is reframed as synchronicity. The app should feel like a quiet companion that suggests, not dictates.

The goal is to make the user feel both grounded and open to the unexpected — an experience where meditation is shaped not only by self-discipline but also by the flow of reality.

## Implementation Specification

### Color System

**Primary Palette**:

```css
--color-blue-light: #b8d8e8; /* Soft sky blue for accents */
--color-blue-primary: #7fb3d3; /* Primary blue for headings */
--color-blue-deep: #5a9bc4; /* Deeper blue for emphasis */

--color-green-light: #c8d8b8; /* Soft sage for backgrounds */
--color-green-primary: #a8c686; /* Muted green for elements */
--color-green-deep: #8caf5f; /* Forest green for text */

--color-neutral-lightest: #f5f1eb; /* Cream base */
--color-neutral-light: #e8e2dc; /* Warm beige */
--color-neutral-medium: #d1c7bd; /* Light tan */
--color-neutral-dark: #a39688; /* Warm brown for text */
```

**Background Gradient** (warm earth tones):

```css
linear-gradient(45deg,
  #F5F1EB,  /* Cream */
  #F0E8DC,  /* Warm beige */
  #E8D8C8,  /* Light tan */
  #E0C8A8,  /* Warm camel */
  #D8B898,  /* Sandy brown */
  #E0C8A8,  /* Warm camel */
  #E8D8C8,  /* Light tan */
  #F0E8DC,  /* Warm beige */
  #F5F1EB   /* Cream */
)
```

### Typography Scale

**Font Family**: Inter (weights 300, 400, 500)

```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;

--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Component Specifications

#### Shifting Gradient (Background Animation)

**Purpose**: Continuously moving warm gradient background that creates subtle, meditative motion.

**Parameters**:

- **Animation Duration**: 35 seconds
- **Background Size**: 400% × 400%
- **Easing**: ease-in-out
- **Z-index**: -2 (behind all content)

**Animation Keyframes**:

```css
0% {
	background-position: 0% 50%;
}
25% {
	background-position: 100% 50%;
}
50% {
	background-position: 100% 100%;
}
75% {
	background-position: 0% 100%;
}
100% {
	background-position: 0% 50%;
}
```

**Accessibility**: Animation stops completely with `prefers-reduced-motion: reduce`

#### Drifting Particles (Organic Particle System)

**Purpose**: Floating circular elements that drift organically across the screen.

**Parameters**:

- **Particle Count**: 15 (configurable)
- **Particle Size**: 20-40px diameter
- **Color**: #B8D8E8 (soft blue)
- **Animation Duration**: 20 seconds (with ±15% random variation)
- **Animation Delay**: 0-3 seconds (randomized per particle)
- **Opacity**: 0.4 base with ±20% variation
- **Z-index**: -1 (behind content, above background)

**Movement Pattern**:

```css
0% {
	transform: translate3d(0, 0, 0) scale(1);
	opacity: 0.4;
}
25% {
	transform: translate3d(10px, -30px, 0) scale(1.2);
}
50% {
	transform: translate3d(-5px, -50px, 0) scale(0.7);
	opacity: 0.32;
}
75% {
	transform: translate3d(15px, -20px, 0) scale(1.1);
}
100% {
	transform: translate3d(-8px, 20px, 0) scale(0.9);
	opacity: 0.4;
}
```

**Performance**: Uses `transform3d` for hardware acceleration

#### Breathing Container (Subtle Content Animation)

**Purpose**: Wraps main content with gentle breathing-like scaling animation.

**Parameters**:

- **Scale Range**: 1.0 to 1.02 (2% increase)
- **Animation Duration**: 7 seconds (with ±15% random variation, set once on mount)
- **Easing**: ease-in-out
- **Direction**: infinite alternate

**Optimizations**:

- Uses `scale3d(1.02, 1.02, 1)` for GPU acceleration
- `will-change: transform` hint for browser optimization
- Fixed duration to prevent stuttering

#### Meditative Card (Interactive Content Cards)

**Purpose**: Glass-morphism cards with organic hover responses for content areas.

**Base Styles**:

- **Background**: `rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(8px)`
- **Border Radius**: 1rem
- **Padding**: 2rem
- **Border**: `1px solid rgba(255, 255, 255, 0.2)`

**Hover Effects**:

- **Organic Movement**: ±2px random positioning on hover
- **Scale**: 1.02 scale increase
- **Background**: Increased to `rgba(255, 255, 255, 0.8)`
- **Transition**: 0.3s with organic cubic-bezier easing

**Variants**:

- **Primary**: Blue-green gradient background
- **Gentle**: Cream background
- **Default**: Standard glass-morphism

### Randomness Utilities

#### Controlled Randomness Functions

**gentleVariation(base, variance = 0.1)**:

- Returns: `base ± (base × variance × random)`
- Use: Subtle numeric variations

**breathingDuration(baseDuration = 4000)**:

- Returns: Duration with ±15% variation
- Use: Natural timing for animations

**organicPosition(range = 10)**:

- Returns: `{x, y}` coordinates within ±range
- Use: Subtle positioning variations

**staggeredDelay(maxDelay = 1000)**:

- Returns: Random delay 0 to maxDelay
- Use: Entrance animation timing

**subtleOpacity(baseOpacity = 0.7, variation = 0.2)**:

- Returns: Opacity with controlled variation (clamped 0.1-1.0)
- Use: Natural opacity variations

### Performance Requirements

**Hardware Acceleration**:

- All animations must use `transform3d()` instead of `transform()`
- Include `will-change: transform` for scaling animations
- Use CSS-only animations where possible

**Accessibility**:

- All animations must respect `prefers-reduced-motion: reduce`
- Reduced motion should disable animations entirely, not just reduce speed
- Maintain full functionality without animations

**Frame Rate**:

- Target 60fps for all animations
- Avoid JavaScript-driven frame updates
- Use CSS custom properties for dynamic values

### Browser Support

**Minimum Requirements**:

- CSS custom properties support
- CSS backdrop-filter support
- Hardware-accelerated transforms
- CSS animation and transition support

**Graceful Degradation**:

- Fallback colors for unsupported custom properties
- Static backgrounds for unsupported backdrop-filter
- No motion for unsupported prefers-reduced-motion

This specification ensures the meditative experience feels like a "quiet companion" that suggests rather than dictates, with every parameter calibrated for maximum tranquility and gentle surprise.
