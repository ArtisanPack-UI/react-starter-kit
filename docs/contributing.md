# Contributing

## Getting set up

1. Fork + clone the repo
2. `composer install`
3. `npm install`
4. `cp .env.example .env && php artisan key:generate`
5. `php artisan migrate`
6. `composer dev` to boot

## Branches

- `main` — release branch (only release PRs land here)
- `release/x.y` — integration branch for an upcoming release; feature branches cut from + merge into here
- Feature branches: `feature/short-description`
- Fix branches: `fix/short-description`

Open PRs against `release/x.y`, not `main`.

## Before opening a PR

```bash
composer test                   # 33 tests should pass
npm run lint                    # ESLint clean
npm run format:check            # Prettier clean
npm run type-check              # TypeScript clean
npm run build                   # Vite build clean
```

CI runs the same checks on every PR. Failures block merge.

## Commit messages

Follow conventional Laravel-style messages:

- `Add support for X`
- `Fix Y when Z`
- `Update docs for X`
- Use imperative mood, ~72 chars on the first line

## Adding a new page

1. Add the controller (`app/Http/Controllers/`)
2. Add the route (`routes/web.php` or `routes/auth.php`)
3. Add the Inertia page (`resources/js/pages/`)
4. Add a feature test (`tests/Feature/`)
5. Add the page to the sidebar nav (`resources/js/layouts/AppLayout.tsx`) if it should be discoverable

## Adding a new optional package

Edit the `multiselect` list in `app/Console/Commands/OptionalPackagesCommand.php`. Add a test in `tests/Feature/Console/OptionalPackagesCommandTest.php` if the new package needs special handling beyond `composer require`.

## Reporting bugs

Open an issue with:

- The repo + version
- Your OS and PHP/Node versions
- Steps to reproduce
- Expected vs actual behavior
- Any console / log output

Use the bug report template if available.

## Code style

- PHP: Laravel Pint + the `artisanpack-ui/code-style` PHPCS ruleset (if installed via the optional packages prompt)
- TS / JSX: Prettier + ESLint (configs ship with the kit)

Run `npm run format` and `vendor/bin/pint` (if installed) before committing.

## Documentation

Keep `docs/*.md` short and accurate. If you add a feature, add a section to the relevant doc — don't rely on "the code is the documentation."

## License

By contributing, you agree your contributions are licensed under the MIT License (see [LICENSE](../LICENSE)).
