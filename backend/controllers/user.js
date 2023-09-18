const {
    models: { User },
} = require("../models");

module.exports = {
    create: async (req, res) => {
        if (req.body.id && req.body.name && req.body.email) {
            const { id, name, email } = req.body;
            await User.create({ id, name, email });
            res.render("profile", { name });
        } else {
            res.send("not added");
        }
    },
};
