'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Article, User }) {
      // define association here
      Location.hasOne(Article, {
        foreignKey: {
          name: 'location_id',
          allowNull: false,
          as: 'location',
        },
      });
      Location.hasOne(User, {
        foreignKey: {
          name: 'location_id',
        },
      });
    }
  }
  Location.init(
    {
      locality: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Location',
      tableName: 'localities',
      timestamps: false,
    }
  );
  return Location;
};
