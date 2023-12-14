"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      post_title: {
        type: Sequelize.STRING,
      },
      post_description: {
        type: Sequelize.TEXT,
      },
      id_user: {
        type: Sequelize.INTEGER,
      },
      image_url: {
        type: Sequelize.TEXT,
      },
      categories: {
        type: Sequelize.STRING,
      },
      sub_categories: {
        type: Sequelize.STRING,
      },
      likes: {
        type: Sequelize.INTEGER,
      },
      saved: {
        type: Sequelize.STRING,
      },
      summary: {
        type: Sequelize.STRING,
      },
      following: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("posts");
  },
};
