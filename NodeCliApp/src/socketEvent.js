const { getIO } = require('./socket');

const emitToUserRoom = (userId, event, data) => {
  getIO().to(`user:${userId}`).emit(event, data);
};

const emitToAll = (event, data) => {
  getIO().emit(event, data);
};

module.exports = { emitToUserRoom, emitToAll };
