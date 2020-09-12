module.exports = {
    development: {
        username: process.env.username,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: process.env.dialect,
        port: process.env.dbport
    },
    staging: {
        username: process.env.username,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: process.env.dialect,
        "use_env_variable": "DATABASE_URL"
    },
    production: {
        username: process.env.username,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: process.env.dialect,
        ssl: true,
        dialectOptions: {
            ssl: true,
        },
        "use_env_variable": "DATABASE_URL"
    }
}
