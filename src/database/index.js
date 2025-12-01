const sequelize = require('../config/database');
const Event = require('./models/event.model');

// 모든 모델을 초기화하고 내보내는 헬퍼
const initModels = async () => {
  await sequelize.sync();
};

module.exports = {
  sequelize,
  Event,
  initModels
};

