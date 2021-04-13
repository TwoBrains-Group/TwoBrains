# CSS conventions

Each css class and id is named by specific original convention (mix of BEM and suit css).

> All component names must be in camelCase, but component names in PascalCase

## Names conventions

#### Modifiers
Component and blocks modifiers must be separate classes: `_<modifierName>`
Examples: `._modifier`

#### Utilities
`.u-[sm-|md-|lg-]<utilityName>[--modifier]`

Examples: `.u-sm-floatLeft`

#### Layouts
`.l-<layoutName>[--modifier]`

Examples: `.l-horFlex`

#### States
Global states: `.s-<stateName>`

> Scoped states can be named without `s-` prefix for ease in use with `:class`

Examples: `.s-show`, `.s-hide`

#### Blocks
`.<blockName>[_childBlock|_ChildComponent]`

Examples: `.wrapper_el`

#### Components
`.[<namespace>-]<ComponentName>[_childBlock|_ChildComponent]`

Examples: `.user-UserList_User`

#### UI Components
`.ui-<UIComponentName>[_childNode|_ChildComponent]`

Examples: `.ui-Button`, `.ui-Button_text`

#### Pages
`.page-<namespace>-<pageRoute>`

For simplicity, some page names with complex dynamic routing can be written as aliases, like page `user/_uid/_section` becomes `page-userProfile`

> For `index` pages `index` route is omitted: for page `auth/index` class will be `page-auth`, not `page-auth-index`

> For pages nested classes must not have a prefix with page name. Nested class must be written as they do not have a parent.

Examples: `.page-auth`, `.page-project`

Nested nodes classes for page `.page-user-_uid-_section`: `userProfile`, `Switch`, etc.

## Style

```html
<style lang="scss" scoped>
@import '...';
</style>
```
