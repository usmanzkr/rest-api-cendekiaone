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
      // define association here
    }
  }
  post.init({
    post_title: DataTypes.STRING,
    post_description: DataTypes.TEXT,
    id_user: DataTypes.INTEGER,
    image_url: DataTypes.TEXT,
    categories: DataTypes.INTEGER,
    subcatgoeries: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};