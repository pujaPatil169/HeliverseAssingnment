const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const newMessage = new Message({
      sender: req.user._id,
      receiver: receiverId,
      message
    });

    await newMessage.save();

    // Create notification for the receiver
    await createNotification(
      receiverId,
      `You have a new message from ${req.user.name}`,
      'message',
      `/messages/${newMessage._id}`
    );

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name')
    .populate('receiverId', 'name');

    // Update message status to 'delivered' for received messages
    await Message.updateMany(
      { receiverId: req.user._id, status: 'sent' },
      { status: 'delivered', updatedAt: Date.now() }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiverId: req.user._id },
      { read: true, status: 'read', updatedAt: Date.now() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', updatedMessage: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOneAndDelete({
      _id: messageId,
      receiverId: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
};
