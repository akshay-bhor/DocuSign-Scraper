const { DataTypes } = require("sequelize");

const sequelize = require("../db");

const Signers = sequelize.define(
  "signers",
  {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    envelopeId: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    signerName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    signerEmail: {
        type: DataTypes.TEXT
    },
    roleName: {
        type: DataTypes.TEXT
    },
    deliveryMethod: {
        type: DataTypes.TEXT
    },
    signedDateTime: {
        type: DataTypes.DATE
    },
    deliveredDateTime: {
        type: DataTypes.DATE
    }
  },
  {
    timestamps: false,
  }
);

module.exports = Signers;