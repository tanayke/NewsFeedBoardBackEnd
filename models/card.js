'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Article }) {
      // define association here
      Card.belongsTo(Article, { foreignKey: 'article_id' });
    }
  }
  Card.init(
    {
      type: {
        type: DataTypes.ENUM('TEXT', 'IMAGE', 'VIDEO'),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Card',
      tableName: 'cards',
      timestamps: false,
    }
  );
  return Card;
};
