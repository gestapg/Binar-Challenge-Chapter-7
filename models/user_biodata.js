'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  User_biodata.init(
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      nationality: {
        type: DataTypes.STRING,
      },
      tribe: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'users_biodata',
      modelName: 'User_biodata',
    }
  );
  return User_biodata;
};
