import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../types';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const scheduleNotification = useCallback((appointment: Appointment) => {
    if (notificationPermission !== 'granted') {
      console.log('Notification permission not granted.');
      return undefined;
    }

    const now = new Date().getTime();
    const notificationTime = new Date(appointment.dateTime).getTime() - appointment.reminderMinutes * 60 * 1000;
    
    if (notificationTime > now) {
      const delay = notificationTime - now;
      const timerId = window.setTimeout(() => {
        new Notification('Lembrete de Compromisso', {
          body: `${appointment.title} está agendado para começar em ${appointment.reminderMinutes} minutos.`,
          icon: '/favicon.svg' 
        });
        // Remove appointment after notification
        removeAppointment(appointment.id, false); 
      }, delay);
      return timerId;
    }
    return undefined;
  }, [notificationPermission]);
  
  const removeAppointment = useCallback((id: string, clearTimer = true) => {
    setAppointments(prev => {
      const appointmentToRemove = prev.find(app => app.id === id);
      if (appointmentToRemove && appointmentToRemove.timerId && clearTimer) {
        clearTimeout(appointmentToRemove.timerId);
      }
      const updatedAppointments = prev.filter(app => app.id !== id);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return updatedAppointments;
    });
  }, []);

  useEffect(() => {
    // Request permission on initial load
    Notification.requestPermission().then(setNotificationPermission);
    
    // Load from localStorage
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      const parsedAppointments: Appointment[] = JSON.parse(storedAppointments);
      const now = new Date().getTime();
      
      // Filter out past appointments and reschedule notifications for future ones
      const upcomingAppointments = parsedAppointments.filter(app => new Date(app.dateTime).getTime() > now);

      upcomingAppointments.forEach(app => {
         app.timerId = scheduleNotification(app);
      });
      
      setAppointments(upcomingAppointments);
      localStorage.setItem('appointments', JSON.stringify(upcomingAppointments));
    }
  }, [scheduleNotification]);


  const addAppointment = useCallback((newAppointment: Omit<Appointment, 'id' | 'timerId'>) => {
    setAppointments(prev => {
      const fullAppointment: Appointment = {
        ...newAppointment,
        id: new Date().toISOString() + Math.random(),
      };
      fullAppointment.timerId = scheduleNotification(fullAppointment);
      
      const updatedAppointments = [...prev, fullAppointment].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return updatedAppointments;
    });
  }, [scheduleNotification]);

  return { appointments, addAppointment, removeAppointment, notificationPermission };
};