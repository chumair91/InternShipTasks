const { createAdapter } = require('@socket.io/redis-adapter');

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../model/User');
const Message = require('../model/Message');
const { pubClient, subClient } = require('../config/socketRedis');

let io;
const activeSupportRooms = new Map();
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.allowedOrigins.split(',').map((p) => p.trim()),
      credentials: true,
    },
  });
  io.adapter(createAdapter(pubClient, subClient));
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = jwt.verify(token, config.jwtAccessSecret);
      // console.log(decoded);
      const user = await User.findById(decoded.id);
      // console.log(user);
      if (!user) {
        return next(new Error('User not found'));
      }
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket auth error:', error.message);
      next(new Error('Invalid authentication token'));
    }
  });

  const adminNamespace = io.of('/admin');
  adminNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = jwt.verify(token, config.jwtAccessSecret);

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }
      if (user.role !== 'admin') {
        return next(new Error('Admin access required'));
      }
      socket.user = user;
      next();
    } catch (error) {
      console.error('Admin socket auth error:', error.message);

      next(new Error('Invalid authentication token'));
    }
  });

  adminNamespace.on('connection', (socket) => {
    const adminId = socket.user._id.toString();
    console.log('admin connected', adminId);
    console.log(
      `[PORT ${process.env.PORT}] Admin connected:`,
      socket.user._id.toString()
    );
    socket.emit('support:rooms', Array.from(activeSupportRooms.values()));
    socket.on('admin:join', async ({ userId }) => {
      try {
        if (!userId) {
          return socket.emit('chat:error', {
            message: 'User ID is required',
          });
        }

        const customer = await User.findById(userId).select('name');
        if (!customer) {
          return socket.emit('chat:error', {
            message: 'Customer not found',
          });
        }
        const room = `support:${userId}`;

        if (socket.currentSupportRoom && socket.currentSupportRoom !== room) {
          socket.leave(socket.currentSupportRoom);
          console.log(`Admin left ${socket.currentSupportRoom}`);
        }
        socket.join(room);
        socket.currentSupportRoom = room;
        console.log(`Admin ${socket.user._id} joined ${room}`);
        const messages = await Message.find({ room })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate('sender', 'name role');

        messages.reverse();

        socket.emit('chat:history', messages);
      } catch (error) {
        console.error('Admin chat join error:', error);

        socket.emit('chat:error', {
          message: 'Failed to load chat history',
        });
      }
    });
    socket.on('admin:getRooms', () => {
      socket.emit('support:rooms', Array.from(activeSupportRooms.values()));
    });
    socket.on('admin:leave', () => {
      if (!socket.currentSupportRoom) return;

      console.log(`Admin left ${socket.currentSupportRoom}`);

      socket.leave(socket.currentSupportRoom);
      socket.currentSupportRoom = null;
    });
    socket.on('admin:message', async ({ userId, text }) => {
      try {
        if (!userId) {
          return socket.emit('chat:error', {
            message: 'user ID is required',
          });
        }
        if (!text || !text.trim()) {
          return socket.emit('chat:error', {
            message: 'Message cannot be empty',
          });
        }
        const room = `support:${userId}`;
        const message = await Message.create({
          room,
          sender: socket.user._id,
          text: text.trim(),
        });
        await message.populate('sender', 'name role');
        console.log(message.sender.role);

        io.to(room).emit('chat:message', message);
        adminNamespace.to(room).emit('chat:message', message);
      } catch (error) {
        console.error('Admin message error:', error);

        socket.emit('chat:error', {
          message: 'Failed to send message',
        });
      }
    });
    socket.on('admin:typing', ({ userId }) => {
      if (!userId) return;
      const room = `support:${userId}`;
      io.to(room).emit('chat:typing', {
        userId: socket.user._id.toString(),
        role: 'admin',
      });
    });
    socket.on('admin:stopTyping', ({ userId }) => {
      if (!userId) return;
      const room = `support:${userId}`;
      io.to(room).emit('chat:stopTyping', {
        userId: socket.user._id.toString(),
        role: 'admin',
      });
    });

    socket.on('admin:read', async ({ userId }) => {
      try {
        if (!userId) return;
        const room = `support:${userId}`;
        await Message.updateMany(
          {
            room,
            sender: { $ne: socket.user._id },
            readAt: null,
          },
          {
            $set: { readAt: new Date() },
          }
        );
        io.to(room).emit('chat:read', {
          userId,
          readAt: new Date(),
        });
      } catch (error) {
        console.error('Admin read error:', error);
      }
    });
    socket.on('disconnect', ({ userId }) => {
      console.log(`Admin disconnected: ${adminId}`);
      const room = `support:${userId}`;
      if (activeSupportRooms.has(room)) {
        activeSupportRooms.delete(room);

        io.to(room).emit('chat:disconnect', { userId });
      }
      console.log(`admin  disconnected: ${userId}`);
    });
  });
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`Socket connected: ${userId}`);
    console.log(
      `[PORT ${process.env.PORT}] Customer connected:`,
      socket.user._id.toString()
    );
    socket.join(`user:${userId}`);
    socket.on('chat:join', async () => {
      try {
        const room = `support:${userId}`;
        socket.join(room);
        activeSupportRooms.set(room, {
          userId,
          name: socket.user.name,
          socketIds: new Set(),
        });
        activeSupportRooms.get(room).socketIds.add(socket.id);
        broadcastSupportRooms();
        adminNamespace.emit(
          'support:rooms',
          Array.from(activeSupportRooms.values())
        );
        console.log(`${userId} joined ${room}`);
        const messages = await Message.find({ room })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate('sender', 'name role');

        messages.reverse();
        socket.emit('chat:history', messages);
      } catch (error) {
        console.error('Chat join error:', error);

        socket.emit('chat:error', {
          message: 'Failed to load chat history',
        });
      }
    });

    const getActiveRooms = () => {
      return Array.from(activeSupportRooms.values()).map((session) => ({
        userId: session.userId,
        name: session.name,
      }));
    };
    const broadcastSupportRooms = () => {
      adminNamespace.emit('support:rooms', getActiveRooms());
    };

 

    socket.on('chat:message', async ({ text }) => {
      try {
        if (!text || !text.trim()) {
          return socket.emit('chat:error', {
            message: 'Message cannot be empty',
          });
        }
        const userId = socket.user._id.toString();
        const room = `support:${userId}`;

        const message = await Message.create({
          room,
          sender: socket.user._id,
          text: text.trim(),
        });
        await message.populate('sender', 'name role');

        io.to(room).emit('chat:message', message);
        adminNamespace.to(room).emit('chat:message', message);
      } catch (error) {
        console.error('Chat message error:', error);

        socket.emit('chat:error', {
          message: 'Failed to send message',
        });
      }
    });

    socket.on('redis:test', ({ room, message }) => {
      console.log(`[${process.env.PORT}] received redis:test from client`);

      io.to(room).emit('redis:test-message', {
        message,
        emittedByPort: process.env.PORT,
      });
    });
    socket.on('chat:typing', () => {
      const room = `support:${userId}`;
      // socket.broadcast.to(room).emit('chat:typing', { userId });
      adminNamespace.to(room).emit('chat:typing', { userId });
    });
    socket.on('chat:read', async () => {
      try {
        const room = `support:${userId}`;
        await Message.updateMany(
          {
            room,
            sender: { $ne: socket.user._id },
            readAt: null,
          },
          {
            $set: { readAt: new Date() },
          }
        );
        adminNamespace.to(room).emit('admin:read', {
          userId,
          readAt: new Date(),
        });
      } catch (error) {
        console.error('Customer read error:', error);
      }
    });
    socket.on('chat:stopTyping', () => {
      const room = `support:${userId}`;
      adminNamespace.to(room).emit('chat:stopTyping', {
        userId,
      });
    });
    socket.on('chat:leave', () => {
      const room = `support:${userId}`;
      socket.leave(room);
      const session = activeSupportRooms.get(room);
      if (session) {
        session.socketIds.delete(socket.id);
        if (session.socketIds.size === 0) {
          activeSupportRooms.delete(room);
          adminNamespace.to(room).emit('chat:leave', { userId });
        }
      }

      socket.currentSupportRoom = null;
      broadcastSupportRooms();

      console.log(`${userId} left ${room}`);
    });
    socket.on('disconnect', () => {
      const room = socket.currentSupportRoom;

      if (room) {
        const session = activeSupportRooms.get(room);

        if (session) {
          session.socketIds.delete(socket.id);

          if (session.socketIds.size === 0) {
            activeSupportRooms.delete(room);

            adminNamespace.to(room).emit('chat:disconnect', {
              userId,
            });
          }
        }

        broadcastSupportRooms();
      }

      console.log(`Socket disconnected: ${userId}`);
    });
  });
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
};
module.exports = {
  initializeSocket,
  getIO,
};
