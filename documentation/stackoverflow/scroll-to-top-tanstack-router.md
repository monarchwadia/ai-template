# TanStack Router `scrollRestoration` blocks manual `scrollTo(0)` on route change

**Tags:** tanstack-router, scroll-behavior, css, react

---

## Question

I'm using TanStack Router with React and I want smooth scroll-to-top when users navigate between routes. I added `scrollRestoration: true` to the router config and `scroll-behavior: smooth` in CSS, then called `window.scrollTo({ top: 0, left: 0 })` after each navigation. It works on some routes but not others, and I can't figure out why.

### Setup

**Router config (`main.tsx`):**

```tsx
const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});
```

**CSS (`index.css`):**

```css
html {
  scroll-behavior: smooth;
}
```

**Nav click handler (`__root.tsx`):**

```tsx
function handleNavClick(href: string) {
  void navigate({ to: href }).then(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
}
```

### Reproduction steps

1. Navigate to `/page-a` and scroll down the page so `scrollY` is around 775px.
2. Click a nav link to `/page-b`. The page smoothly scrolls to top. This works.
3. Scroll down on `/page-b` so `scrollY` is around 884px.
4. Click a nav link to `/page-a`. **The page gets stuck at 775px and never reaches the top.** Even calling `scrollTo(0)` multiple times in `requestAnimationFrame`, `setTimeout(50)`, `setTimeout(200)`, and `setTimeout(500)` does not move it.
5. Navigate back to `/page-b`. It scrolls to top correctly again.
6. Navigate to `/page-a` again. Stuck at 775px again.

### Observed behavior (console logs)

The pattern is always the same: going TO `/page-a` gets stuck, going to `/page-b` works fine.

```
[nav] handleNavClick called { href: "/page-b", currentPath: "/page-a", currentScrollY: 752 }
[nav] .then() fired, scrollY: 416
[nav] 200ms, scrollY: 204
[nav] 500ms, scrollY: 4          // Scrolled to top. Works!

[nav] handleNavClick called { href: "/page-a", currentPath: "/page-b", currentScrollY: 884 }
[nav] .then() fired, scrollY: 775
[nav] 200ms, scrollY: 775
[nav] 500ms, scrollY: 775        // Stuck at 775. Does not scroll!
```

Note that 775px is the exact scroll position from when I previously visited `/page-a` in step 1. It seems like the saved position is being restored and overriding my `scrollTo(0)`.

### What I've tried

- Calling `scrollTo(0)` in the `.then()` callback: Doesn't stick on the stuck routes.
- Calling `scrollTo(0)` in `requestAnimationFrame`: Same result.
- Calling `scrollTo(0)` in `setTimeout` at 50ms, 200ms, and 500ms: Still stuck.
- Removing `scroll-behavior: smooth` from CSS: Changes the behavior slightly but still stuck.

Why does `scrollTo(0)` work for some routes but get completely ignored for others?

---

## Answer

The problem is that `scrollRestoration: true` and manual `scrollTo()` with `scroll-behavior: smooth` are fundamentally incompatible. Here's why.

### What `scrollRestoration: true` does

When you set `scrollRestoration: true` on TanStack Router's `createRouter()`, the router:

1. **Saves** the scroll position when you leave a route.
2. **Restores** that saved position when you return to the route.

This is designed for back/forward browser history navigation (e.g., user hits the back button and expects to be where they left off). It is NOT designed for forward navigation where you want scroll-to-top.

### Why it creates a deadlock with `scroll-behavior: smooth`

With `scroll-behavior: smooth` in CSS, `window.scrollTo()` starts an **asynchronous animation** instead of jumping instantly. If anything calls `scrollTo()` again during that animation, the browser **cancels** the in-progress animation and starts a new one.

Here's what happens on each navigation:

1. Route changes, your `.then()` fires: `scrollTo({ top: 0 })` starts a smooth animation toward 0.
2. TanStack Router's scroll restoration fires: `scrollTo({ top: 775 })` cancels your animation and starts one toward 775.
3. Your retry at 200ms fires: `scrollTo({ top: 0 })` tries again, but restoration may fire again or the animation to 775 has already completed.

The router's restoration always wins because it fires after your callback.

### Why it's asymmetric (works for some routes, not others)

The saved position for `/page-b` was either 0 (first visit) or near the top, so restoration and your `scrollTo(0)` agree on the same target. For `/page-a`, the saved position was 775px, so they fight. Whatever route you previously scrolled down on will be the one that gets stuck.

### How to verify

Monkey-patch `window.scrollTo` to log every call with a stack trace:

```tsx
const origScrollTo = window.scrollTo.bind(window);
window.scrollTo = function (...args) {
  console.log("[scrollTo-intercept]", args, new Error().stack);
  return origScrollTo(...args);
};
```

You'll see the router calling `scrollTo` with saved positions after your manual calls.

### Fix

Remove `scrollRestoration: true` from the router and handle scroll-to-top manually:

```tsx
// main.tsx
const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  // Do NOT use scrollRestoration: true with manual scrollTo
});
```

```tsx
// Nav click handler
void navigate({ to: href }).then(() => {
  window.scrollTo({ top: 0, left: 0 });
});
```

```css
/* CSS handles the smooth animation */
html {
  scroll-behavior: smooth;
}
```

The CSS `scroll-behavior: smooth` applies to all programmatic `scrollTo` calls, so you get smooth animation without any conflict.

### When SHOULD you use `scrollRestoration: true`?

Use it when you want the browser back/forward buttons to restore scroll positions and you are NOT also manually calling `scrollTo()` on navigation. If you need scroll-to-top on forward navigation with smooth scrolling, manage it yourself.
