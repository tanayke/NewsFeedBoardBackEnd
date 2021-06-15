'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  address.init(
    {
      locality: DataTypes.STRING(50),
      city: DataTypes.STRING(50),
      state: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: 'address',
    }
  );
  return address;
};
