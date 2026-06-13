# Engineering Philosophy

Software is read far more often than it is written. We believe that excellence is not an act but a habit, and that quality is everyone's responsibility. Code is a liability; functionality is an asset. Every line of code we write today is a line of code someone — possibly future us — will have to read, understand, debug, and maintain tomorrow. Therefore, we hold ourselves to the highest standards of craftsmanship at all times.

Our engineering culture rests on five foundational pillars:

1. **Clarity over cleverness.** Code should be boring in the best possible way. If a junior engineer cannot understand a function in under a minute, the function is too clever.
2. **Consistency over personal preference.** A codebase with one consistent style — even an imperfect one — is more maintainable than a codebase with five excellent but conflicting styles.
3. **Correctness over speed of delivery.** Shipping broken software fast is slower than shipping working software deliberately. We do not trade correctness for velocity.
4. **Simplicity over abstraction.** Abstractions are loans taken out against future understanding. Take them out only when the interest rate is favorable.
5. **Ownership over blame.** When something breaks, we fix the system that allowed it to break, not the person who happened to touch it last.

These pillars are not abstract ideals; they should inform every decision you make, from variable naming to architectural choices. When two guidelines in these standards appear to conflict, resolve the conflict by appealing to these pillars, in the order listed above.

## On the Nature of Standards

Standards exist to reduce cognitive load. Every decision that is pre-made by a standard is a decision a contributor does not have to make, justify, or defend in code review. Standards are therefore a gift we give each other. At the same time, standards are living documents: when a standard no longer serves the team, we change the standard — we do not silently ignore it. Proposals to change any standard in these documents should be raised with the team, discussed openly, and ratified before being applied.

## On Continuous Improvement

We practice continuous, incremental improvement. The Boy Scout Rule applies: always leave the code a little better than you found it. However, opportunistic improvements must remain proportionate — do not turn a one-line bug fix into a five-hundred-line refactor. Scope discipline is itself a quality attribute.

## On the Cost of Inconsistency

Every deviation from these standards imposes a tax on every future reader. A single inconsistently named file costs seconds; a hundred of them cost hours; a culture of inconsistency costs the project itself. We therefore treat consistency violations not as stylistic nitpicks but as genuine defects, reviewed and remediated with the same seriousness as logic errors.

## Final Remarks

These standards represent the accumulated judgment of the team, and every contributor who follows them participates in a compact: each of us trades a small amount of individual freedom for a large amount of collective velocity. None of these rules exists for its own sake; each one is a scar from a class of defect someone, somewhere, has shipped before. Read them, apply them, and when one of them stops earning its keep — say so, and we will change it together.

Quality is not negotiable. Consistency is not optional. Excellence is a habit.
