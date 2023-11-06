const { DataTypes } = require("sequelize");

const sequelize = require("../db");

const Envelopes = sequelize.define(
  "envelopes",
  {
    envelopeId: {
      type: DataTypes.STRING(200),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sender: {
        type: DataTypes.TEXT
    },
    createdDate: {
        type: DataTypes.DATE
    },
    lastModifiedDateTime: {
        type: DataTypes.DATE
    },
    completedDateTime: {
        type: DataTypes.DATE
    },
    statusChangedDateTime: {
        type: DataTypes.DATE
    }
  },
  {
    timestamps: false,
  }
);

module.exports = Envelopes;
