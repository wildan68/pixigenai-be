import type { Sequelize } from 'sequelize'
import { DataTypes } from 'sequelize'
import type { UsersAttributes } from '../types/types.d.js'

export default function usersModels(sequelize: Sequelize) {
  return sequelize.define<UsersAttributes>('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    telegram_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    last_login_ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    register_ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    updatedAt: false,
    tableName: 'users',
  })
}
