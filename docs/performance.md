# Performance Considerations

Performance is a feature, and like all features it is specified, measured, and maintained rather than assumed:

- Server Components by default (see [nextjs.md](./nextjs.md)) is itself the project's largest performance lever — every avoided `'use client'` is JavaScript the user never downloads.
- All aggregation arithmetic happens in `lib/` over integer cents — cheap, allocation-light, and already unit-tested for correctness, which is a precondition for safely optimizing anything.
- Avoid premature optimization: with an in-memory store, no data operation in this application is a bottleneck. The Knuth dictum applies — measure before optimizing, and expect the measurement to embarrass your intuition.
- Should real performance work ever be warranted, it begins with profiling, proceeds by changing one variable at a time, and ends with a regression guard. Optimization without measurement is superstition with a diff attached.
