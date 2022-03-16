const config = {
    type: 'app',
    name: 'maintenance',
    title: 'DHIS2 Maintenance app',
    description: '@TODO',
    coreApp: true,
    pwa: { enabled: false },

    entryPoints: {
        app: './src/app.js',
    },
}

module.exports = config
