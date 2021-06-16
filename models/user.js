'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Location, Article, Report }) {
      // define association here
      User.hasMany(Article, {
        foreignKey: {
          name: 'reporter_id',
          allowNull: false,
        },
      });
      User.hasMany(Report, {
        foreignKey: {
          name: 'user_id',
        },
      });
      User.belongsTo(Location, { foreignKey: 'location_id' });
    }
  }
  User.init(
    {
      role: {
        type: DataTypes.ENUM('READER', 'REPORTER', 'ADMIN'),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
      },
      email: {
        type: DataTypes.STRING(250),
        unique: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(10),
      },
      password: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      isApproved: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    }
  );
  return User;
};
