'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customers.init({
    customers_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    address: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
    latitude: DataTypes.INTEGER,
    longitude: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'customers',
    tableName: 'customers'
  });
  return customers;
};