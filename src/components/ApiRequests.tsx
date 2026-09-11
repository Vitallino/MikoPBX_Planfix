import { useState } from 'react';

interface ApiExample {
  title: string;
  method: string;
  url: string;
  description: string;
  request?: string;
  response: string;
  color: string;
}

const apiExamples: ApiExample[] = [
  {
    title: 'Поиск контакта по телефону',
    method: 'GET',
    url: '/contact/search',
    description: 'Поиск существующего контакта в Planfix по номеру телефона',
    request: `GET https://yourcompany.planfix.ru/api/contact/search?phone=+79991234567

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json`,
    response: `{
  "contacts": [
    {
      "id": 12345,
      "name": "ООО Ромашка",
      "phones": ["+79991234567"],
      "email": "info@romashka.ru",
      "generalDirector": {
        "id": 678,
        "name": "Петров П.П."
      }
    }
  ],
  "totalCount": 1
}`,
    color: 'blue'
  },
  {
    title: 'Создание нового контакта',
    method: 'POST',
    url: '/contact/create',
    description: 'Создание нового контакта, если номер не найден',
    request: `POST https://yourcompany.planfix.ru/api/contact

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "general": {
    "type": "contact",
    "name": "Клиент +7(999)123-45-67"
  },
  "phones": [
    {
      "number": "+79991234567",
      "type": "mobile"
    }
  ],
  "tags": ["Новый клиент", "Телефония"]
}`,
    response: `{
  "contact": {
    "id": 54321,
    "name": "Клиент +7(999)123-45-67",
    "generalDir": 54321
  }
}`,
    color: 'green'
  },
  {
    title: 'Создание задачи (звонок)',
    method: 'POST',
    url: '/task/create',
    description: 'Создание задачи для фиксации звонка',
    request: `POST https://yourcompany.planfix.ru/api/task

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "task": {
    "name": "Входящий звонок от +7(999)123-45-67",
    "description": "Входящий звонок\\nНомер: +79991234567\\nВремя: 2024-01-15 14:32:00\\nЛиния: Main DID",
    "contact": 12345,
    "responsible": {
      "id": 678
    },
    "template": 42,
    "priority": 2,
    "tags": ["Входящий звонок", "Телефония"]
  }
}`,
    response: `{
  "task": {
    "id": 98765,
    "name": "Входящий звонок от +7(999)123-45-67",
    "status": "open",
    "contact": 12345,
    "responsible": 678
  }
}`,
    color: 'purple'
  },
  {
    title: 'Добавление коммуникации',
    method: 'POST',
    url: '/communication/add',
    description: 'Добавление записи о звонке в историю коммуникаций контакта',
    request: `POST https://yourcompany.planfix.ru/api/communication

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "communication": {
    "type": "phonecall",
    "contact": 12345,
    "direction": "inbound",
    "number": "+79991234567",
    "date": "2024-01-15T14:32:00+03:00",
    "duration": 154,
    "status": "answered",
    "employee": 678,
    "comment": "Входящий звонок, отвечен сотрудником Иванов И.И.",
    "task": 98765
  }
}`,
    response: `{
  "communication": {
    "id": 11111,
    "type": "phonecall",
    "status": "ok"
  }
}`,
    color: 'cyan'
  },
  {
    title: 'Обновление задачи (завершение звонка)',
    method: 'PUT',
    url: '/task/update',
    description: 'Обновление задачи после завершения звонка — длительность и статус',
    request: `PUT https://yourcompany.planfix.ru/api/task/98765

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "task": {
    "id": 98765,
    "description": "Входящий звонок\\nНомер: +79991234567\\nВремя: 2024-01-15 14:32:00\\nДлительность: 2:34\\nСтатус: Отвечен\\nЗапись: https://pbx.company.ru/records/...",
    "customFields": [
      {
        "id": 100,
        "value": "154"
      },
      {
        "id": 101,
        "value": "answered"
      },
      {
        "id": 102,
        "value": "https://pbx.company.ru/records/2024/01/15/record-1705312345.mp3"
      }
    ]
  }
}`,
    response: `{
  "task": {
    "id": 98765,
    "status": "ok",
    "updated": "2024-01-15T14:34:34+03:00"
  }
}`,
    color: 'orange'
  },
  {
    title: 'Получение сотрудников Planfix',
    method: 'GET',
    url: '/user/list',
    description: 'Получение списка сотрудников для маппинга внутренних номеров',
    request: `GET https://yourcompany.planfix.ru/api/user/list

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json`,
    response: `{
  "users": [
    {
      "id": 678,
      "name": "Иванов Иван Иванович",
      "phone": "+79991112233",
      "position": "Менеджер",
      "department": "Отдел продаж"
    },
    {
      "id": 679,
      "name": "Петров Пётр Петрович",
      "phone": "+79994445566",
      "position": "Ст. менеджер",
      "department": "Отдел продаж"
    }
  ]
}`,
    color: 'pink'
  }
];

export default function ApiRequests() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">API запросы к Planfix</h2>
        <p className="text-gray-400">Полные примеры HTTP-запросов для каждого этапа интеграции</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {apiExamples.map((example, idx) => {
          const colorMap: Record<string, { active: string; dot: string }> = {
            blue: { active: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', dot: 'bg-blue-500' },
            green: { active: 'bg-green-600/20 text-green-400 border border-green-500/30', dot: 'bg-green-500' },
            purple: { active: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', dot: 'bg-purple-500' },
            cyan: { active: 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30', dot: 'bg-cyan-500' },
            orange: { active: 'bg-orange-600/20 text-orange-400 border border-orange-500/30', dot: 'bg-orange-500' },
            pink: { active: 'bg-pink-600/20 text-pink-400 border border-pink-500/30', dot: 'bg-pink-500' },
          };
          const colors = colorMap[example.color] || colorMap.blue;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === idx ? colors.active : 'text-gray-400 hover:text-gray-200 bg-gray-800/50'
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full ${colors.dot} mr-1.5`}></span>
              {example.title}
            </button>
          );
        })}
      </div>

      {/* Active Example */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              apiExamples[activeTab].method === 'GET' ? 'bg-green-900/50 text-green-400' :
              apiExamples[activeTab].method === 'POST' ? 'bg-blue-900/50 text-blue-400' :
              'bg-orange-900/50 text-orange-400'
            }`}>
              {apiExamples[activeTab].method}
            </span>
            <span className="font-mono text-sm text-gray-300">{apiExamples[activeTab].url}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">{apiExamples[activeTab].description}</p>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
          {/* Request */}
          <div className="p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Запрос</h4>
            <pre className="bg-gray-950 rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {apiExamples[activeTab].request || '(нет тела запроса)'}
            </pre>
          </div>
          {/* Response */}
          <div className="p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Ответ</h4>
            <pre className="bg-gray-950 rounded-lg p-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
              {apiExamples[activeTab].response}
            </pre>
          </div>
        </div>
      </div>

      {/* Planfix API Auth */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Аутентификация в Planfix API</h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-amber-400 mb-2">OAuth 2.0 (рекомендуется)</h4>
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{`# 1. Получить токен
POST https://yourcompany.planfix.ru/oauth2/token
{
  "grant_type": "client_credentials",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}

# 2. Использовать токен
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...`}</pre>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">API ключ (альтернатива)</h4>
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{`# Использовать API-ключ из настроек Planfix
X-Api-Key: your_api_key_here

# Или через Basic Auth
Authorization: Basic base64(login:md5(password))`}</pre>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Лимиты и ограничения</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">10</div>
            <div className="text-xs text-gray-400 mt-1">запросов/сек</div>
            <div className="text-xs text-gray-500">базовый лимит</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">1000</div>
            <div className="text-xs text-gray-400 mt-1">запросов/мин</div>
            <div className="text-xs text-gray-500">для Enterprise</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">50</div>
            <div className="text-xs text-gray-400 mt-1">записей/запрос</div>
            <div className="text-xs text-gray-500">макс. в ответе</div>
          </div>
        </div>
      </div>
    </div>
  );
}
