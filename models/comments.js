'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        comments.belongsTo(models.user, { foreignKey: 'comment_by_user', as: 'commentByUser' });
    }
  }
  comments.init({
    id_post: DataTypes.INTEGER,
    comment_by_user: DataTypes.INTEGER,
    comment_body:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};