export default {
    api: {
        v1: {
            methods: {
                index: 'export default {}',
            },
            schemas: {
                index: 'export default {}',
            },
            queries: 'export default {}',
            index: '@versionIndex',
        },
        index: 'import v1 from \'./v1\'\n\n export default {\nv1,\n}',
    },
    index: '@appIndex',
}
