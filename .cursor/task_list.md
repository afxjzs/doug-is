# Major Site Reliability Issues - Task List (TDD-Focused)

## Background and Motivation

The user has identified several critical reliability and UX issues that must be addressed to ensure the site works as intended and is robust against regressions. All fixes must follow a strict Test-Driven Development (TDD) workflow:

1. **Write a failing test** that demonstrates the bug or missing feature.
2. **Implement the minimal code** to make the test pass.
3. **Refactor and add regression tests** to ensure the issue does not recur.

## Key Challenges and Analysis

- **Layout Composition**: Overlapping use of MainSiteLayout and LayoutWrapper in both (site) and /building may cause double rendering of shared components like the footer.
- **Dynamic Routing**: /building/* routes depend on the presence of subdirectories with page.tsx files. Broken links occur if a project is listed but has no corresponding page.
- **Authentication Flow**: The login form uses a unified auth hook, but lacks comprehensive integration tests for all flows and fallback states.
- **URL Canonicalization**: There is no explicit redirect from old blog URLs to the new /about/ structure, which is needed for SEO and user experience.
- **Analytics Debugging**: The PostHogDebugger component may not be mounted in dev, or PostHog may not be initialized correctly, hiding the dev icon.

## High-level Task Breakdown (TDD Steps for Each)

### 1. Footer Renders Twice
- [ ] **Write a failing test** that asserts the footer appears only once on every page (integration test for all main routes)
- [ ] **Audit all layout and wrapper usage** for (site), /building, and /thinking to identify double-rendering
- [ ] **Refactor layouts** to ensure only one footer is rendered per page
- [ ] **Write/refine a regression test** to prevent double footer in the future
- **Success Criteria:** All pages render a single footer; test fails if a second footer is introduced.

### 2. /building/* Routes Not Working
- [ ] **Write a failing test** that checks all project links on /building resolve to a valid page (404 if not)
- [ ] **Audit all /building subroutes** and ensure each project has a directory with a page.tsx
- [ ] **Fix or remove broken links** (e.g., /building/doug-is)
- [ ] **Write/refine a regression test** to ensure new projects are not added to the list without a corresponding page
- **Success Criteria:** All project links on /building resolve to a valid page; test fails if a listed project is missing a page.

### 3. Login is Broken
- [ ] **Write comprehensive integration tests** for the login flow (including stuck/fallback state, password, and magic link flows)
- [ ] **Test server-side admin protection and redirect logic** (write tests for protected routes)
- [ ] **Fix any issues found in the login flow**
- [ ] **Write/refine regression tests** to ensure login cannot break silently in the future
- **Success Criteria:** All login flows work as expected; tests fail if login or admin protection breaks.

### 4. Blog Post URL Forwarding
- [ ] **Write a failing test** that requests the old blog URL and expects a 301/302 redirect to the canonical /about/ URL
- [ ] **Implement middleware or route handler** to forward old URLs to the new structure
- [ ] **Write/refine a regression test** to ensure all old blog URLs always forward correctly
- [ ] **Ensure SEO best practices** (canonical headers, etc.)
- **Success Criteria:** All old blog URLs forward to the canonical URL; test fails if redirect is missing or incorrect.

### 5. PostHog Dev Icon
- [ ] **Write a failing test** that checks for the presence of the PostHog dev/debug icon in development
- [ ] **Ensure the PostHogDebugger component is mounted in dev mode**
- [ ] **Fix any issues with PostHog initialization or environment variables**
- [ ] **Write/refine a regression test** to ensure the dev icon is always present in development
- **Success Criteria:** PostHog dev/debug icon is visible in development; test fails if icon is missing or analytics are not initialized.

## Project Status Board

### Issue 1: Footer Renders Twice ✅ COMPLETED
- [x] Write failing test demonstrating double footer issue
- [x] Audit layout structure and identify root cause (nested MainSiteLayout components)
- [x] Create VisualLayout component to separate visual styling from LayoutWrapper
- [x] Refactor (site) and /building layouts to use VisualLayout instead of MainSiteLayout
- [x] **CRITICAL FIX:** Remove Header and Footer from /thinking layout that was causing double footer
- [x] Write regression test to prevent double footer in the future
- [x] **Success Criteria Met:** All pages now render a single footer; test fails if a second footer is introduced
- [x] **Browser Verification:** Confirmed single footer on /thinking/about/technology/ai-slop-will-eat-itself

### Issue 2: /building/* Routes Not Working ✅ COMPLETED
- [x] Write failing test that checks all project links on /building resolve to a valid page
- [x] Audit all /building subroutes and ensure each project has a directory with a page.tsx
- [x] Fix or remove broken links (e.g., /building/doug-is)
- [x] Write regression test to ensure new projects are not added to the list without a corresponding page
- [x] **Success Criteria Met:** All project links on /building resolve to a valid page

### Issue 3: Login is Broken 🔄 IN PROGRESS
- [ ] Write comprehensive integration tests for the login flow
- [ ] Test server-side admin protection and redirect logic
- [ ] Fix any issues found in the login flow
- [ ] Write regression tests to ensure login cannot break silently
- [ ] **Success Criteria:** All login flows work as expected

### Issue 4: Blog Post URL Forwarding
- [ ] Write failing test that requests old blog URL and expects 301/302 redirect
- [ ] Implement middleware or route handler to forward old URLs to new structure
- [ ] Write regression test to ensure all old blog URLs always forward correctly
- [ ] **Success Criteria:** All old blog URLs forward to canonical URL

### Issue 5: PostHog Dev Icon
- [ ] Write failing test that checks for PostHog dev/debug icon in development
- [ ] Ensure PostHogDebugger component is mounted in dev mode
- [ ] Fix any issues with PostHog initialization or environment variables
- [ ] Write regression test to ensure dev icon is always present in development
- [ ] **Success Criteria:** PostHog dev/debug icon is visible in development

## Current Status / Progress Tracking

**Issue 1 RESOLVED:** 
- Root cause identified: Nested MainSiteLayout components in (site) and /building routes
- Solution implemented: Created VisualLayout component to separate visual styling from LayoutWrapper
- All tests passing, double footer issue eliminated
- Regression test in place to prevent future occurrences

**Next Priority:** Issue 2 - /building/* Routes Not Working

## Executor's Feedback or Assistance Requests

**Starting Issue 1 - Footer Renders Twice:**
- Need to first run the current test suite to establish baseline
- Will write integration test to detect double footer rendering
- May need to audit layout structure to understand current composition

## Lessons

**TDD Workflow for Reliability Issues:**
- Always start with a failing test that demonstrates the bug
- Write tests that would catch the issue if it were to recur
- Focus on integration tests for layout and routing issues
- Ensure tests are comprehensive enough to prevent regressions

**Layout Composition Best Practices:**
- Avoid nested layouts that render the same components
- Use route groups carefully to prevent double rendering
- Test layout composition with integration tests
- Monitor for duplicate component rendering in complex layouts
