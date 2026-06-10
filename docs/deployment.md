# Production Deployment

Production deploy is handled by GitHub Actions.

The workflow in `.github/workflows/deploy.yml` supports two paths:

- automatic deploy after the `Landing checks` workflow succeeds on `main`;
- manual redeploy from the GitHub Actions UI with `Run workflow`.

The server keeps a clone of this repository in the directory served by Nginx. The deploy job connects
over SSH and runs:

```bash
git fetch --prune origin main
git reset --hard origin/main
git clean -fd
```

This updates HTML, CSS, JavaScript, images, and any newly added static pages.
It also removes stale untracked files from the deployed checkout, so `DEPLOY_PATH` should be a pure
repository clone without local-only files in the served directory.

## GitHub Secrets

Create these repository secrets in GitHub:

- `DEPLOY_HOST` - server hostname or IP address.
- `DEPLOY_PORT` - SSH port. Optional; defaults to `22` when empty.
- `DEPLOY_USER` - SSH user on the server, for example `deploy`.
- `DEPLOY_PATH` - absolute path to the repository clone served by Nginx.
- `DEPLOY_KNOWN_HOSTS` - server SSH host key entry for `~/.ssh/known_hosts`.
- `DEPLOY_SSH_KEY` - private SSH key that GitHub Actions uses to connect to the server.

Use `docs/deploy-secrets.example.env` only as a checklist. Do not commit real secret values.

## Server Setup

The server needs two separate SSH access paths:

1. GitHub Actions must be able to SSH into the server as `DEPLOY_USER`.
2. The server clone must be able to pull from GitHub.

For the second path, create a deploy key on the server and add its public key in GitHub:

```bash
ssh-keygen -t ed25519 -C "web-build-landing production deploy"
```

Add the public key to GitHub repository settings:

```text
Settings -> Deploy keys -> Add deploy key
```

Read-only access is enough.

To fill `DEPLOY_KNOWN_HOSTS`, run this from your local machine and copy the output into the GitHub
secret:

```bash
ssh-keyscan -H your.server.host
```

If SSH uses a non-standard port, include it:

```bash
ssh-keyscan -p 2222 -H your.server.host
```

## Production Approval

The workflow uses the `production` environment. If you want a manual approval before every deploy,
configure it in GitHub:

```text
Settings -> Environments -> production -> Required reviewers
```

Keep the deploy secrets in the `production` environment when possible, and restrict deployment
branches to `main`:

```text
Settings -> Environments -> production -> Deployment branches and tags -> Selected branches -> main
```
