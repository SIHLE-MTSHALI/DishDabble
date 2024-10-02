const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const notificationController = require('../../controllers/notificationController');

// @route   GET api/notifications
// @desc    Get all notifications for the authenticated user
// @access  Private
router.get('/', auth, notificationController.getNotifications);

// @route   PUT api/notifications/:id
// @desc    Mark a notification as read
// @access  Private
router.put('/:id', auth, notificationController.markAsRead);

// @route   DELETE api/notifications
// @desc    Delete all notifications for the authenticated user
// @access  Private
router.delete('/', auth, notificationController.deleteAllNotifications);

module.exports = router;