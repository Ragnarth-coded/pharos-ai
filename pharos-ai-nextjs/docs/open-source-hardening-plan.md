# Open Source Hardening Plan

## Goal

Prepare Pharos for a public-source release where contributors can understand, run, and improve the codebase without weakening product quality, operational safety, or the quality bar for the main hosted deployment.

## Current State

The repo already has strong product intent, a clear internal frontend codex, and a meaningful application surface. The main weakness is not lack of ambition, but lack of enforced consistency. Several important standards exist only in documentation, while the repository structure, tooling, and contributor surface still feel internal.

## Findings

### Critical

#### 1. Quality gates are incomplete

- `package.json` has no `typecheck`, `test`, `check`, or `ci` scripts.
- There are no automated tests in the repository.
- There is no GitHub Actions workflow under `.github/workflows`.
- `tsconfig.json` uses `strict: true`, but there is no regular automated enforcement around it.

Impact:

- Contributors can open PRs that look valid locally but fail basic quality expectations later.
- The project cannot yet guarantee a consistent merge bar for public contributions.

Recommended action:

- Add explicit scripts for `typecheck`, `check`, and `ci`.
- Add baseline CI for lint, typecheck, and build.
- Add tests incrementally, starting with pure helpers and route validation logic.

#### 2. Public repo surface is not ready yet

- `README.md` is still the default Create Next App template.
- There is no `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, or `SECURITY.md`.
- There are no issue templates, PR templates, or ownership conventions.

Impact:

- The repo does not explain what the project is, how to run it, or how to contribute safely.
- Opening the code before adding these files would create friction and ambiguity for contributors.

Recommended action:

- Replace the README.
- Add core OSS repo files and GitHub templates.

#### 3. Docs and implementation have drifted apart

- `docs/ADMIN_API_SPEC.md` describes a much larger admin API surface than the routes currently implemented in `src/app/api/v1/admin/**`.
- `docs/agent_manual.md` and `src/lib/agent-manual.ts` are both acting like source-of-truth documents.
- `src/lib/agent-manual.ts` explicitly says the markdown manual should not be edited directly.

Impact:

- Public contributors will not know which spec is authoritative.
- API work becomes risky because code review must compare against multiple conflicting sources.

Recommended action:

- Decide on one source of truth for each domain.
- Align docs with the implemented API before inviting external contributions.

#### 4. Sensitive admin token handling should be tightened

- `src/app/api/v1/admin/[conflictId]/instructions/route.ts` reflects the bearer token back into the generated manual.

Impact:

- Even if this is currently intentional for internal agent workflows, it is a poor default for a public repository and increases risk around secret handling.

Recommended action:

- Remove token echoing from response payloads and document auth separately.

### High

#### 5. Project structure is understandable internally, but confusing publicly

- `src/api/**` contains client query modules.
- `src/app/api/**` contains Next.js route handlers.
- The name `api` currently means two different things.

Impact:

- Contributors will misread boundaries and ownership.
- New code will continue drifting unless naming and placement are clarified.

Recommended action:

- Rename the client-side query layer or reorganize around features.

#### 6. Layer boundaries are inconsistent

- `src/components/dashboard/WorkspaceDashboard.tsx` imports `src/app/dashboard/overview/CasChip.tsx`.
- `src/store/map-slice.ts` imports `SelectedItem` from `src/components/map/MapDetailPanel.tsx`.

Impact:

- Route-layer code is leaking into reusable UI.
- State types depend on presentation files, which makes refactors fragile.

Recommended action:

- Move reusable components out of `src/app`.
- Move shared map types into a non-UI module.

#### 7. Several large files are doing too much

Examples:

- `src/components/dashboard/WorkspaceDashboard.tsx`
- `src/components/news/NewsTimeline.tsx`
- `src/lib/agent-manual.ts`
- `src/app/api/v1/admin/[conflictId]/workspace/route.ts`

Impact:

- Reviewability is poor.
- New contributors will struggle to change one concern without touching many unrelated ones.

Recommended action:

- Split these files into smaller modules with clear ownership.

#### 8. Route handlers mix transport, validation, querying, and response shaping

- Many admin route files perform auth checks, Prisma access, business rules, and JSON shaping inline.

Impact:

- Logic is duplicated.
- Create and update paths are more likely to drift.

Recommended action:

- Introduce thin route handlers with extracted validation/service helpers.

### Medium

#### 9. Environment setup and onboarding are incomplete

- `.env.local.example` does not fully match documented environment requirements such as `PHAROS_ADMIN_API_KEY`.
- Some env usage relies on non-null assertions, such as `src/api/keys.ts` and `src/lib/db.ts`.

Impact:

- New contributors are more likely to hit runtime failures instead of clear setup errors.

Recommended action:

- Expand the example env file.
- Add explicit environment validation.

#### 10. Electron and web concerns are mixed together

- `package.json` combines web, Prisma, and Electron workflows.
- `electron/main.js` lives inside the same app package.

Impact:

- The public web contribution surface is larger and noisier than it needs to be.

Recommended action:

- Keep desktop support for now, but optimize for a web-first public structure.
- Consider splitting later if desktop becomes a separately maintained product surface.

#### 11. Conflict-specific assumptions are too deeply embedded

- `src/api/keys.ts` defaults query keys off `NEXT_PUBLIC_CONFLICT_ID`.
- Several data files and UI assumptions are still specific to the Iran scenario.

Impact:

- The app feels less like a generalized platform and more like a one-off internal deployment.

Recommended action:

- Gradually isolate scenario-specific content from reusable product logic.

### Low

#### 12. Tooling reproducibility can be stronger

- There is no declared `engines` field.
- There is no pinned package manager metadata.
- There is no Node version file.

Recommended action:

- Pin the expected runtime versions for contributors and CI.

#### 13. Repo hygiene needs a final pass

- Generated and local runtime artifacts should be more clearly excluded from linting and git workflows.
- The repository root `.gitignore` does not currently ignore `.vercel/`.

Recommended action:

- Tighten ignore rules.

## Priority Roadmap

### Phase 1 - Public Repo Basics

1. Replace the default README with a real project overview.
2. Add license and contributor-facing policy files.
3. Add issue and PR templates.

### Phase 2 - Enforced Quality Gates

1. Add `typecheck`, `check`, and `ci` scripts.
2. Add GitHub Actions for lint, typecheck, and build.
3. Tighten ESLint ignores and repo hygiene.

### Phase 3 - Documentation Alignment

1. Decide which docs are canonical.
2. Align API docs with implemented behavior.
3. Remove or rewrite stale internal-only guidance.

### Phase 4 - Structural Cleanup

1. Clarify client/server API naming.
2. Move reusable components out of route folders.
3. Extract shared types out of UI modules.
4. Split oversized files.

### Phase 5 - Hardening Through Tests

1. Add tests for pure helpers and route validation.
2. Add higher-value integration coverage around admin API behavior.

## Near-Term Implementation Order

1. Repo docs and OSS baseline files
2. CI and scripts
3. Secret/env cleanup
4. Doc/source-of-truth cleanup
5. Structural refactors
6. Test expansion

## Definition of Open-Source Ready

The project should be considered ready for a public-source release when all of the following are true:

- A new contributor can understand the project from the README and docs.
- A contributor can install dependencies, configure env vars, and run the app without guessing.
- CI enforces lint, typecheck, and build on every PR.
- Core docs match the implemented code surface.
- Shared architecture rules are reflected in both docs and tooling.
- The repository avoids obvious secret-handling footguns.
- The most central code paths are covered by at least baseline automated tests.
