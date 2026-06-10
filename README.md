# WebBuild Landing

Static landing page for WebBuild.

## Local checks

```bash
npm install
npm run check
```

`npm run check` runs formatting, linting, and tests:

- `npm run format:check`
- `npm run lint`
- `npm test`

## GitHub flow

This repository is prepared with `main` as the base branch and `landing-init` as the first
feature branch.

To publish it to GitHub:

```bash
git remote add origin <github-repository-url>
git push -u origin main
git push -u origin landing-init
```

Then open a pull request from `landing-init` into `main`. GitHub Actions runs all checks on pull
requests targeting `main`.
