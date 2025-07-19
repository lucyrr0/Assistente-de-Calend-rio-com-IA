
export interface Appointment {
  id: string;
  title: string;
  dateTime: string; // ISO 8601 format
  reminderMinutes: number;
  timerId?: number; // To store setTimeout ID
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
}

export interface GeminiResponse {
  action: 'SCHEDULE_EVENT' | 'UPDATE_REMINDER_TIME' | 'CLARIFICATION' | 'ERROR';
  events?: {
    title: string;
    dateTime: string; // ISO 8601 format
  }[];
  newReminderMinutes?: number;
  reminderOffsetMinutes?: number;
  confirmationMessage: string;
}
