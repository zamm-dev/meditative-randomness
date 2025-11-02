---
id: JWS425
type: spec
commits:
  - sha: 911c3ea109426f7146d9edccbe9db963d5f856e2
    message: Document single timeout timer implementation
  - sha: a127fb9b5a4d5357f4319f06b11dea288a7cde95
    message: Add timer implementation spec for single timeout approach
---

# Timer Specification: Single Timeout and Accurate Timekeeping

Timer should make use of a single timeout. setInterval should only update clock; making timer depend on that only makes the timer inaccurate
