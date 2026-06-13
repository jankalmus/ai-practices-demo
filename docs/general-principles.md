# General Principles of Quality Software Development

Before we descend into stack-specific rules, it is worth restating the universal principles that underpin them. These principles transcend any particular framework, language, or tool, and they will remain true long after the current technology stack has been replaced.

## The SOLID Principles

While originally formulated for object-oriented design, the spirit of SOLID applies to our functional TypeScript codebase as well:

- **Single Responsibility:** Every module, function, and component should have one reason to change. A function that validates input and formats output and writes to the store has three reasons to change, which is two too many.
- **Open/Closed:** Prefer extension points (lookup tables, configuration objects, composable functions) over modification of existing tested code.
- **Liskov Substitution:** Any implementation of an interface must be usable wherever the interface is expected, without surprises.
- **Interface Segregation:** Keep prop types and function signatures minimal. Do not force callers to supply data they do not need.
- **Dependency Inversion:** Depend on abstractions (the store's public functions) rather than concretions (the store's internal data structures).

## DRY, But Not Too DRY

Don't Repeat Yourself — but remember that the wrong abstraction is more expensive than duplication. Duplicate code twice before abstracting it; three occurrences justify an abstraction, two usually do not. Premature abstraction is a leading cause of accidental complexity in codebases of this size.

## YAGNI

You Aren't Gonna Need It. Do not build speculative generality. Do not add configuration options nobody asked for. Do not design for hypothetical future requirements. The future has a way of arriving with different requirements than the ones we imagined, and the speculative flexibility we built rarely fits them anyway.

## The Principle of Least Astonishment

Code should behave the way a reasonable reader expects it to behave. Functions named `get*` should not mutate. Functions named `format*` should not fetch. Side effects should be visible in names and signatures.

## Defense in Depth

Validate at every trust boundary. Assume every external input is malformed, malicious, or both, until proven otherwise by a schema. Internal code may trust internal invariants; boundary code may trust nothing.

## Make Illegal States Unrepresentable

Prefer type designs in which invalid combinations of data simply cannot be expressed. Discriminated unions, branded types, and exhaustive switches are the tools; optional-boolean soup is the anti-pattern.
