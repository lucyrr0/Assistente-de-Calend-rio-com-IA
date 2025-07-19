
import React from 'react';
import { BellIcon } from './icons';

interface HeaderProps {
  defaultReminderMinutes: number;
}

const Header: React.FC<HeaderProps> = ({ defaultReminderMinutes }) => {
  return (
    <header className="bg-base-200 p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Assistente de Calendário IA
        </h1>
        <div className="flex items-center bg-base-300 text-text-secondary py-2 px-4 rounded-full">
          <BellIcon />
          <span>
            Lembrete Padrão: <strong>{defaultReminderMinutes} min</strong>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
