const { Sequelize, DataTypes } = require("sequelize");
const { Client } = require("@planet/client");
require("dotenv").config();
const url = require("url");

// const config = require("../db/config");

// const sequelize = new Sequelize(config.development);

// PlanetScale connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    // dialect: "mysql",

    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        },
    },
    logging: false,
});

// const planetClient = new Client({
//     apiKey: process.env.PLANETSCALE_API_KEY,
// });

// async function fetchDatabaseDetails() {
//     try {
//         const databaseDetails = await planetClient.getDatabase({
//             organization: "your_organization_name",
//             database: "your_database_name",
//         });
//         // Handle the database details here
//     } catch (error) {
//         // Handle any errors that occur during the database retrieval
//         console.error(error);
//     }
// }
// fetchDatabaseDetails();

// const sequelize = new Sequelize({
//     database: databaseDetails.name,
//     username: databaseDetails.username,
//     password: databaseDetails.password,
//     host: databaseDetails.hosts[0].hostname, // Use the first host
//     port: databaseDetails.hosts[0].port, // Use the first host's port
//     dialect: "mysql", // or the appropriate dialect for your database
//     dialectOptions: {
//         ssl: false, // Set to true if your database requires SSL
//     },
//     logging: false, // Disable logging or configure it as needed
// });

const User = sequelize.define(
    "User",
    {
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: "Display name must be between 1 to 255 characters long.",
                },
            },
        },
        profileId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "profile Id cannot be empty.",
                },
            },
        },
    },
    { timestamps: true, constraints: false }
);

const Review = sequelize.define(
    "Review",
    {
        reviewName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Review name cannot be empty.",
                },
            },
        },
        pieceName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Piece name cannot be empty.",
                },
            },
        },
        group: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [["Movies", "Books", "Games"]],
                    msg: "Invalid group. Group must be one of: 'Movies', 'Books', 'Games'.",
                },
            },
        },
        reviewText: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Review text cannot be empty.",
                },
            },
        },
        creatorGrade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                const tagsValue = this.getDataValue("tags");
                if (tagsValue === null) {
                    return null;
                }
                return tagsValue.split(",").map((tag) => tag.trim());
            },
            set(tags) {
                this.setDataValue("tags", tags.join(", "));
            },
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        creatorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { timestamps: true, constraints: false }
);

const Comment = sequelize.define(
    "Comment",
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Comment content cannot be empty.",
                },
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        creatorName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true, constraints: false }
);

const UserReviewLikes = sequelize.define(
    "UserReviewLikes",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { timestamps: true, constraints: false }
);

const UserReviewRatings = sequelize.define(
    "UserReviewRatings",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
    },
    { timestamps: true, constraints: false }
);

// UserReviewLikes.belongsTo(Review, { foreignKey: "reviewId" });
// Review.hasMany(UserReviewLikes, { foreignKey: "reviewId" });

// User.hasMany(Review, { foreignKey: "creatorId", as: "ReviewsCreated" });
// Review.belongsTo(User, { foreignKey: "creatorId", as: "ReviewCreator" });

// Review.hasMany(Comment, { foreignKey: "reviewId", as: "ReviewComments" });
// Comment.belongsTo(Review, { foreignKey: "reviewId", as: "Review" });

// User.hasMany(Comment, { foreignKey: "userId", as: "UserComments" });
// Comment.belongsTo(User, { foreignKey: "userId", as: "CommentCreator" });

// User.belongsToMany(Review, {
//     through: UserReviewRatings,
//     as: "RatedReviews",
//     foreignKey: "userId",
// });
// Review.belongsToMany(User, {
//     through: UserReviewRatings,
//     as: "Raters",
//     foreignKey: "reviewId",
// });
// Review.hasMany(UserReviewRatings, {
//     foreignKey: "reviewId",
//     as: "Ratings",
// });

// UserReviewRatings.belongsTo(Review, {
//     foreignKey: "reviewId",
// });

// User.belongsToMany(Review, {
//     through: UserReviewLikes,
//     as: "LikedReviews",
//     foreignKey: "userId",
// });
// Review.belongsToMany(User, {
//     through: UserReviewLikes,
//     as: "Likers",
//     foreignKey: "reviewId",
// });

User.hasMany(Review, {
    foreignKey: "creatorId",
    as: "ReviewsCreated",
    constraints: false,
});

Review.belongsTo(User, {
    foreignKey: "creatorId",
    as: "ReviewCreator",
    constraints: false,
});

Review.hasMany(Comment, {
    foreignKey: "reviewId",
    as: "ReviewComments",
    constraints: false,
});

Comment.belongsTo(Review, {
    foreignKey: "reviewId",
    as: "Review",
    constraints: false,
});

User.hasMany(Comment, {
    foreignKey: "userId",
    as: "UserComments",
    constraints: false,
});

Comment.belongsTo(User, {
    foreignKey: "userId",
    as: "CommentCreator",
    constraints: false,
});

User.belongsToMany(Review, {
    through: UserReviewRatings,
    as: "RatedReviews",
    foreignKey: "userId",
    constraints: false,
});

Review.belongsToMany(User, {
    through: UserReviewRatings,
    as: "Raters",
    foreignKey: "reviewId",
    constraints: false,
});

Review.hasMany(UserReviewRatings, {
    foreignKey: "reviewId",
    as: "Ratings",
    constraints: false,
});

UserReviewRatings.belongsTo(Review, {
    foreignKey: "reviewId",
    constraints: false,
});

User.belongsToMany(Review, {
    through: UserReviewLikes,
    as: "LikedReviews",
    foreignKey: "userId",
    constraints: false,
});

Review.belongsToMany(User, {
    through: UserReviewLikes,
    as: "Likers",
    foreignKey: "reviewId",
    constraints: false,
});

sequelize
    .sync({ force: false })
    .then(() => console.log("Tables have been created."))
    .catch((error) => console.error("Unable to create the tables:", error));

module.exports = {
    User,
    Review,
    Comment,
    UserReviewLikes,
    UserReviewRatings,
};
