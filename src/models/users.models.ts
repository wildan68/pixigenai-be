import type { Sequelize } from 'sequelize'
import { DataTypes } from 'sequelize'
import type { UsersAttributes } from '../types/types.d.js'

export default function usersModels(sequelize: Sequelize) {
  return sequelize.define<UsersAttributes>('users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'user'
    },
    last_login_ip: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    register_ip: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    banned_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    timestamps: false,
    tableName: 'users',
  })
}
