
import React from 'react';
import { Appointment } from '../types';
import { CalendarIcon, ClockIcon, BellIcon } from './icons';

interface AppointmentListProps {
  appointments: Appointment[];
  onRemoveAppointment: (id: string) => void;
}

const AppointmentCard: React.FC<{ appointment: Appointment; onRemove: (id: string) => void }> = ({ appointment, onRemove }) => {
    const date = new Date(appointment.dateTime);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg transition-transform hover:scale-105">
            <h3 className="font-bold text-lg text-text-primary mb-2">{appointment.title}</h3>
            <div className="text-sm text-text-secondary space-y-2">
                <div className="flex items-center">
                    <CalendarIcon />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                    <ClockIcon />
                    <span>{formattedTime}</span>
                </div>
                <div className="flex items-center">
                    <BellIcon />
                    <span>Lembrete: {appointment.reminderMinutes} min antes</span>
                </div>
            </div>
            <button
                onClick={() => onRemove(appointment.id)}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 text-sm font-semibold transition-colors"
            >
                Cancelar
            </button>
        </div>
    );
};


const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onRemoveAppointment }) => {
  return (
    <div className="flex flex-col h-full bg-base-100 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-text-primary border-b-2 border-brand-primary pb-2">
        Próximos Compromissos
      </h2>
      {appointments.length > 0 ? (
        <div className="overflow-y-auto space-y-4 pr-2">
          {appointments.map((app) => (
            <AppointmentCard key={app.id} appointment={app} onRemove={onRemoveAppointment} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
          </svg>
          <p className="text-lg">Nenhum compromisso agendado.</p>
          <p className="text-sm">Use o chat para adicionar um novo lembrete!</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
