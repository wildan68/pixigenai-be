import type { Sequelize } from 'sequelize'
import { DataTypes } from 'sequelize'
import type { ModelsAttributes } from '../types/types.d.js'

export default function modelsModels(sequelize: Sequelize) {
  return sequelize.define<ModelsAttributes>('models', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    draft_model_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    glb_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    task_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
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
    tableName: 'models',
  })
}
