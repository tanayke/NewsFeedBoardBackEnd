"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      article.belongsTo(models.category, {
        foreignKey: "categoryId",
        onDelete: "CASCADE",
      });
      article.belongsTo(models.user, {
        foreignKey: "reporterId",
        onDelete: "CASCADE",
      });
      article.belongsTo(models.address, {
        foreignKey: "addressId",
        onDelete: "CASCADE",
      });
    }
  }
  article.init(
    {
      title: DataTypes.STRING(120),
      description: DataTypes.STRING(250),
      thumbnailImage: DataTypes.STRING(250),
      viewCount: DataTypes.BIGINT,
      uploadDateTime: DataTypes.DATE,
      isActive: DataTypes.INTEGER(1),
    },
    {
      sequelize,
      modelName: "article",
    }
  );

  return article;
};
