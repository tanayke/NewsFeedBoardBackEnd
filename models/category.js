'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Article }) {
      // define association here
      Category.hasOne(Article, {
        foreignKey: {
          name: 'category_id',
          allowNull: false,
        },
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING(50),
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: false,
    }
  );
  return Category;
};
