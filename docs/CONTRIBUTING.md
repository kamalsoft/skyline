# Contributing to Skyline

First off, thank you for considering contributing to Skyline! It's people like you that make open source such a great community. We welcome any form of contribution, from reporting bugs and suggesting features to writing code and improving documentation.

## 1. Code of Conduct

This project and everyone participating in it is governed by the [Skyline Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 2. How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure it hasn't already been reported by searching on GitHub under **Issues**. If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please open a new issue to explain your idea. This allows for discussion and ensures your work doesn't go to waste.

## 3. Your First Code Contribution

Unsure where to begin contributing to Skyline? You can start by looking through `good first issue` and `help wanted` issues in the repository.

### Development Setup

1.  Fork the repository and create your branch from `main`.
2.  Install dependencies by running `npm install`.
3.  Start the development server with `npm start`.

### Pull Request Process

1.  Make your changes in your forked repository. Please ensure your code adheres to the project's coding standards.
2.  Run the linter with `npm run lint` to check for any style issues.
3.  Update the documentation (`README.md`, `USER_MANUAL.md`, etc.) with details of changes to the interface, if applicable.
4.  Ensure your commit messages are descriptive. We follow the Conventional Commits specification. For example:
    - `feat: Add cyberpunk clock theme`
    - `fix: Correctly handle undefined background settings`
    - `docs: Update user manual for new feature`
5.  Submit your Pull Request to the `main` branch of the Skyline repository.

## 4. Styleguides

### Code Formatting

We use **Prettier** for automatic code formatting. Please run it before committing your changes. Most IDEs can be configured to run Prettier on save.

### Code Linting

We use **ESLint** to catch common errors and enforce code style. You can run `npm run lint` to check your code against the project's rules.

Thank you for your contribution!
