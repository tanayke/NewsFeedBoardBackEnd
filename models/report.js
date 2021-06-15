"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      report.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      report.belongsTo(models.article, {
        foreignKey: "articleId",
        onDelete: "CASCADE",
      });
    }
  }
  report.init(
    {
      reason: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "report",
    }
  );
  return report;
};
