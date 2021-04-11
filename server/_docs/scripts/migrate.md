# Migrate

> Builds db migration scripts and runs migrations

> As far as this script uses named arguments `--` must be supplied

Usage:
```
npm run migrate -- [up/down/check] [-c|-count {number}]
```

### `up`/`down`
Runs up or down migrations with count applied with `-count` (`-c` is an alias).
If no count applied runs all migrations.

### `check`
Shows information about migrations.
