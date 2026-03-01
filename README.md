# Saturn Animation (Style 1)

Minimal canvas-based Saturn background (7 rings, banded planet, slow spin, particles) extracted for reuse.

## Quick use in this repo
- Entry: `src/components/ui/animated-background-style1.tsx`
- Core: `src/components/ui/saturn_animation.tsx`
- Barrel: `src/index.ts` (re-export for packaging)
- Page example: `src/app/style1/page.tsx` (home re-exported from `src/app/page.tsx`)

## Consume in another Next.js app
```bash
npm i @your-scope/saturn-animation framer-motion
```
```tsx
import { AnimatedBackgroundStyle1 } from "@your-scope/saturn-animation";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black text-slate-200">
      <AnimatedBackgroundStyle1 />
      <div className="relative z-[3] min-h-screen" />
    </main>
  );
}
```

## Publish steps (npm)
1. Package metadata: `saturn-package/package.json` (peer deps: react, react-dom, framer-motion; build via tsup).
2. Barrel: `src/index.ts` exports AnimatedBackgroundStyle1 and SaturnAnimation.
3. Build: `npm install` then `npm run build` (tsup emits dist/).
4. Pack/test: `npm pack` and install the `.tgz` into another app to verify.
5. Publish: `npm publish --access public` (or to your private scope/registry).

