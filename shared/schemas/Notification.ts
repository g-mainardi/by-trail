import { z } from 'zod';

// Notification-specific enums
export const NotificationTypeEnum = {
  BIVOUAC_INTENTION: 'bivouac_intention',
  BIVOUAC_INTENTION_UPDATE: 'bivouac_intention_update',
  BIVOUAC_INTENTION_DELETE: 'bivouac_intention_delete',
  BIVOUAC_INTENTION_USERS: 'bivouac_intention_users',
  ROUTE_INTENTION: 'route_intention',
  WEATHER_ALERT: 'weather_alert',
} as const;

export const NotificationUiTypeEnum = {
  INFO: 'info',
  SUCCESS: 'success',
  ALERT: 'alert',
} as const;

// Main schema
export const NotificationZodSchema = z.object({
  _id: z.string().optional(),
  recipient: z.string().min(1), // User ID
  type: z.nativeEnum(NotificationTypeEnum),
  uiType: z
    .nativeEnum(NotificationUiTypeEnum)
    .default(NotificationUiTypeEnum.INFO),
  title: z.string().min(1),
  message: z.string().min(1),
  data: z.record(z.any()).optional(), // flexible container
  referenceUrl: z.string().url().optional(),
  isRead: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Infer the TypeScript type from the Zod schema
export type Notification = z.infer<typeof NotificationZodSchema>;

// Also infer specific field types if needed
export type NotificationType = z.infer<typeof NotificationZodSchema>['type'];
export type NotificationUiType = z.infer<
  typeof NotificationZodSchema
>['uiType'];
