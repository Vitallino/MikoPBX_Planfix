export default function Architecture() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Архитектура интеграции</h2>
        <p className="text-gray-400">Общая схема взаимодействия MikoPBX, middleware-сервера и Planfix API</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-x-auto">
        <div className="min-w-[700px]">
          <svg viewBox="0 0 900 420" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* MikoPBX Box */}
            <rect x="20" y="30" width="220" height="160" rx="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
            <text x="130" y="60" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="bold">MikoPBX</text>
            <text x="130" y="82" textAnchor="middle" fill="#94a3b8" fontSize="11">Локальный сервер</text>
            <rect x="40" y="100" width="180" height="30" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="130" y="120" textAnchor="middle" fill="#e2e8f0" fontSize="11">AMI (Asterisk Manager)</text>
            <rect x="40" y="140" width="180" height="30" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="130" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">CDR (Call Detail Records)</text>

            {/* Middleware Box */}
            <rect x="320" y="10" width="260" height="400" rx="12" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2"/>
            <text x="450" y="40" textAnchor="middle" fill="#a78bfa" fontSize="14" fontWeight="bold">Middleware Server</text>
            <text x="450" y="58" textAnchor="middle" fill="#94a3b8" fontSize="11">Node.js / Python</text>
            
            <rect x="340" y="80" width="220" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="450" y="105" textAnchor="middle" fill="#e2e8f0" fontSize="11">AMI Event Listener</text>
            
            <rect x="340" y="135" width="220" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="450" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">Event Router / Queue</text>
            
            <rect x="340" y="190" width="220" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="450" y="215" textAnchor="middle" fill="#e2e8f0" fontSize="11">Phone Number Resolver</text>
            
            <rect x="340" y="245" width="220" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="450" y="270" textAnchor="middle" fill="#e2e8f0" fontSize="11">Planfix API Client</text>
            
            <rect x="340" y="300" width="220" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="450" y="325" textAnchor="middle" fill="#e2e8f0" fontSize="11">Employee Mapper (ext→user)</text>
            
            <rect x="340" y="355" width="220" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="450" y="380" textAnchor="middle" fill="#e2e8f0" fontSize="11">Recording URL Builder</text>

            {/* Planfix Box */}
            <rect x="660" y="30" width="220" height="160" rx="12" fill="#1e293b" stroke="#10b981" strokeWidth="2"/>
            <text x="770" y="60" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold">Planfix API</text>
            <text x="770" y="82" textAnchor="middle" fill="#94a3b8" fontSize="11">Cloud / On-Premise</text>
            <rect x="680" y="100" width="180" height="30" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="770" y="120" textAnchor="middle" fill="#e2e8f0" fontSize="11">Контакты / Контрагенты</text>
            <rect x="680" y="140" width="180" height="30" rx="6" fill="#0f172a" stroke="#334155"/>
            <text x="770" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="11">Задачи / Сделки</text>

            {/* Arrows */}
            <defs>
              <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
              </marker>
              <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981"/>
              </marker>
              <marker id="arrowPurple" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6"/>
              </marker>
            </defs>
            
            {/* MikoPBX → Middleware */}
            <line x1="240" y1="115" x2="320" y2="100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)"/>
            <text x="270" y="95" fill="#60a5fa" fontSize="9">Events</text>
            
            <line x1="240" y1="155" x2="320" y2="210" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)"/>
            <text x="265" y="195" fill="#60a5fa" fontSize="9">CDR</text>

            {/* Middleware → Planfix */}
            <line x1="580" y1="210" x2="660" y2="115" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)"/>
            <text x="610" y="155" fill="#34d399" fontSize="9">REST API</text>

            {/* Recording server */}
            <rect x="660" y="260" width="220" height="80" rx="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
            <text x="770" y="290" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">Web Server</text>
            <text x="770" y="310" textAnchor="middle" fill="#94a3b8" fontSize="11">Записи разговоров</text>
            <text x="770" y="326" textAnchor="middle" fill="#94a3b8" fontSize="10">Nginx / Apache</text>
            
            <line x1="580" y1="375" x2="660" y2="310" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowPurple)"/>
            <text x="600" y="355" fill="#fbbf24" fontSize="9">URL</text>
          </svg>
        </div>
      </div>

      {/* Key Components */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <span>📡</span> MikoPBX (Asterisk)
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>AMI</strong> — Asterisk Manager Interface для получения событий в реальном времени (Newchannel, Dial, Hangup)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>CDR</strong> — Call Detail Records для получения данных о завершённых звонках</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>Записи</strong> — хранятся в /var/lib/asterisk/records/ доступны по HTTP</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <span>⚡</span> Middleware Server
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong>AMI Listener</strong> — подключается к Asterisk и слушает события</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong>Event Router</strong> — определяет тип события и маршрут обработки</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong>Mapper</strong> — сопоставляет внутренний номер с сотрудником Planfix</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span>📊</span> Planfix API
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong>Контакты</strong> — поиск/создание контакта по телефону</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong>Задачи</strong> — создание задачи с привязкой к звонку</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong>Коммуникации</strong> — добавление записи о звонке в историю</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <span>🔑</span> Ключевые принципы
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              <span><strong>Async</strong> — обработка событий асинхронно через очередь</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              <span><strong>Retry</strong> — повторные попытки при ошибках API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              <span><strong>Logging</strong> — полное логирование всех событий и запросов</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Рекомендуемый стек</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Node.js', desc: 'Runtime', colorClass: 'text-green-400' },
            { name: 'asterisk-ami-client', desc: 'AMI connector', colorClass: 'text-blue-400' },
            { name: 'Bull/BullMQ', desc: 'Queue (Redis)', colorClass: 'text-red-400' },
            { name: 'Axios', desc: 'HTTP client', colorClass: 'text-purple-400' },
            { name: 'PostgreSQL', desc: 'Mapping DB', colorClass: 'text-cyan-400' },
            { name: 'Winston', desc: 'Logging', colorClass: 'text-yellow-400' },
            { name: 'Docker', desc: 'Deployment', colorClass: 'text-blue-400' },
            { name: 'PM2', desc: 'Process manager', colorClass: 'text-green-400' },
          ].map((tech) => (
            <div key={tech.name} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className={`text-sm font-medium ${tech.colorClass}`}>{tech.name}</div>
              <div className="text-xs text-gray-500">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
