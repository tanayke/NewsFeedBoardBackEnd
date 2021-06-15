"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.address, {
        foreignKey: "addressId",
        onDelete: "CASCADE",
      });
    }
  }
  user.init(
    {
      role: DataTypes.ENUM("READER", "REPORTER", "ADMIN"),
      name: DataTypes.STRING(50),
      email: DataTypes.STRING(250),
      phone: DataTypes.STRING(10),
      password: DataTypes.STRING(500),
      isApproved: DataTypes.INTEGER(1),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
