"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      card.belongsTo(models.article, {
        foreignKey: "articleId",
        onDelete: "CASCADE",
      });
    }
  }
  card.init(
    {
      type: DataTypes.STRING(10),
      content: DataTypes.STRING(500),
    },
    {
      sequelize,
      modelName: "card",
    }
  );
  return card;
};
