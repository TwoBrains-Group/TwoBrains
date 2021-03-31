# Load

> Loads localized data from db

### Localization structure
This dependency is needed to allow creation components/pages with same names for different apps.

> `component` <- `app`
> `page` <- `app`

*Components are not depended on pages, but on apps.*


## Params

```json
{
    "locale": "en"
}
```

## Result

```json
{
    "cmp": {
        "*": {
            "Header": {}
        }
    },
    "page": {
        "idea": {
            "create": {}
        }
    }
}
```
`cmp` is components collection.
`*` in `cmp` means "for any app".
