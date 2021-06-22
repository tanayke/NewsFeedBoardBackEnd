'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Location, Category, User, Report, Card }) {
      // define association here
      Article.hasMany(Report, {
        foreignKey: {
          name: 'article_id',
          allowNull: false,
        },
      });
      Article.hasMany(Card, {
        foreignKey: {
          name: 'article_id',
          allowNull: true,
        },
      });
      Article.belongsTo(Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Article.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });
      Article.belongsTo(Location, {
        foreignKey: 'location_id',
        as: 'location',
      });
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      thumbnailImage: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      viewCount: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
      },
      uploadDateTime: DataTypes.DATE,
      isActive: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Article',
      tableName: 'articles',
    }
  );

  return Article;
};
