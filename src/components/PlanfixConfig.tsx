export default function PlanfixConfig() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Настройка Planfix</h2>
        <p className="text-gray-400">Конфигурация Planfix для приёма данных из телефонии</p>
      </div>

      {/* API Access */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <span>🔑</span> Получение доступа к API
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Шаги:</h4>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Войдите в Planfix с правами администратора</li>
              <li>Перейдите: <strong>Ещё → Настройки → Интеграции → API</strong></li>
              <li>Создайте новое приложение / получите API ключ</li>
              <li>Сохраните: <code className="text-green-400">API URL</code>, <code className="text-green-400">Client ID</code>, <code className="text-green-400">Client Secret</code></li>
              <li>Настройте OAuth scopes: <code className="text-blue-400">contact, task, communication</code></li>
            </ol>
          </div>
          <div className="bg-gray-950 rounded-lg p-4">
            <h4 className="text-xs text-gray-500 mb-2">.env файл middleware:</h4>
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`# Planfix API Configuration
PLANFIX_API_URL=https://yourcompany.planfix.ru/api
PLANFIX_OAUTH_TOKEN_URL=https://yourcompany.planfix.ru/oauth2/token
PLANFIX_CLIENT_ID=your_client_id_here
PLANFIX_CLIENT_SECRET=your_client_secret_here

# Или API Key (альтернатива)
PLANFIX_API_KEY=your_api_key_here
PLANFIX_LOGIN=api_user@company.ru
PLANFIX_PASSWORD_HASH=md5_hash_of_password`}</pre>
          </div>
        </div>
      </div>

      {/* Custom Fields */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <span>📝</span> Создание пользовательских полей
        </h3>
        <p className="text-sm text-gray-400 mb-4">Для хранения данных о звонках создайте кастомные поля в шаблоне задачи:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400">Поле</th>
                <th className="text-left py-2 px-3 text-gray-400">Тип</th>
                <th className="text-left py-2 px-3 text-gray-400">ID</th>
                <th className="text-left py-2 px-3 text-gray-400">Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-blue-400 font-medium">Телефон звонящего</td>
                <td className="py-2 px-3 text-gray-300">Телефон</td>
                <td className="py-2 px-3 font-mono text-gray-400">100</td>
                <td className="py-2 px-3 text-gray-400">Номер, с которого звонили</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-blue-400 font-medium">Длительность</td>
                <td className="py-2 px-3 text-gray-300">Число</td>
                <td className="py-2 px-3 font-mono text-gray-400">101</td>
                <td className="py-2 px-3 text-gray-400">Длительность в секундах</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-blue-400 font-medium">Статус звонка</td>
                <td className="py-2 px-3 text-gray-300">Список</td>
                <td className="py-2 px-3 font-mono text-gray-400">102</td>
                <td className="py-2 px-3 text-gray-400">Отвечен / Пропущен / Голосовая</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-blue-400 font-medium">Направление</td>
                <td className="py-2 px-3 text-gray-300">Список</td>
                <td className="py-2 px-3 font-mono text-gray-400">103</td>
                <td className="py-2 px-3 text-gray-400">Входящий / Исходящий</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 text-blue-400 font-medium">Запись разговора</td>
                <td className="py-2 px-3 text-gray-300">Ссылка</td>
                <td className="py-2 px-3 font-mono text-gray-400">104</td>
                <td className="py-2 px-3 text-gray-400">URL аудиофайла записи</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-blue-400 font-medium">UniqueID</td>
                <td className="py-2 px-3 text-gray-300">Текст</td>
                <td className="py-2 px-3 font-mono text-gray-400">105</td>
                <td className="py-2 px-3 text-gray-400">Уникальный ID Asterisk</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Template */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <span>📋</span> Шаблон задачи «Телефонный звонок»
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Создание шаблона:</h4>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Перейдите: <strong>Ещё → Настройки → Шаблоны задач</strong></li>
              <li>Создайте шаблон: <code className="text-purple-400">«Телефонный звонок»</code></li>
              <li>Добавьте кастомные поля (см. таблицу выше)</li>
              <li>Настройте автостатусы: Открыта → В работе → Завершена</li>
              <li>Запишите ID шаблона: <code className="text-green-400">templateId = 42</code></li>
            </ol>
          </div>
          <div className="bg-gray-950 rounded-lg p-4">
            <h4 className="text-xs text-gray-500 mb-2">Конфигурация шаблона:</h4>
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`{
  "templateId": 42,
  "templateName": "Телефонный звонок",
  "defaultStatus": "open",
  "defaultPriority": 2,
  "autoAssignGroup": "Отдел продаж",
  "tags": ["Телефония", "Звонок"],
  "customFields": {
    "callerPhone": { "fieldId": 100, "type": "phone" },
    "duration": { "fieldId": 101, "type": "number" },
    "callStatus": { "fieldId": 102, "type": "enum" },
    "direction": { "fieldId": 103, "type": "enum" },
    "recordingUrl": { "fieldId": 104, "type": "url" },
    "uniqueId": { "fieldId": 105, "type": "text" }
  }
}`}</pre>
          </div>
        </div>
      </div>

      {/* Employee Mapping */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>👥</span> Маппинг сотрудников
        </h3>
        <p className="text-sm text-gray-400 mb-4">Сопоставление внутренних номеров MikoPBX с пользователями Planfix:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400">Внутр. номер</th>
                <th className="text-left py-2 px-3 text-gray-400">Сотрудник</th>
                <th className="text-left py-2 px-3 text-gray-400">Planfix ID</th>
                <th className="text-left py-2 px-3 text-gray-400">Группа</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">201</td>
                <td className="py-2 px-3 text-gray-300">Иванов Иван</td>
                <td className="py-2 px-3 font-mono text-gray-400">678</td>
                <td className="py-2 px-3 text-gray-400">Отдел продаж</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">202</td>
                <td className="py-2 px-3 text-gray-300">Петров Пётр</td>
                <td className="py-2 px-3 font-mono text-gray-400">679</td>
                <td className="py-2 px-3 text-gray-400">Отдел продаж</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">203</td>
                <td className="py-2 px-3 text-gray-300">Сидорова Анна</td>
                <td className="py-2 px-3 font-mono text-gray-400">680</td>
                <td className="py-2 px-3 text-gray-400">Поддержка</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-blue-400">204</td>
                <td className="py-2 px-3 text-gray-300">Козлов Дмитрий</td>
                <td className="py-2 px-3 font-mono text-gray-400">681</td>
                <td className="py-2 px-3 text-gray-400">Руководство</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-gray-950 rounded-lg p-4">
          <h4 className="text-xs text-gray-500 mb-2">mapping.json (или в БД):</h4>
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`{
  "extensions": {
    "201": { "planfixUserId": 678, "name": "Иванов И.И.", "group": "sales" },
    "202": { "planfixUserId": 679, "name": "Петров П.П.", "group": "sales" },
    "203": { "planfixUserId": 680, "name": "Сидорова А.В.", "group": "support" },
    "204": { "planfixUserId": 681, "name": "Козлов Д.А.", "group": "management" }
  },
  "groups": {
    "sales": { "planfixGroupId": 10, "fallback": 678 },
    "support": { "planfixGroupId": 11, "fallback": 680 },
    "management": { "planfixGroupId": 12, "fallback": 681 }
  }
}`}</pre>
        </div>
      </div>

      {/* Webhook (alternative) */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <span>🔗</span> Альтернатива: Встроенная интеграция Planfix
        </h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Planfix имеет встроенную интеграцию с некоторыми АТС. Если MikoPBX поддерживается — можно использовать её. 
            Однако для полной кастомизации рекомендуется middleware.
          </p>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Настройка встроенной интеграции:</h4>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Planfix → <strong>Ещё → Настройки → Интеграции → Телефония</strong></li>
              <li>Выберите тип: <code className="text-cyan-400">Asterisk / MikoPBX</code></li>
              <li>Укажите параметры подключения</li>
              <li>Настройте правила маршрутизации</li>
            </ol>
          </div>
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-3">
            <p className="text-sm text-blue-300">
              💡 <strong>Совет:</strong> Встроенная интеграция подходит для базовых сценариев. Middleware даёт полный контроль над логикой, форматированием и обработкой ошибок.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
