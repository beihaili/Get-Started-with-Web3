> **README:** [English](README.md) | [中文](README.zh.md)
> **CONTRIBUTING:** [English](CONTRIBUTING.en.md) | [中文](CONTRIBUTING.md)

# Contributing Guide

## Your First Contribution in 5 Minutes

1. **Fork** this repository
2. **Find an issue** labeled `good first issue` in [Issues](https://github.com/beihaili/Get-Started-with-Web3/issues)
3. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/Get-Started-with-Web3.git`
4. **Create a branch**: `git checkout -b fix/your-change`
5. **Make your change** (fix a typo, improve a translation, add a quiz question)
6. **Commit**: `git commit -m "fix: describe your change"`
7. **Push and open a PR**: `git push origin fix/your-change`

Not sure where to start? Translation proofreading is the easiest way to contribute — just find a file in `en/` and improve the English!

Thank you for your interest in the **Get Started with Web3** project! We welcome all forms of contributions.

## How to Participate

### Reporting Issues

If you find a bug or have a suggestion for improvement, please submit it in [GitHub Issues](https://github.com/beihaili/Get-Started-with-Web3/issues):

1. Search for existing issues to avoid duplicates.
2. Use the appropriate issue template (Bug Report / Feature Request).
3. Provide as much detail as possible, including reproduction steps and screenshots.

### Submitting Code

1. Fork this repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit your changes (follow the commit convention).
4. Push to your fork: `git push origin feat/your-feature`.
5. Create a Pull Request.

### Improving Documentation

- Correct errors or outdated information in tutorials.
- Supplement code examples and explanations.
- Improve the clarity and accuracy of the writing.

### Translation

- We are currently translating from Chinese to English (`en/` directory).
- Feel free to translate existing tutorials or proofread existing translations.

## Development Environment Setup

```bash
# Clone the repository
git clone https://github.com/beihaili/Get-Started-with-Web3.git
cd Get-Started-with-Web3

# Install dependencies
npm install

# Start the development server
npm run dev

# Run tests
npm test

# Run lint check
npm run lint
```

## Branching and Commit Conventions

### Branch Naming

- `feat/xxx` — New feature
- `fix/xxx` — Bug fix
- `docs/xxx` — Documentation improvement
- `refactor/xxx` — Code refactoring

### Commit Message

We use the [Conventional Commits](https://www.conventionalcommits.org/) convention:

```
<type>: <description>

[optional body]
```

Common types:
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation change
- `style` — Code style (no functional impact)
- `refactor` — Refactoring
- `test` — Testing
- `chore` — Build/tooling changes

Example:
```
feat: add quiz for Bitcoin Script lesson
fix: correct image path in SegWit tutorial
docs: update README with new learning path
```

## Code Style

- Use ESLint + Prettier to maintain code consistency.
- A `lint-staged` check will automatically run before each commit.
- Manual formatting: `npm run format`

## PR Process

1. Ensure the code passes all tests: `npm test`.
2. Ensure there are no linting errors: `npm run lint`.
3. Fill in all necessary information in the PR template.
4. Wait for Code Review.
5. Make changes based on feedback.
6. Delete the feature branch after merging.

## Tutorial Content Guidelines

When writing or modifying tutorials:

- Use Markdown format.
- Place each lesson in an independent numbered directory (e.g., `01_FirstWeb3Identity/`).
- Name the main file `README.MD`.
- Place code examples in the `code_examples/` subdirectory.
- Use relative paths for images.
- Place Chinese content in the `zh/` directory and English content in the `en/` directory.

## Contact Us

- Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
- GitHub Issues: [Submit an issue](https://github.com/beihaili/Get-Started-with-Web3/issues)
- WeChat Group: Apply via Google Form.

## Acknowledgments

Thanks to every contributor! Your participation makes Web3 education better.
