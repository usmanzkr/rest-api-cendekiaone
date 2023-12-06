'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      follower.belongsTo(models.user, { foreignKey: 'followers', as: 'followerDetails' });
      follower.belongsTo(models.user, { foreignKey: 'id_user', as: 'accountOwner' });
    }
  }
  follower.init({
    followers: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'follower',
  });
  return follower;
};