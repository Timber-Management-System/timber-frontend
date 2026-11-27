# Tests for this FR

The test runner is **not decided yet** (see `docs/decisions/`). Until it is:

- Keep logic in small pure functions (`schemas/`, business rules) so it's easy to test later.
- Write down the cases you checked by hand in your PR description.

When the runner is chosen, tests go in this folder: `example.test.ts` next to the code they test.
