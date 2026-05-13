# K6 Performance Testing Project

A structured k6 performance testing suite for [Sauce Demo](https://www.saucedemo.com), covering smoke, load, and stress test scenarios.

## Project Structure

```
k6-performance-project/
├── tests/
│   ├── smoke-test.js       # Quick sanity check (1 VU, 30s)
│   ├── load-test.js        # Normal expected traffic (ramp up → hold → ramp down)
│   └── stress-test.js      # Beyond-normal load to find breaking points
├── data/
│   └── users.csv           # Parameterized user credentials
├── reports/                # Auto-generated HTML reports (git-ignored)
├── .github/
│   └── workflows/
│       └── k6-performance.yml  # CI/CD pipeline
└── README.md
```

## Prerequisites

- [k6](https://k6.io/docs/getting-started/installation/) installed locally

## Running Tests

Run from inside the `k6-performance-project/` directory:

```bash
# Smoke test – quick sanity check
k6 run tests/smoke-test.js

# Load test – normal traffic simulation
k6 run tests/load-test.js

# Stress test – find the breaking point
k6 run tests/stress-test.js
```

### Override the base URL

```bash
k6 run -e BASE_URL=https://your-app.com tests/smoke-test.js
```

## Test Types

| Test      | VUs        | Duration  | Purpose                          |
|-----------|------------|-----------|----------------------------------|
| Smoke     | 1          | 30s       | Verify system works at all       |
| Load      | up to 10   | ~5m       | Simulate expected normal traffic |
| Stress    | up to 80   | ~23m      | Find performance limits          |

## Reports

HTML reports are generated automatically in the `reports/` folder after each run:

- `reports/smoke-report.html`
- `reports/load-report.html`
- `reports/stress-report.html`

## CI/CD

The GitHub Actions workflow (`.github/workflows/k6-performance.yml`) runs automatically on push/PR to `main`. You can also trigger specific test types manually via **Actions → K6 Performance Tests → Run workflow**..
