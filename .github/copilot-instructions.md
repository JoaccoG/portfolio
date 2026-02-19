# Copilot Instructions

## Project

Joaquin Godoy's professional portfolio.

## Tech stack

- **Framework**: React 19
- **Language**: TypeScript
- **Bundler**: Vite
- **Package manager**: pnpm
- **Testing**: Vitest + @testing-library/react
- **Linting**: ESLint + Prettier

## Code style

- Arrow functions over function declarations
- Early returns for simple conditions
- Omit braces for single-line conditionals
- Named exports only — no default exports unless a framework specifically requires it
- No barrel files (`index.ts` re-exports)
- Group imports: external → internal absolute → relative
- Use destructuring for parameters and objects unless it's
- Prefix booleans with `is`, `has`, `can`, `should`, etc.
- Named constants over magic numbers/strings
- Null-safe operators (`?.`, `??`) over manual null checks

## TypeScript

- Strict mode enabled — NEVER use `any`
- Avoid `unknown` unless truly unavoidable
- Use `import type` for type-only imports
- Use `const` over `let` and never use `var`

## Testing

- Test files live next to the file they test (co-located)
- Use the `describe` function to group tests
- Use the `it` function to test a single unit
- Follow the Given-When-Then (Gherkin) pattern

## Documentation

- Use JSDoc for function and class/interface documentation
- Use inline comments for simple explanations

## Commits

Follow Conventional Commits: `<type>(optional scope): <description>` Valid types: `feat`, `fix`, `refactor`, `style`,
`test`, `docs`, `chore`, `perf`, `ci`, `deps`, `infra`
