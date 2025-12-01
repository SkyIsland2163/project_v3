const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Event 모델 정의 (행사 일정 정보 저장)
const Event = sequelize.define(
  'Event',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isImportant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    importantMemo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'events',
    // Enable Sequelize-managed timestamps for createdAt/updatedAt so recent queries can sort by creation time
    timestamps: true
  }
);

module.exports = Event;

