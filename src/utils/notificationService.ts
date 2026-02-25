import { projectId, publicAnonKey } from './supabase/info';

/**
 * Notification Service
 * Handles SMS, Email and In-App notifications
 */

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'payment';
  timestamp: string;
  read: boolean;
  jobId?: string;
  actionUrl?: string;
}

interface SendSMSParams {
  to: string;
  message: string;
}

/**
 * Sends an SMS via the server's Twilio integration
 */
export async function sendSMS({ to, message }: SendSMSParams) {
  try {
    const response = await fetch(`${BASE_URL}/send-sms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send SMS');
    }

    console.log('✅ SMS notification triggered:', data);
    return data;
  } catch (error) {
    console.error('❌ Notification Error:', error);
    return { success: false, error };
  }
}

/**
 * Notifies the driver about a new job with collection details
 */
export async function notifyDriverOfJob(driverPhone: string, jobDetails: {
  quoteRef: string;
  orderNumber?: string;
  pickupAddress: string;
  deliveryAddress: string;
}) {
  const message = `
🚚 New ShiftMyHome Job!
Ref: ${jobDetails.quoteRef}
${jobDetails.orderNumber ? `Order #: ${jobDetails.orderNumber}\n` : ''}
Pickup: ${jobDetails.pickupAddress}
Delivery: ${jobDetails.deliveryAddress}

Log in to your dashboard to accept.
  `.trim();

  return sendSMS({ to: driverPhone, message });
}

/**
 * Sends order number to driver once job is accepted
 */
export async function sendOrderNumberToDriver(driverPhone: string, orderNumber: string, quoteRef: string) {
  const message = `
📦 Store Pickup Update (${quoteRef})
The Order Number for your collection is: ${orderNumber}
Please present this at the store customer service desk.
  `.trim();

  return sendSMS({ to: driverPhone, message });
}

// In-memory store for mock in-app notifications
const mockInAppNotifications: Map<string, NotificationMessage[]> = new Map();

/**
 * Core notification service object used by managers
 */
export const notificationService = {
  /**
   * Sends an in-app notification to a specific user
   */
  notifyUser(userId: string, notification: Partial<NotificationMessage>) {
    if (!mockInAppNotifications.has(userId)) {
      mockInAppNotifications.set(userId, []);
    }
    
    const newNotif: NotificationMessage = {
      title: 'Notification',
      message: '',
      type: 'info',
      jobId: undefined,
      ...notification,
      id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: notification.read || false
    } as NotificationMessage;
    
    mockInAppNotifications.get(userId)?.unshift(newNotif);
    console.log(`[Notification] To User ${userId}: ${newNotif.title}`);
    return newNotif;
  },

  /**
   * Gets all in-app notifications for a user
   */
  getInAppNotifications(userId: string): NotificationMessage[] {
    return mockInAppNotifications.get(userId) || [];
  },

  /**
   * Marks a notification as read
   */
  markAsRead(userId: string, notificationId: string) {
    const userNotifs = mockInAppNotifications.get(userId);
    if (userNotifs) {
      const notif = userNotifs.find(n => n.id === notificationId);
      if (notif) notif.read = true;
    }
  },

  /**
   * Higher level helper for job-related notifications
   */
  sendJobNotification(job: any, type: 'payment_received' | 'job_accepted' | 'job_started' | 'job_completed') {
    const titles = {
      payment_received: 'Payment Received',
      job_accepted: 'Job Accepted by Driver',
      job_started: 'Job in Progress',
      job_completed: 'Job Completed'
    };
    
    const messages = {
      payment_received: `Payment for job ${job.reference} has been successfully processed.`,
      job_accepted: `Driver ${job.driverName || 'assigned'} has accepted your job.`,
      job_started: `Your move ${job.reference} is now underway.`,
      job_completed: `Great news! Your move ${job.reference} is complete.`
    };

    // Notify customer
    if (job.customerId) {
      this.notifyUser(job.customerId, {
        title: titles[type],
        message: messages[type],
        type: 'success',
        jobId: job.id
      });
    }

    // Notify admin
    this.notifyUser('ADMIN', {
      title: `Admin: ${titles[type]}`,
      message: `${titles[type]} for job ${job.reference}`,
      type: 'info',
      jobId: job.id
    });
  }
};
