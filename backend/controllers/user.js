const {
    models: { User },
} = require("../models");

module.exports = {
    create: async (req, res) => {
        if (req.body.id && req.body.name) {
            const { id, name } = req.body;
            await User.create({ id, name });
            res.render("profile", { name });
        } else {
            res.send("not added");
        }
    },
};
