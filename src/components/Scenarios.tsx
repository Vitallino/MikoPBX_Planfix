export default function Scenarios() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Сценарии событий</h2>
        <p className="text-gray-400">Детальное описание всех сценариев обработки звонков</p>
      </div>

      {/* Scenario 1: Incoming answered */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm">✅</span>
          <h3 className="text-lg font-semibold text-green-400">Сценарий 1: Входящий звонок — отвечен</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Условия:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Входящий звонок с внешнего номера</li>
              <li>• Сотрудник ответил на звонок</li>
              <li>• Контакт найден в Planfix</li>
              <li>• Запись разговора доступна</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Действия:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Создать задачу «Входящий звонок»</li>
              <li>Привязать к контакту клиента</li>
              <li>Назначить ответственного (по внутр. номеру)</li>
              <li>Добавить коммуникацию в историю</li>
              <li>После завершения — обновить длительность</li>
              <li>Прикрепить ссылку на запись</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Результат в Planfix:</div>
          <div className="text-sm text-green-300">
            Задача #12345 создана → Контакт «ООО Ромашка» → Ответственный: Иванов И.И. → Длительность: 2:34 → Запись: https://pbx.company.ru/records/...
          </div>
        </div>
      </div>

      {/* Scenario 2: Missed call */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-sm">❌</span>
          <h3 className="text-lg font-semibold text-red-400">Сценарий 2: Пропущенный звонок</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Условия:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Входящий звонок с внешнего номера</li>
              <li>• Никто не ответил (таймаут / все заняты)</li>
              <li>• Disposition: NO ANSWER</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Действия:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Найти/создать контакт по номеру</li>
              <li>Создать задачу «Пропущенный звонок»</li>
              <li>Назначить на группу/очередь</li>
              <li>Добавить коммуникацию (пропущен)</li>
              <li>Установить высокий приоритет</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Результат в Planfix:</div>
          <div className="text-sm text-red-300">
            Задача #12346 создана → Приоритет: Высокий → Статус: Пропущен → Группа: Отдел продаж → Комментарий: «Клиент звонил 3 раза»
          </div>
        </div>
      </div>

      {/* Scenario 3: New contact */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-sm">🆕</span>
          <h3 className="text-lg font-semibold text-yellow-400">Сценарий 3: Новый контакт (неизвестный номер)</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Условия:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Номер не найден в Planfix</li>
              <li>• CallerID содержит номер</li>
              <li>• Нет привязки к существующему контакту</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Действия:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Создать новый контакт в Planfix</li>
              <li>Имя: «Клиент +7(999)123-45-67»</li>
              <li>Тип: «Контакт» (не компания)</li>
              <li>Создать задачу с привязкой</li>
              <li>Добавить тег «Новый клиент»</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Результат в Planfix:</div>
          <div className="text-sm text-yellow-300">
            Контакт #5678 создан → Имя: «Клиент +7(999)123-45-67» → Тег: Новый клиент → Задача привязана
          </div>
        </div>
      </div>

      {/* Scenario 4: Outgoing call */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">📤</span>
          <h3 className="text-lg font-semibold text-blue-400">Сценарий 4: Исходящий звонок</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Условия:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Сотрудник инициирует исходящий звонок</li>
              <li>• Context: from-internal</li>
              <li>• Определяется инициатор (внутр. номер)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Действия:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Найти контакт по набираемому номеру</li>
              <li>Создать задачу «Исходящий звонок»</li>
              <li>Автор = сотрудник (по внутр. номеру)</li>
              <li>После завершения — длительность и запись</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Scenario 5: Transfer */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm">🔀</span>
          <h3 className="text-lg font-semibold text-purple-400">Сценарий 5: Перевод звонка</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Условия:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Звонок переводится между сотрудниками</li>
              <li>• Событие AttendedTransfer / BlindTransfer</li>
              <li>• Новый сотрудник принимает вызов</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Действия:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Зафиксировать факт перевода</li>
              <li>Обновить ответственного в задаче</li>
              <li>Добавить комментарий о переводе</li>
              <li>Сохранить цепочку: кто → кому</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Scenario 6: Recording */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-sm">🎙️</span>
          <h3 className="text-lg font-semibold text-amber-400">Сценарий 6: Запись разговора</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Условия:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Запись включена в MikoPBX</li>
              <li>• Файл сохранён на сервере</li>
              <li>• Доступен по HTTP(S) URL</li>
              <li>• Формат: .mp3 или .wav</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Действия:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Получить путь к файлу из CDR</li>
              <li>Сформировать публичный URL</li>
              <li>Добавить как вложение к задаче</li>
              <li>Или: загрузить файл в Planfix</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Формат URL записи:</div>
          <div className="text-sm text-amber-300 font-mono">
            https://pbx.company.ru/records/2024/01/15/record-1705312345.1234.mp3
          </div>
        </div>
      </div>
    </div>
  );
}
