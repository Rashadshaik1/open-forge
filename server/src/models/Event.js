import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    category: {
      type: String,
      enum: ['Workshop', 'Hackathon', 'Coding Challenge', 'Webinar', 'Meetup', 'General'],
      default: 'Workshop',
    },
    venue: {
      type: String,
      required: [true, 'Venue or online link is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event start date and time is required'],
    },
    eventEndDate: {
      type: Date,
      default: null, // If set, event auto-marks completed once passed
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true, // Manual override switch (true = open, false = manually closed)
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming', // Manual override status
    },
    bannerImage: {
      type: String,
      default: '',
    },
    // Array to store multiple gallery photos per event
    galleryImages: [galleryImageSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to check if registrations are actively accepted right now
eventSchema.methods.canAcceptRegistration = function () {
  const now = new Date();

  // 1. Manual registration toggle check
  if (!this.isRegistrationOpen) {
    return { allowed: false, reason: 'Registrations have been manually closed by the organizers.' };
  }

  // 2. Event lifecycle status check
  if (this.status !== 'upcoming') {
    return { allowed: false, reason: `Cannot register: Event is marked as ${this.status}.` };
  }

  // 3. Time deadline check
  if (now > new Date(this.registrationDeadline)) {
    return { allowed: false, reason: 'Registration deadline has passed.' };
  }

  // 4. Capacity limit check
  if (this.registeredCount >= this.capacity) {
    return { allowed: false, reason: 'Event registrations are full.' };
  }

  return { allowed: true };
};

// Auto-sync status based on event dates if not cancelled
eventSchema.methods.getEffectiveStatus = function () {
  if (this.status === 'cancelled') return 'cancelled';

  const now = new Date();
  if (this.eventEndDate && now > new Date(this.eventEndDate)) {
    return 'completed';
  }
  if (now >= new Date(this.eventDate) && (!this.eventEndDate || now <= new Date(this.eventEndDate))) {
    return 'ongoing';
  }
  return this.status;
};

export default mongoose.model('Event', eventSchema);