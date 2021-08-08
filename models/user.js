'use strict';
const { Model } = require('sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static #encrypt = password => bcrypt.hashSync(password, 10);

    static register = ({ username, email, password, role }) => {
      const encryptedPassword = this.#encrypt(password);
      console.log(encryptedPassword);

      return this.create({
        username,
        email,
        password: encryptedPassword,
        role,
      });
    };

    checkPassword = password => bcrypt.compareSync(password, this.password);

    generateToken = () => {
      const payload = {
        id: this.uuid,
        username: this.username,
      };

      const secretKey = 'super-duper-secret-no-one-knows-exactly';

      const token = jwt.sign(payload, secretKey);
      return token;
    };

    static authenticate = async ({ username, password }) => {
      try {
        const user = await this.findOne({ where: { username } });
        if (!user)
          return Promise.reject(
            new Error('User not found! Please register first')
          );

        const validatePasswords = user.checkPassword(password);
        if (!validatePasswords)
          return Promise.reject(new Error('Invalid password!'));

        return Promise.resolve(user);
      } catch (err) {
        return console.log(err);
      }
    };
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username already exist! Please input another username',
        },
        validate: {
          notNull: {
            msg: 'Please Input your username',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email already exist! Please input another email',
        },
        validate: {
          notNull: {
            msg: 'Please Input your email address',
          },
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please Input your password',
          },
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );
  return User;
};
