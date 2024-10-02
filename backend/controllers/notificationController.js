const Notification = require('../models/Notification');

// Get all notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('sender', 'username')
      .populate('recipe', 'title');

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Make sure the notification belongs to the authenticated user
    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new notification
exports.createNotification = async (type, user, sender, recipe = null, content = '') => {
  try {
    const newNotification = new Notification({
      type,
      user,
      sender,
      recipe,
      content
    });

    await newNotification.save();

    // Here you would typically emit a socket event to notify the user in real-time
    // io.to(user.toString()).emit('newNotification', newNotification);

    return newNotification;
  } catch (err) {
    console.error('Error creating notification:', err.message);
  }
};

// Delete all notifications for a user (optional, for cleanup purposes)
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ msg: 'All notifications deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};