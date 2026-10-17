# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://github.com/maitri6488/d25cs120-awdf_p12/actions/workflows/ci.yml/badge.svg)](https://github.com/maitri6488/d25cs120-awdf_p12/actions/workflows/ci.yml)

**Student Name:** Maitri Sheta  
**Student ID:** D25CS120  
**Course:** Advanced Web Development Frameworks (AWDF) — Semester 5  
**Department:** Computer Science & Engineering (CSE)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  

---

## Course Outcome & Program Outcomes (CO / PO)
- **Course Outcome:** CO5
- **Program Outcomes:** PO3, PO5

---

## Practical Objective
To automate testing and deployment of the application using a CI/CD pipeline.

---

## Architecture & Pipeline Workflow Diagram

```text
git push origin main
       │
       ▼
GitHub Actions Trigger (on: push: branches: [main])
       │
       ▼
Virtual Environment: ubuntu-latest (Node.js 18)
Job: build-and-test
├── 1. Checkout repository code (actions/checkout@v4)
├── 2. Setup Node.js runtime (actions/setup-node@v4)
├── 3. Install project dependencies (npm install)
├── 4. Execute automated Jest test suite (npm test)
└── 5. Report pass / fail status
       │
       ▼
Result: Green Checkmark (✔ Pass) or Red X (❌ Fail) in GitHub Actions
```

---

## Problem Definition & Problem Statement
- Set up a GitHub Actions workflow for the Task Management application that triggers automatically on every push to the `main` branch.
- Define dependency installation (`npm install`) as a formal pipeline step on an Ubuntu runner.
- Execute automated tests (`npm test`) using Jest and Supertest to verify API endpoints with clear pass/fail status reporting.
- Demonstrate a failed pipeline caused by an intentionally broken test assertion (Red X).
- Demonstrate a restored pipeline that passes once the test assertion is corrected (Green checkmark).

---

## Key Questions & Analysis

### 1. What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical actually demonstrate?
- **Continuous Integration (CI):** The practice of automating the integration, build verification, and testing of code changes whenever developers commit to the repository. The objective is to detect defects, syntax breaks, or regression bugs as early as possible.
- **Continuous Deployment (CD):** The automated process of taking verified, tested code from the repository and deploying it directly to production environments (such as cloud servers or container clusters) without manual human intervention.
- **Scope of Practical 12:** This practical specifically demonstrates **Continuous Integration (CI)**. It triggers an automated cloud runner on each code push, installs project dependencies, and verifies application functionality using automated test suites, stopping before production release.

### 2. Why does running tests automatically on every push catch problems earlier than testing manually before a release?
When tests run automatically on every single `git push`:
- **Immediate Feedback Loop:** Developers receive instant notifications within minutes of pushing code if a commit introduces a breaking change, making the root cause fast to identify and resolve.
- **Isolated Fault Localization:** Bugs are tied directly to specific individual commits rather than accumulated across weeks of merged code.
- **Elimination of Human Oversight:** Manual testing is prone to missed edge cases, skipped regression checks, or testing in inconsistent local environments. CI guarantees that code compiles and passes tests in a clean, reproducible virtual environment every time.

### 3. What would happen to the pipeline if the test file path were incorrect — would the workflow fail at the same step as a genuine test failure?
- **Workflow Step:** Yes, the workflow would still fail at the exact same step (`Run automated test suite / npm test`).
- **Nature of Failure:** However, the underlying failure mode is different. A genuine test failure occurs when Jest executes the test files successfully but one or more assertions fail (e.g., received status 500 instead of 200), resulting in an exit code 1 from assertion mismatches. 
- If the test file path is incorrect or no test files match Jest's regex pattern, Jest exits with an error indicating `"No tests found"` or file resolution failure. Both produce an exit code of 1, turning the pipeline step red, but the diagnostic logs pinpoint whether it was a test assertion error or a missing test configuration.

---

## Supplementary Problems

### 1. Status Badge in Repository Header
A live GitHub Actions status badge has been linked at the top of the repository and project documentation, providing immediate visual verification of current pipeline health directly from GitHub's workflow status API.

### 2. Automated Testing Across Multiple Endpoints
The automated test suite (`tests/task.test.js`) covers both `GET /tasks` (status 200), `POST /tasks` (status 201 creation), and invalid input validation (status 400), ensuring broad endpoint verification on every commit.

### 3. Pull Request Trigger Support
The workflow file `.github/workflows/ci.yml` is configured to trigger on both `push` and `pull_request` events targeting the `main` branch, ensuring prospective pull requests are fully tested before merging.

---

## Key Skills Addressed
- Writing and formatting GitHub Actions workflow YAML configurations.
- Configuring automated event triggers, jobs, and virtual runner steps for CI pipelines.
- Authoring automated API test suites using Jest and Supertest.
- Reading and diagnosing cloud build logs and investigating test failure stack traces.

---

## Learning Outcome
Students are able to configure an automated Continuous Integration pipeline using GitHub Actions that installs dependencies and runs tests on code push, and diagnose pipeline failures through CI execution logs.
