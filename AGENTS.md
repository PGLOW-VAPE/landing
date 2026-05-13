# AGENTS.md

## Repository Expectations

- Use `yarn` commands because this project has a `yarn.lock`.
- Keep changes focused, landing-page oriented, and consistent with the existing Astro project structure.
- Prefer small, readable components when UI grows beyond a single page or repeated sections appear.
- Avoid adding new dependencies without approval.
- Ask before running destructive, long-running, network-dependent, or environment-dependent commands.
- Preserve unrelated user changes in the working tree.
- Respect the required Node version in `package.json`: `>=22.12.0`.

## Project Stack

- Astro pages live in `src/pages/`.
- Global styles live in `src/styles/global.css`.
- Tailwind CSS 4 is available through `@import "tailwindcss";` in `src/styles/global.css`.
- Tailwind is wired through the `@tailwindcss/vite` plugin in `astro.config.mjs`.
- React is planned but is not currently installed. When adding it, prefer `yarn astro add react`.
- Keep static assets in `public/`.

## Astro + Tailwind Guidance

- Prefer semantic Astro markup for static landing-page sections.
- Use Tailwind utilities directly for layout, spacing, responsive behavior, typography, and interactive states.
- Start mobile-first, then add responsive prefixes such as `sm:`, `md:`, `lg:`, and `xl:` as needed.
- Keep class strings readable; extract repeated or complex UI into Astro components when patterns repeat.
- Keep global CSS minimal and reserve it for Tailwind imports, design tokens, base styles, or truly shared rules.
- Import global Tailwind styles through shared layouts once layouts exist, so pages inherit the same styling baseline.
- Prioritize accessible markup, visible focus states, adequate contrast, and reduced-motion friendly interactions.

## Skills

### astro-tailwind-patterns

Use this skill when building or editing Astro pages, layouts, and Tailwind-styled UI.

- Keep static landing-page content in Astro by default.
- Use `src/pages/` for routes and introduce `src/components/` when sections become reusable.
- Prefer Tailwind design tokens over arbitrary values unless a specific visual adjustment is necessary.
- Keep responsive layouts stable with explicit spacing, sizing, and grid/flex behavior.
- Run `yarn build` when practical after UI or configuration changes.

### react-islands-patterns

Use this skill when React is added to the Astro project and a feature needs client-side interactivity.

- Add React with `yarn astro add react` before creating `.tsx` islands.
- Use React only for interactive islands; keep static content in Astro whenever possible.
- Hydrate intentionally with Astro client directives such as `client:load`, `client:idle`, or `client:visible`.
- Prefer the least eager hydration mode that still gives the user a responsive experience.
- Keep Astro-to-React boundaries clear by passing serializable props into React components.

### react-component-quality

Use this skill when authoring or reviewing React components.

- Prefer small typed `.tsx` components with explicit props.
- Call Hooks only at the top level of React components or custom Hooks.
- Keep state local unless it must be shared, and derive values instead of duplicating state.
- Keep side effects inside `useEffect` only when synchronization with an external system is needed.
- Use semantic elements, accessible labels, keyboard-friendly controls, and clear focus states.
- Avoid direct DOM manipulation unless refs are the appropriate React escape hatch.
- Keep styling aligned with the project's Tailwind utility patterns.

## Documentation

- Update `README.md` or future project docs when changes introduce useful setup, workflow, or architectural information.
- Keep this file concise and project-specific.
- Prefer dedicated Codex skills or separate docs for large reusable workflows instead of embedding long manuals here.

