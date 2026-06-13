# Security Considerations

Although this is a demo application with an in-memory store and no authentication, we maintain security hygiene as a matter of habit, because habits are what ship to production when deadlines are tight:

- All external input is validated before use (see [data-and-validation.md](./data-and-validation.md)). Validation is the first and most important line of defense against injection of every variety.
- Secrets, credentials, API keys, and `.env` files are never committed (see [git-workflow.md](./git-workflow.md)). Once a secret enters git history, it must be considered compromised and rotated — deletion in a later commit does not un-leak it.
- Error responses expose structured, intentional information (see [api-route-handlers.md](./api-route-handlers.md)), never stack traces, internal paths, or implementation details that map the attack surface for an adversary.
- Dependencies are kept current; a `chore: bump deps` PR is cheap insurance against known CVEs.
- New authentication, authorization, or middleware concerns are team-level architectural decisions, never ad-hoc additions (see [api-route-handlers.md](./api-route-handlers.md)).
