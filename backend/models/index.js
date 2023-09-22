const { Sequelize, DataTypes } = require("sequelize");
const { Client } = require("@planet/client");
require("dotenv").config();
const url = require("url");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        },
    },
    logging: false,
});

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
