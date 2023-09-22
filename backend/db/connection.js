const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    // dialect: "mysql",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        },
    },
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

module.exports = sequelize;
