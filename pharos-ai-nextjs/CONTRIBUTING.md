# Contributing to Pharos

Thanks for contributing.

## Before You Start

- Read `README.md` for setup.
- Read `CODEX.md` before touching frontend code.
- Keep changes small and focused.
- Do not mix unrelated cleanup into feature work.

## Development Workflow

1. Install dependencies with `npm install`
2. Copy `.env.local.example` to `.env.local`
3. Run the app with `npm run dev`
4. Run the quality checks before opening a PR

## Pull Request Expectations

- Explain the problem being solved.
- Describe the approach taken.
- List any follow-up work left out of scope.
- Include verification steps or screenshots when relevant.

## Code Standards

- Follow the conventions in `CODEX.md`.
- Reuse shared utilities instead of redefining them locally.
- Keep route handlers, components, and helpers focused.
- Prefer feature-local organization when adding new code.

## Scope Discipline

Please avoid these unless the PR is explicitly about them:

- mass formatting changes
- broad renames across unrelated areas
- drive-by refactors in touched files
- changing generated code by hand

## Issues

When filing an issue, include:

- a clear description of the problem
- steps to reproduce
- expected behavior
- actual behavior
- screenshots or logs if useful

## Security

Do not open public issues containing secrets, tokens, credentials, or exploit details. Use the process in `SECURITY.md`.
