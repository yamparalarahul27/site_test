# saturn_animation (Style 1)
Canvas-based Saturn background for Next.js/React apps with 7 rings, banded planet surface, slow spin, and particles.

## Files (copy these to another app)
- `src/components/ui/saturn_animation.tsx` (canvas + rings + planet + particles)
- `src/components/ui/animated-background-style1.tsx` (wrapper: base glows, noise, vignette)
- `src/components/ui/index.ts` export entries:
  ```ts
  export * from "./animated-background-style1";
  export { SaturnAnimation } from "./saturn_animation";
  ```

## Dependencies
- React 18+
- framer-motion (`npm i framer-motion`)

## Usage (Next.js App Router)
```tsx
import { AnimatedBackgroundStyle1 } from "@/components/ui";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black text-slate-200">
      <AnimatedBackgroundStyle1 />
      <div className="relative z-[3] min-h-screen">{/* content */}</div>
    </main>
  );
}
```
Keep a dark background; ensure content z-index > 2 so it renders above the canvas.

## Key parameters (in `saturn_animation.tsx`)
- Position: `cx = 0.5 * w`, `cy = 0.55 * h` (slightly below center).
- Tilt: none (`ctx.rotate(0)` for system tilt).
- Spin: `spinAngle = t * 0.00005` (slow self-rotation). Increase factor to spin faster.
- Rings: 7 layers (D, C, B, A, F, G, E) with purple/indigo/cyan gradients and tuned alpha.
- Planet bands palette: `#051F5C`, `#051742`, `#0F1F44`, `#0A152E`, `#060C1A` (modest alpha). Glow uses the same purple/indigo/cyan family.
- Particles: 10 orbiting specks (slow drift), rendered above rings.
- DPR clamp: `Math.min(devicePixelRatio, 1.5)` to reduce CPU.

## Optional tweaks
- Move Saturn: adjust `cy` (e.g., `0.5 * h` for exact center).
- Spin speed: change `spinAngle` factor.
- Brightness: lower ring alphas or band alphas; adjust gradient stops.
- Performance: reduce ring/particle counts or alpha; lazy-load the background.

## Packaging as npm
- Keep `"use client"` at top of TSX files.
- Set peer deps to `react`, `react-dom`, `framer-motion`.
- Build with `tsup` or `tsc`; expose via `src/index.ts`:
  ```ts
  export * from "./animated-background-style1";
  export { SaturnAnimation } from "./saturn_animation";
  ```
- Publish or `npm pack` and install via tarball in other projects.
