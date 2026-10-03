import Feedback from '../models/Feedback.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc Submit feedback (Verified attendees only)
export const submitFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, review, isAnonymous } = req.body;

    const registration = await Registration.findOne({
      event: eventId,
      user: req.user._id,
      attended: true,
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'Only students who attended this event can leave feedback.',
      });
    }

    const feedback = await Feedback.create({
      event: eventId,
      user: req.user._id,
      rating,
      review,
      isAnonymous: Boolean(isAnonymous),
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already submitted feedback for this event.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get feedback for an event
export const getEventFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name rollNumber department')
      .sort({ createdAt: -1 });

    const totalRatings = feedbacks.length;
    const avgRating = totalRatings
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1)
      : 0;

    const sanitized = feedbacks.map((f) => ({
      _id: f._id,
      rating: f.rating,
      review: f.review,
      createdAt: f.createdAt,
      author: f.isAnonymous ? 'Anonymous Student' : f.user?.name,
      department: f.isAnonymous ? 'GVPCE' : f.user?.department,
    }));

    res.status(200).json({
      success: true,
      stats: { totalRatings, avgRating: Number(avgRating) },
      data: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};