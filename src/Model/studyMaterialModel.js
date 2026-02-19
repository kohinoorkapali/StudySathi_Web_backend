import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { User } from "./userModel.js";

export const StudyMaterial = sequelize.define("StudyMaterial", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  stream: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },

  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  file_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  is_reported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "study_materials",
  timestamps: true,
});

// Relations
User.hasMany(StudyMaterial, { foreignKey: "user_id" });
StudyMaterial.belongsTo(User, { foreignKey: "user_id" });
