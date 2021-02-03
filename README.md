# TwoBrains

This is the first version:
- No multi-service structure (I'm alone, and it will be too complex at very start of project)

## Rules

### CSS
Okay, I don't wanna write ton of css code that is under convention.
SO... BEM-BEM__BEM--BEM.


### Templates
Handlebars preprocessor is used.

Template object structure (empty one can be found in `storage` util):
```js
const templateObject = {
    head: {
        // Head info about page (title, etc.)
    },
    info: {
        // Some kind of meta-data about page, but not for head
    },
    page: {
        // Here comes data for the rendered page
    },
    common: {
        // Here's data that belongs not to the rendered page (logged in user, etc.)
    },
    settings: {
        // Non-content data (metadata and etc.)
    },
    styles: {
        // Of course styles won't be here, but here will be dynamic options for styles (theme, etc.)
    }
}
```

## Structure

### Apps
The main reason to divide everything to applications is ease of use.
Each app contains some count of pages and methods.

### Pages
Page is entity for `GET` requests. By name, they are obviously just real pages.
Pages use RESTful API.

### Methods
Beside pages, methods are for `POST` requests.
