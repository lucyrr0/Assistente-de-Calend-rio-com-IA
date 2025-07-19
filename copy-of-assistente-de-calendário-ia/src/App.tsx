import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import AppointmentList from './components/AppointmentList';
import { useAppointments } from './hooks/useAppointments';
import { processRequest } from './services/geminiService';
import { Message, GeminiResponse } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { appointments, addAppointment, removeAppointment, notificationPermission } = useAppointments();
  const [defaultReminderMinutes, setDefaultReminderMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('defaultReminderMinutes');
    return saved ? parseInt(saved, 10) : 10;
  });

  useEffect(() => {
    localStorage.setItem('defaultReminderMinutes', defaultReminderMinutes.toString());
  }, [defaultReminderMinutes]);

  useEffect(() => {
    const initialMessage: Message = {
      id: 'init',
      text: 'Olá! Sou seu assistente de calendário. Diga-me sobre seus compromissos e eu cuidarei dos lembretes.',
      sender: 'ai',
    };
    if (notificationPermission === 'default') {
        initialMessage.text += "\n\nPor favor, permita as notificações para que eu possa lhe avisar.";
    } else if (notificationPermission === 'denied') {
        initialMessage.text += "\n\nAs notificações estão bloqueadas. Por favor, habilite-as nas configurações do seu navegador para receber lembretes.";
    }
    setMessages([initialMessage]);
  }, [notificationPermission]);

  const handleAiResponse = useCallback((response: GeminiResponse) => {
    const aiMessage: Message = {
      id: new Date().toISOString(),
      text: response.confirmationMessage,
      sender: 'ai',
    };
    setMessages(prev => [...prev, aiMessage]);

    switch (response.action) {
      case 'SCHEDULE_EVENT':
        if (response.events) {
          response.events.forEach(event => {
            addAppointment({
              title: event.title,
              dateTime: event.dateTime,
              reminderMinutes: response.reminderOffsetMinutes ?? defaultReminderMinutes,
            });
          });
        }
        break;
      case 'UPDATE_REMINDER_TIME':
        if (response.newReminderMinutes) {
          setDefaultReminderMinutes(response.newReminderMinutes);
        }
        break;
      case 'CLARIFICATION':
      case 'ERROR':
        // Just display the message
        break;
    }
  }, [addAppointment, defaultReminderMinutes]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: new Date().toISOString(),
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await processRequest(text);
      if (response) {
        handleAiResponse(response);
      } else {
         const errorMessage: Message = {
          id: new Date().toISOString() + 'err',
          text: "Ocorreu um erro. Não foi possível obter uma resposta.",
          sender: 'ai',
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
       const errorMessage: Message = {
          id: new Date().toISOString() + 'catch',
          text: "Falha na comunicação com o assistente. Verifique sua conexão.",
          sender: 'ai',
        };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [handleAiResponse]);

  return (
    <div className="flex flex-col h-screen font-sans bg-base-100">
      <Header defaultReminderMinutes={defaultReminderMinutes} />
      <main className="flex-1 container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <div className="h-full min-h-0">
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
        <div className="h-full min-h-0">
          <AppointmentList appointments={appointments} onRemoveAppointment={removeAppointment} />
        </div>
      </main>
    </div>
  );
};

export default App;