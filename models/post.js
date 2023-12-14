'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      post.belongsTo(models.user, { foreignKey: 'id_user', as: 'createdByUser' });
    }
  }
  post.init({
    post_title: DataTypes.STRING,
    post_body: DataTypes.TEXT,
    id_user: DataTypes.INTEGER,
    image_url: DataTypes.TEXT,
    categories: DataTypes.STRING,
    sub_categories: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    saved: DataTypes.STRING,
    summary: DataTypes.STRING,
    following: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};