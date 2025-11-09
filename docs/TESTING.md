# Skyline - Testing Strategy

This document outlines the testing strategy for the Skyline application. As noted in the [Project Roadmap](./ROADMAP.md), building a robust test suite is a key goal to ensure code quality, prevent regressions, and make contributions safer.

## 1. Testing Philosophy

Our goal is to follow a practical testing approach that focuses on user behavior rather than implementation details. We want our tests to give us confidence that the application works as expected from a user's perspective.

## 2. Tools

The project will use the following industry-standard tools for testing React applications:

- **[Jest](https://jestjs.io/):** A delightful JavaScript Testing Framework with a focus on simplicity. It will serve as our test runner, assertion library, and mocking framework.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/):** A library for testing React components in a way that resembles how users interact with them. It helps us write tests that are more resilient to refactoring.

These tools are included by default in projects created with Create React App, making setup straightforward.

## 3. Types of Tests

### Unit Tests

Unit tests will focus on small, isolated pieces of logic, particularly our utility functions and custom hooks.

- **Location:** `src/utils/` and `src/hooks/`
- **Example:** A test for `generateWeatherAlerts` in `alertUtils.js` would pass in mock forecast data and assert that the correct alert objects are returned.

### Integration / Component Tests

This will be the primary focus of our testing efforts. These tests will render one or more components and verify their behavior in response to user interactions.

- **Location:** Test files will be co-located with the components they are testing (e.g., `WeatherCard.test.js` next to `WeatherCard.js`).
- **Example:** A test for `AppearanceSettings.js` would:
  1.  Render the component within a mock `SettingsProvider`.
  2.  Simulate a user clicking the "24-Hour" radio button.
  3.  Assert that the `dispatch` function was called with the correct action (`{ type: 'SET_TIME_FORMAT', payload: '24h' }`).

## 4. How to Run Tests

Once tests are added, you will be able to run the entire test suite using the standard npm script:

```sh
npm test
```

This command will launch Jest in interactive watch mode, automatically re-running tests when files are changed.

## 5. Future Goals

- **End-to-End (E2E) Testing:** Once the application is more mature, we may introduce an E2E testing framework like Cypress or Playwright to test critical user flows across the entire application in a real browser.
- **CI Integration:** Integrate the `npm test` command into a GitHub Actions workflow to automatically run tests on every pull request.
