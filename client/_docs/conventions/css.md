# CSS conventions

Each css class and id is named by specific original convention (mix of BEM and suit css).

> All component names must be in camelCase, but component names in PascalCase

#### Utilities
`.u-[sm-|md-|lg-]<utilityName>`

Examples: `.u-sm-floatLeft`

#### Layouts
`.l-<layoutName>[--modifier]`

Examples: `.l-horFlex--scroll`

#### States
`.s-<stateName>`

Examples: `.s-show`, `.s-hide`

#### Blocks
`.<blockName>[__childNode|__ChildComponent][--modifier]`

Examples: `.wrapper__el--small`

#### Components
`.[<namespace>-]<ComponentName>[__childNode|__ChildComponent][--modifier]`

Examples: `.user-UserList__User--small`
> Note: Here `--modifier` refers to `UserList`, not to `User`

#### UI Components
`.ui-<UIComponentName>[__childNode|__ChildComponent][--modifier]`

Examples: `.ui-Button`, `.ui-Button__text`

#### page
`#page-<namespace>-<pageRoute>`

Example: `#page-user-_uid-_section`
