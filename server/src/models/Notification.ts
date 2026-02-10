import mongoose, { Schema, Document } from 'mongoose';
import {
  Notification,
  NotificationTypeEnum,
  NotificationUiTypeEnum,
} from '@by-trail/shared';

// Extend Shared Type: Override 'recipient' to be ObjectId
export interface NotificationDocument
  extends Omit<Notification, '_id' | 'recipient'>, Document {
  recipient: mongoose.Types.ObjectId;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationTypeEnum),
      required: true,
    },
    uiType: {
      type: String,
      enum: Object.values(NotificationUiTypeEnum),
      required: true,
      default: NotificationUiTypeEnum.INFO,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      // Flexible container corresponding to z.record(z.any())
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    referenceUrl: { type: String },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for fast fetching of user notifications
notificationSchema.index({ recipient: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
);
