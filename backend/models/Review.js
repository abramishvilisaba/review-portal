// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/connection");
// const User = require("./User");
// const Comment = require("./Comment");

// const Review = sequelize.define("Review", {
//     reviewName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     pieceName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     reviewText: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     userRating: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     tags: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         get() {
//             const tagsValue = this.getDataValue("tags");
//             if (tagsValue === null) {
//                 return null;
//             }
//             return tagsValue.split(",").map((tag) => tag.trim());
//         },
//         set(tags) {
//             this.setDataValue("tags", tags.join(", "));
//         },
//     },
//     likes: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//     },
//     creatorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
// });

// // Review.hasMany(Comment, { foreignKey: "reviewId", as: "Comments" });
// Review.belongsTo(User, { foreignKey: "creatorId", as: "ReviewCreator" });
// Comment.belongsTo(User, { foreignKey: "userId", as: "CommentCreator" });
// Comment.belongsTo(Review, { foreignKey: "reviewId", as: "Comments" });

// module.exports = Review;
