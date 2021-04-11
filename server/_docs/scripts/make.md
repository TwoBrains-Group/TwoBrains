# Make

> Generates app or method

Usage:
```
npm run make app {appName}
npm urn make method {appName} {methodName}
```

### Structures
Struct are objects that describes deep directory structure.

#### `$` prefix
This prefix used as template variables.
For keys, they will be replaced with applied parameters, for values with templates.
For example: `$name: $method`.
Here `$name` will be replaced with method name from gotten from cli, `$method` with template from `templates` file.

#### `__` prefix
This prefix used for commands.
The name of command starts from `__` and ends before first `_`.

Example: `__updateIndex_methods: {}`

> Here, name of directory is `methods`, `updateIndex` acts as command.
> Templated names are also available in conjunction with commands, like this: `__updateIndex_$dirName`
