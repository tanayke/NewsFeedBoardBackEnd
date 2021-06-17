'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Article }) {
      // define association here
      Report.belongsTo(User, { foreignKey: 'user_id' });
      Report.belongsTo(Article, { foreignKey: 'article_id' });
    }
  }
  Report.init(
    {
      reason: {
        type: DataTypes.ENUM('SCAM', 'FAKE', 'HARRASMENT', 'ABUSIVE', 'OTHER'),
        allowNull: false,
      },
      otherReason: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Report',
      tableName: 'reports',
    }
  );
  return Report;
};
