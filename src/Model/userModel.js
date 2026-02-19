// src/models/User.js
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js"; // your Sequelize instance

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING(25), // limit to 25 characters
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      isGmail(value) {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email must be a Gmail address");
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "users", // explicitly define table name
  timestamps: true,   // adds createdAt and updatedAt automatically
});
