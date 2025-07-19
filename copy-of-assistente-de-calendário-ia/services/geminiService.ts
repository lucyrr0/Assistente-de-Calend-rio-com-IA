import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeminiResponse } from '../types';

// Per coding guidelines, the API key must be obtained from process.env.API_KEY
// and we must assume it is pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        action: {
            type: Type.STRING,
            enum: ['SCHEDULE_EVENT', 'UPDATE_REMINDER_TIME', 'CLARIFICATION', 'ERROR'],
            description: "A ação a ser executada: agendar evento, atualizar tempo de lembrete, pedir esclarecimento ou indicar um erro."
        },
        events: {
            type: Type.ARRAY,
            description: "Lista de eventos a serem agendados. Presente apenas para a ação SCHEDULE_EVENT.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "O título do evento."
                    },
                    dateTime: {
                        type: Type.STRING,
                        description: "A data e hora completas no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)."
                    }
                },
                required: ["title", "dateTime"]
            }
        },
        newReminderMinutes: {
            type: Type.INTEGER,
            description: "O novo tempo de lembrete padrão em minutos. Presente apenas para a ação UPDATE_REMINDER_TIME."
        },
        reminderOffsetMinutes: {
            type: Type.INTEGER,
            description: "Um deslocamento de lembrete específico para os eventos agendados, em minutos. Se não for fornecido, o padrão será usado."
        },
        confirmationMessage: {
            type: Type.STRING,
            description: "Uma mensagem de confirmação amigável para mostrar ao usuário. Sempre forneça esta mensagem."
        }
    },
    required: ["action", "confirmationMessage"]
};

export const processRequest = async (userInput: string): Promise<GeminiResponse | null> => {
  try {
    const currentDate = new Date().toISOString();
    const systemInstruction = `Você é um assistente de calendário inteligente. Sua tarefa é analisar as solicitações do usuário e extrair detalhes de compromissos ou alterações de configuração. A data e hora atuais são ${currentDate}. Responda SEMPRE em um formato JSON estruturado de acordo com o esquema fornecido. Seja amigável e confirme a ação que você executou no campo confirmationMessage. Se o usuário fornecer uma data relativa (por exemplo, "amanhã", "nos próximos 3 dias"), calcule a data exata. Se um horário não for especificado, presuma um horário razoável como 9:00 AM, mas peça confirmação na mensagem. Se a solicitação for ambígua, use a ação CLARIFICATION. Se o usuário quiser alterar o tempo do lembrete, use UPDATE_REMINDER_TIME. Para agendar um evento, use SCHEDULE_EVENT. Por exemplo, se o usuário disser 'tenho que tomar um remédio às 8 e 16 horas durante os 3 próximos dias', você deve criar 6 eventos, um para cada horário em cada um dos 3 dias.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: userInput }]
      }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeminiResponse;

  } catch (error) {
    console.error("Error processing request with Gemini:", error);
    return {
      action: 'ERROR',
      confirmationMessage: "Desculpe, não consegui processar seu pedido. Por favor, tente novamente."
    };
  }
};