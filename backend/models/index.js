const { Sequelize, DataTypes } = require("sequelize");

const config = require("../db/config");

const sequelize = new Sequelize(config.development);

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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
    },
    { timestamps: true }
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
    { timestamps: true }
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
    },
    { timestamps: true }
);

const UserReviewLikes = sequelize.define(
    "UserReviewLikes",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Review,
                key: "id",
            },
        },
    },
    { timestamps: true }
);

// const UserReviewRatings = sequelize.define(
//     "UserReviewRatings",
//     {
//         userId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: User,
//                 key: "id",
//             },
//         },
//         reviewId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: Review,
//                 key: "id",
//             },
//         },
//         rating: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             validate: {
//                 min: 1,
//                 max: 5,
//             },
//         },
//     },
//     { timestamps: true }
// );

const UserReviewRatings = sequelize.define(
    "UserReviewRatings",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Review,
                key: "id",
            },
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
    { timestamps: true }
);

User.hasMany(Review, { foreignKey: "creatorId", as: "ReviewsCreated" });
Review.belongsTo(User, { foreignKey: "creatorId", as: "ReviewCreator" });

Review.hasMany(Comment, { foreignKey: "reviewId", as: "ReviewComments" });
Comment.belongsTo(Review, { foreignKey: "reviewId", as: "Review" });

User.hasMany(Comment, { foreignKey: "userId", as: "UserComments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "CommentCreator" });

// UserReviewLikes.belongsTo(Review, { foreignKey: "reviewId" });
// Review.hasMany(UserReviewLikes, { foreignKey: "reviewId" });

User.belongsToMany(Review, {
    through: UserReviewRatings,
    as: "RatedReviews",
    foreignKey: "userId",
});
Review.belongsToMany(User, {
    through: UserReviewRatings,
    as: "Raters",
    foreignKey: "reviewId",
});
Review.hasMany(UserReviewRatings, {
    foreignKey: "reviewId",
    as: "Ratings",
});

UserReviewRatings.belongsTo(Review, {
    foreignKey: "reviewId",
});

User.belongsToMany(Review, {
    through: UserReviewLikes,
    as: "LikedReviews",
    foreignKey: "userId",
});
Review.belongsToMany(User, {
    through: UserReviewLikes,
    as: "Likers",
    foreignKey: "reviewId",
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
