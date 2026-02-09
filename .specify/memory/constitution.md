<!--
  === Sync Impact Report ===
  Version change: N/A (initial) → 1.0.0
  Modified principles: N/A (initial creation)
  Added sections:
    - Principle I: Code Quality
    - Principle II: Testing Standards
    - Principle III: UX Consistency (Mobile-First)
    - Section: Mobile UX Standards Reference
    - Section: Quality Gates
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed
      (Constitution Check section is generic and will pick up
       these principles automatically)
    - .specify/templates/spec-template.md ✅ no changes needed
      (User Scenarios and Success Criteria sections already
       support UX and testing validation)
    - .specify/templates/tasks-template.md ✅ no changes needed
      (Polish phase already covers testing, performance,
       and quality concerns)
  Follow-up TODOs:
    - TODO(RATIFICATION_DATE): Set to today as initial adoption
  === End Sync Impact Report ===
-->

# DragonHero Constitution

## Core Principles

### I. Code Quality

All production code MUST meet the following non-negotiable standards:

- **Readability over cleverness**: Code MUST be self-explanatory.
  Prefer clear naming and straightforward control flow over
  compact or "clever" constructs.
- **Single Responsibility**: Every module, class, and function
  MUST have one clearly defined purpose. If a description
  requires "and", it MUST be split.
- **No dead code**: Unused imports, unreachable branches, and
  commented-out code MUST NOT be committed.
- **Consistent style**: All code MUST pass the project's
  configured linter and formatter before merge. No exceptions.
- **Minimal dependencies**: Every external dependency MUST be
  justified. Prefer standard library solutions when the
  added complexity of a dependency outweighs its benefit.
- **Error handling at boundaries**: All external inputs (user
  input, API responses, file I/O) MUST be validated. Internal
  code SHOULD trust typed contracts and avoid defensive
  over-checking.
- **Documentation where it matters**: Public APIs MUST have
  doc comments. Complex algorithms MUST include inline
  rationale. Self-evident code MUST NOT have redundant
  comments.

### II. Testing Standards

All features MUST be verified through a structured testing
discipline:

- **Test-first for critical paths**: Core business logic and
  user-facing flows MUST have tests written before or
  alongside implementation. Tests MUST fail before the
  implementation makes them pass.
- **Test pyramid**: The project MUST maintain a healthy ratio:
  many unit tests, fewer integration tests, minimal E2E tests.
  Unit tests MUST execute in under 1 second each.
- **Naming convention**: Test names MUST describe the scenario
  and expected outcome, e.g.,
  `login_withInvalidPassword_returnsAuthError`.
- **No test interdependence**: Each test MUST be independently
  executable. Shared state between tests is forbidden.
- **Coverage as a guide, not a gate**: Code coverage MUST be
  tracked but MUST NOT be used as the sole quality metric.
  Focus on meaningful assertions over line-count coverage.
- **Edge case coverage**: Every public function MUST have tests
  for boundary conditions, null/empty inputs, and error paths.
- **CI integration**: All tests MUST pass in the CI pipeline
  before any merge is permitted. Flaky tests MUST be fixed
  or quarantined within 24 hours of detection.

### III. UX Consistency (Mobile-First)

All user-facing interfaces MUST adhere to modern mobile app
standards to ensure a cohesive, intuitive experience:

- **Platform conventions**: The app MUST follow the native
  design guidelines of the target platform (Material Design 3
  for Android, Human Interface Guidelines for iOS). Do not
  invent custom interaction patterns when a platform-standard
  pattern exists.
- **Touch-first design**: All interactive elements MUST have a
  minimum touch target of 48x48dp (Android) / 44x44pt (iOS).
  Spacing between adjacent targets MUST prevent accidental
  taps.
- **Responsive layout**: UI MUST adapt gracefully to screen
  sizes from compact phones (320dp wide) to tablets (840dp+).
  Use responsive breakpoints, not fixed pixel values.
- **Consistent visual language**: Typography, color palette,
  spacing, and elevation MUST be defined in a shared design
  token system. Ad-hoc style values are forbidden.
- **Accessible by default**: All screens MUST meet WCAG 2.1 AA
  contrast ratios (4.5:1 for text, 3:1 for large text and UI
  components). Interactive elements MUST have accessibility
  labels. Screen reader navigation MUST be logical.
- **Motion and feedback**: User actions MUST produce immediate
  visual feedback (< 100ms). Animations MUST be purposeful
  (convey state change, guide attention) and MUST respect the
  system's reduced-motion setting.
- **Offline resilience**: The app MUST degrade gracefully when
  connectivity is lost. Data entry MUST NOT be lost on network
  interruption. Loading states and error states MUST be
  explicitly designed, not left as blank screens.
- **Navigation clarity**: The app MUST use a predictable,
  shallow navigation hierarchy. Users MUST always know where
  they are and how to go back. Deep linking MUST be supported
  for key screens.

## Mobile UX Standards Reference

This section provides concrete benchmarks for UX quality
gates referenced in Principle III:

| Metric | Target | Measurement |
|---|---|---|
| Cold start time | < 2 seconds | Time from tap to interactive |
| Frame rate | 60 fps sustained | No dropped frames during scroll |
| Touch response | < 100ms feedback | Visual indicator on interaction |
| Content layout shift | 0 | No visible layout jumps after load |
| Accessibility audit | 0 critical issues | Automated + manual screen reader test |
| Offline data loss | 0 entries lost | Kill network mid-operation test |

## Quality Gates

All pull requests and reviews MUST verify compliance with
the following gates before merge:

| Gate | Validates Principle | Check |
|---|---|---|
| Lint pass | I. Code Quality | Automated linter reports zero errors |
| Test suite green | II. Testing Standards | All tests pass in CI |
| New test coverage | II. Testing Standards | New code has corresponding tests |
| Design token usage | III. UX Consistency | No ad-hoc color/spacing/typography |
| Touch target audit | III. UX Consistency | Min 48x48dp / 44x44pt targets |
| Accessibility scan | III. UX Consistency | WCAG 2.1 AA compliance verified |

## Governance

- This constitution is the highest authority for development
  decisions in the DragonHero project. When a practice
  conflicts with a principle, the principle prevails.
- **Amendment procedure**: Any team member MAY propose an
  amendment by documenting the change, its rationale, and a
  migration plan for existing code. Amendments MUST be
  reviewed and approved before adoption.
- **Versioning policy**: The constitution follows semantic
  versioning. MAJOR for principle removals or redefinitions,
  MINOR for new principles or material expansions, PATCH for
  wording clarifications.
- **Compliance review**: Every pull request MUST include a
  self-assessment against the Quality Gates table above.
  Periodic (monthly) audits SHOULD review overall adherence
  and flag systemic drift.

**Version**: 1.0.0 | **Ratified**: 2026-02-09 | **Last Amended**: 2026-02-09
