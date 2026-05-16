# Contributing to NexusFleet ERP

Thank you for your interest in contributing! We follow a strict high-quality codebase standard.

## Branching Strategy
- `main`: Production-ready code.
- `develop`: Ongoing feature integration.
- `feature/*`: New features.
- `fix/*`: Bug fixes.

## Development Workflow
1. Fork the repository.
2. Create a feature branch.
3. Ensure all tests pass (`npm run test`).
4. Run linting (`npm run lint`).
5. Verify TypeScript types (`npm run typecheck`).
6. Submit a Pull Request with a clear description of changes.

## Code Standards
- Use TypeScript for all logic.
- Prefer Server Components where possible.
- Use Server Actions for mutations.
- Follow ShadCN UI patterns for components.
- Ensure all forms have Zod validation.
