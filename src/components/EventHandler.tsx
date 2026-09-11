export default function EventHandler() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Структура обработчика событий</h2>
        <p className="text-gray-400">Архитектура middleware-сервера для обработки AMI-событий</p>
      </div>

      {/* Module Structure */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Структура проекта</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">{`mikopbx-planfix-integration/
├── src/
│   ├── index.ts                    # Точка входа
│   ├── config/
│   │   ├── mikopbx.ts              # Настройки подключения к AMI
│   │   ├── planfix.ts              # Настройки Planfix API
│   │   └── mapping.ts              # Маппинг номеров → сотрудники
│   ├── ami/
│   │   ├── client.ts               # AMI клиент (подключение)
│   │   ├── event-parser.ts         # Парсер AMI событий
│   │   └── event-types.ts          # Типы событий
│   ├── handlers/
│   │   ├── newchannel.ts           # Обработка Newchannel
│   │   ├── dial.ts                 # Обработка Dial
│   │   ├── answer.ts               # Обработка Answer
│   │   ├── hangup.ts               # Обработка Hangup
│   │   ├── cdr.ts                  # Обработка CDR
│   │   └── transfer.ts             # Обработка Transfer
│   ├── services/
│   │   ├── planfix-client.ts       # HTTP клиент для Planfix API
│   │   ├── contact-resolver.ts     # Поиск/создание контактов
│   │   ├── employee-mapper.ts      # Маппинг ext → Planfix user
│   │   ├── task-manager.ts         # Создание/обновление задач
│   │   ├── recording-service.ts    # Обработка записей
│   │   └── phone-formatter.ts      # Форматирование номеров
│   ├── queue/
│   │   ├── bull-queue.ts           # Очередь задач (BullMQ)
│   │   └── retry-policy.ts         # Политика повторных попыток
│   ├── db/
│   │   ├── models/
│   │   │   ├── CallSession.ts      # Модель сессии звонка
│   │   │   └── EmployeeMapping.ts  # Модель маппинга
│   │   └── migrations/
│   ├── utils/
│   │   ├── logger.ts               # Winston логгер
│   │   └── helpers.ts              # Утилиты
│   └── types/
│       ├── ami.ts                  # Типы AMI
│       ├── planfix.ts              # Типы Planfix
│       └── call.ts                 # Типы звонка
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── package.json`}</pre>
      </div>

      {/* Event Handler Flow */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Логика обработки событий</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">1. AMI Event Listener</h4>
            <p className="text-sm text-gray-400 mb-2">Подключается к MikoPBX через AMI, получает все события в реальном времени.</p>
            <div className="text-xs font-mono text-gray-500">
              События → Парсер → Классификация → Роутер
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">2. Event Router</h4>
            <p className="text-sm text-gray-400 mb-2">Определяет тип события и направляет в соответствующий обработчик.</p>
            <div className="text-xs font-mono text-gray-500">
              Newchannel → CallSession.create()<br/>
              Dial → CallSession.setAgent()<br/>
              Answer → CallSession.setConnected()<br/>
              Hangup → CallSession.complete()<br/>
              Cdr → CallSession.finalize()
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
            <h4 className="text-sm font-semibold text-green-400 mb-2">3. Call Session Manager</h4>
            <p className="text-sm text-gray-400 mb-2">Управляет жизненным циклом звонка. Хранит промежуточное состояние в Redis.</p>
            <div className="text-xs font-mono text-gray-500">
              Redis Key: call:{`{`}uniqueid{`}`}<br/>
              State: {`{`}caller, callee, agent, status, startTime, ...{`}`}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-amber-500">
            <h4 className="text-sm font-semibold text-amber-400 mb-2">4. Queue Processor</h4>
            <p className="text-sm text-gray-400 mb-2">Асинхронная обработка через BullMQ. Гарантирует доставку и retry.</p>
            <div className="text-xs font-mono text-gray-500">
              Queue: planfix-api-calls<br/>
              Workers: 3 (параллельная обработка)<br/>
              Retry: 3 attempts, exponential backoff
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-cyan-500">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">5. Planfix API Client</h4>
            <p className="text-sm text-gray-400 mb-2">HTTP клиент с retry, rate limiting и error handling.</p>
            <div className="text-xs font-mono text-gray-500">
              Rate limit: 8 req/sec (с запасом от лимита 10)<br/>
              Timeout: 10s<br/>
              Retry: на 429, 500, 502, 503
            </div>
          </div>
        </div>
      </div>

      {/* Data Model */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Модель данных CallSession</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">{`interface CallSession {
  // Идентификация
  uniqueId: string;           // Asterisk UniqueID
  callId: string;             // Внутренний ID
  
  // Участники
  callerNumber: string;       // Номер звонящего (+79991234567)
  callerName: string;         // Имя из CallerID
  calleeNumber: string;       // Набираемый номер (DID)
  agentExtension: string;     // Внутренний номер сотрудника
  agentPlanfixId: number;     // ID сотрудника в Planfix
  
  // Planfix
  contactPlanfixId: number;   // ID контакта в Planfix
  taskPlanfixId: number;      // ID задачи в Planfix
  isNewContact: boolean;      // Контакт создан заново
  
  // Статус и время
  status: 'ringing' | 'connected' | 'completed' | 'missed' | 'voicemail';
  direction: 'inbound' | 'outbound';
  startTime: Date;
  answerTime?: Date;
  endTime?: Date;
  duration: number;           // Секунды
  ringDuration: number;       // Секунды до ответа
  
  // Запись
  recordingPath?: string;     // Путь к файлу на сервере
  recordingUrl?: string;      // Публичный URL
  
  // Метаданные
  channelName: string;        // SIP/trunk-00000001
  context: string;            // from-external / from-internal
  disposition: string;        // ANSWERED, NO ANSWER, BUSY
  transferFrom?: string;      // Если был перевод
}`}</pre>
      </div>

      {/* Error Handling */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Обработка ошибок</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400">Ошибка</th>
                <th className="text-left py-2 px-3 text-gray-400">Действие</th>
                <th className="text-left py-2 px-3 text-gray-400">Retry</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-red-400">Planfix 429 (Rate Limit)</td>
                <td className="py-2 px-3 text-gray-300">Пауза, повтор через backoff</td>
                <td className="py-2 px-3 text-gray-300">Да (3x)</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-red-400">Planfix 500/502/503</td>
                <td className="py-2 px-3 text-gray-300">Повтор через очередь</td>
                <td className="py-2 px-3 text-gray-300">Да (5x)</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-red-400">Planfix 404 (не найден)</td>
                <td className="py-2 px-3 text-gray-300">Создать ресурс, повторить</td>
                <td className="py-2 px-3 text-gray-300">Да (1x)</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-red-400">AMI disconnected</td>
                <td className="py-2 px-3 text-gray-300">Автопереподключение</td>
                <td className="py-2 px-3 text-gray-300">Бесконечно</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-red-400">Redis unavailable</td>
                <td className="py-2 px-3 text-gray-300">Fallback на PostgreSQL</td>
                <td className="py-2 px-3 text-gray-300">Да</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
