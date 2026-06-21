# CSS: Modern Architecture and Performance

These guidelines provide a reference for writing maintainable, performant, and standard-compliant CSS.

1. [1. Foundations](#1-foundations)
2. [2. Inheritance and The Cascade](#2-inheritance-and-the-cascade)
3. [3. Selectors and scoping](#3-selectors-and-scoping)
4. [4. Interactivity](#4-interactivity)
5. [5. Design Tokens and Theming](#5-design-tokens-and-theming)
6. [6. Responsive design](#6-responsive-design)
7. [7. Typography](#7-typography)
8. [8. Visual effects](#8-visual-effects)
9. [9. Transitions & animations](#9-transitions--animations)
10. [10. Generated content](#10-generated-content)


## 1. Foundations

Be allergic to knowledge duplication. Prefer variables over repetition, but whenever possible, prefer built-in conventions such as:
- `currentColor` instead of defining a variable and setting `color` to it
- The `inherit` keyword instead of defining a variable on the parent and using it on the same property across parent and child.
- `em` units instead of `font-size: var(--size)`
- `cqw`/`cqh` (or their logical versions — `cqi`/`cqb`) units instead of repeating box model values.
- Prefer **logical properties and values** over physical ones (e.g. `margin-inline-start` instead of `margin-left`) so that styles adapt to different writing modes and orientations.
- Do not use logical properties indiscriminately — ask yourself "would I want this to flip in RTL?" — if the answer is no, use the physical property instead.
- Consider different viewing modes (dark mode, high contrast mode), different viewport sizes, and different input modes (touch, keyboard, pointer).

## 2. Inheritance and The Cascade

**Avoid** introducing BEM naming conventions to manage specificity. Instead, use modern CSS features such as cascade layers and `:where()` to make cascade behavior predictable and follow author intent.

Use cascade layers (`@layer`) to define explicit priority zones (e.g., `reset`, `base`, `theme`, `components`, `utilities`), and declare their order upfront (e.g. `@layer reset, base, theme, components, utilities;`).
Within each layer, use `:where()` to make selectors only compete based on meaningful signals.

Use keywords like `inherit`, `initial`, `unset`, or `revert` instead of explicit values to improve maintainability and better express intent.

## 3. Selectors and scoping

Modern browser-native selectors reduce the need for preprocessors and complex state-tracking in JS.

### Prefer CSS selectors over JS for complex element targeting
- **DO** use `:has()` to style parents based on child state instead of managing classes in JS (e.g. `label:has(:checked)`).
- **DO NOT** nest `:has()` or use pseudo-elements inside it (browser API limitation).
- Use `:nth-child(<An+B> of <selector>)` when you need to style every n-th element of a certain type. E.g. `details:nth-child(1 of [open])` will style the first open `<details>` element it finds.

### Use `:is()` (or `:where()`) instead of CSS rule duplication for fallbacks
**DO NOT** duplicate CSS rules to provide fallbacks for pseudo-classes that may not be supported — use `:is()` or `:where()` instead and take advantage of their forgiving parsing rules.

```css
[popover]:where(:popover-open, .\:popover-open) {
  /* same styles in one rule */
}
```
Do NOT use this for pseudo-elements, as they are not supported in `:is()` or `:where()`.

### Avoid overmatching
Write selectors in a way that expresses _intent_.

#### Use `:not()` instead of overrides to exclude irrelevant states/targets
When the intent is to exclude certain states or elements that are fundamentally irrelevant, use `:not()`.

For example, to only apply bottom borders between list items:
```css
.fancy-list li:not(:last-child) {
  border-bottom: 1px solid silver;
}
```

Similarly, prevent active styling overrides on disabled buttons:
```css
button:hover:not(:disabled) {
  background: var(--color-blue);
}

button:disabled {
  background: var(--color-neutral);
}
```

#### Prefer `@scope` over `:not()` for excluding (potentially deeply nested) subtrees
While `:not()` + descendant selectors can exclude subtrees, this works poorly for deeply nested structures. `@scope` fixes this as it takes hierarchical proximity into account:
```css
@scope (.card) to (.content) {
  /* styles for elements inside .card but not inside .content */
}
```

#### No global resets
**DO NOT** use global resets (styles on `*`) as they cannot be overridden by web components or lower-priority cascade layers (without `!important`). Apply reset styles to specific element types.

## 4. Interactivity

### Focus management
- Use `:focus-visible` to define custom focus rings, not `:focus`.
- Do not remove the browser's default focus rings (via `outline: none`) without providing an alternative visible focus style.
- Prefer `outline` over other properties (e.g. `box-shadow`) for focus rings.
- Pair focus outlines with `outline-offset` to visually separate the ring from the element.

### Touch targets
- Interactive elements should be at least 24×24 CSS pixels. Enforce with `min-block-size` / `min-inline-size` or padding.
- Bump targets up on coarse pointers: `@media (pointer: coarse) { ... }`.
- **DON'T** use `touch-action: none` for custom gestures — scope to the axis you actually need (e.g., `pan-y` for horizontal swipes).

## 5. Design Tokens and Theming

Use CSS custom properties on `:root` to define core design variables.

### Dark mode
- Use `color-scheme: light dark` on `:root` to enable dark mode support that automatically adapts to system setting.
- Use `light-dark()` to provide alternatives that automatically resolve based on the color scheme.
- *Tip*: Resolve colors as late as possible by passing unregistered custom properties around to keep them dynamic across boundaries.

### Forced Colors Mode
In Forced Colors Mode (High Contrast on Windows), the browser overrides author colors with system keywords.
- Define system color fallbacks using `@media (forced-colors: active)`.
- Use system color keywords (e.g., `CanvasText`, `LinkText`, `ButtonText`, `Highlight`).

### Generating tints
If you need to generate lighter or darker colors dynamically:
- You can use `color-mix()` to mix with white or black (preferably in `oklab`).
- Lightness adjustment can be combined with mixing but avoid going above 30% for lightness-only modifications.

### Theming browser-generated UI
- Use `::selection` to customize highlighted text colors.
- Use `accent-color` to apply the page's accent color to any browser-generated UI.
- Use `scrollbar-color` to customize scrollbar colors and `scrollbar-width` to control thickness.
- Use `:user-invalid` / `:user-valid` for validity styling.
- Use `field-sizing: content` to make text fields size to content dynamically.

## 6. Responsive design
- Use `@container` queries to create component-driven responsive layouts.
- Use dynamic viewport units (`dvh`, `dvw`) instead of `vh`/`vw` on mobile to prevent layout shifting.
- Use `aspect-ratio` for media elements to reserve space during loading.
- Use font size `clamp()` to dynamically scale text sizes between screens.

## 7. Typography
- Use unitless numbers for `line-height` (e.g., `1.5`) to ensure relative scaling.
- Use `overflow-wrap: break-word` to contain long URLs.
- **DON'T** use `px` for font-size. Prefer `rem` or `em`.
- Use `text-wrap: balance` for headlines and `text-wrap: pretty` for long paragraphs (apply selectively for performance).

## 8. Visual effects
- Layer multiple shadows for realistic soft depth effects.
- Use `filter: drop-shadow()` instead of `box-shadow` for non-rectangular shapes.
- Use `in oklch` or `in oklab` to explicitly specify the interpolation color space for gradients.

## 9. Transitions & animations
- Prefer to animate `opacity` and `transform` (e.g., `translate` instead of `left`) to ensure compositing.
- Use `transition-behavior: allow-discrete` + `@starting-style` to animate layout properties like `display`.
- Always pair `content-visibility: auto` with `contain-intrinsic-size` to optimize rendering speed.
- Respect accessibility settings: use `prefers-reduced-motion` to tone down transitions.

## 10. Generated content
- **DON'T** use `content` to convey meaningful text. Keep content inside the DOM.
- Use the alternative text argument of `content` (e.g. `content: url(cloud.svg) / "Save";`) to provide accessibility options.
