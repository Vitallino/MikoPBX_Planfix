export default function EventFlow() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Поток событий</h2>
        <p className="text-gray-400">Последовательность обработки входящего звонка от MikoPBX до Planfix</p>
      </div>

      {/* Event Flow Timeline */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Входящий звонок — полная последовательность</h3>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="relative pl-16">
              <div className="absolute left-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-blue-400">1</div>
              <div className="bg-blue-950/50 border border-blue-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 font-semibold">Newchannel Event</span>
                  <span className="text-xs text-gray-500">AMI → Middleware</span>
                </div>
                <p className="text-sm text-gray-300">Asterisk создаёт новый канал при входящем звонке. Middleware получает событие с CallerID (номер звонящего) и DID (входящий номер).</p>
                <div className="mt-2 bg-gray-900 rounded p-2 text-xs font-mono text-gray-400">
                  Event: Newchannel<br/>
                  Channel: SIP/trunk-00000001<br/>
                  CallerIDNum: +79991234567<br/>
                  Context: from-external
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative pl-16">
              <div className="absolute left-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-blue-400">2</div>
              <div className="bg-blue-950/50 border border-blue-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 font-semibold">Поиск контакта в Planfix</span>
                  <span className="text-xs text-gray-500">Middleware → Planfix API</span>
                </div>
                <p className="text-sm text-gray-300">По номеру телефона ищем существующий контакт. Если найден — открываем карточку. Если нет — создаём новый.</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-xs">GET /contact/search</span>
                  <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded text-xs">POST /contact/create</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-16">
              <div className="absolute left-3 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-purple-400">3</div>
              <div className="bg-purple-950/50 border border-purple-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-semibold">Dial Event (ответ сотрудника)</span>
                  <span className="text-xs text-gray-500">AMI → Middleware</span>
                </div>
                <p className="text-sm text-gray-300">Когда сотрудник берёт трубку, определяется его внутренний номер. По маппингу находим ответственного в Planfix.</p>
                <div className="mt-2 bg-gray-900 rounded p-2 text-xs font-mono text-gray-400">
                  Event: Dial<br/>
                  Destination: SIP/201-00000002<br/>
                  ConnectedLineNum: "Иванов И.И."
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pl-16">
              <div className="absolute left-3 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-purple-400">4</div>
              <div className="bg-purple-950/50 border border-purple-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-semibold">Создание задачи / коммуникации</span>
                  <span className="text-xs text-gray-500">Middleware → Planfix API</span>
                </div>
                <p className="text-sm text-gray-300">Создаём задачу типа «Входящий звонок» с привязкой к контакту и назначением ответственного сотрудника.</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded text-xs">POST /task/create</span>
                  <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded text-xs">POST /communication/add</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative pl-16">
              <div className="absolute left-3 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-orange-400">5</div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-400 font-semibold">Hangup Event (завершение)</span>
                  <span className="text-xs text-gray-500">AMI → Middleware</span>
                </div>
                <p className="text-sm text-gray-300">Звонок завершён. Получаем длительность, статус (отвечено/пропущен), причину разъединения.</p>
                <div className="mt-2 bg-gray-900 rounded p-2 text-xs font-mono text-gray-400">
                  Event: Hangup<br/>
                  Channel: SIP/trunk-00000001<br/>
                  Duration: 145<br/>
                  Disposition: ANSWERED<br/>
                  Amaflags: DOCUMENTATION
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="relative pl-16">
              <div className="absolute left-3 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-green-400">6</div>
              <div className="bg-green-950/50 border border-green-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 font-semibold">Обновление задачи + запись</span>
                  <span className="text-xs text-gray-500">Middleware → Planfix API</span>
                </div>
                <p className="text-sm text-gray-300">Обновляем задачу: длительность, статус. Если есть запись — добавляем ссылку на аудиофайл.</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-xs">PUT /task/update</span>
                  <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded text-xs">POST /communication/add</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AMI Events Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Отслеживаемые AMI-события</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400">Событие</th>
                <th className="text-left py-2 px-3 text-gray-400">Когда</th>
                <th className="text-left py-2 px-3 text-gray-400">Действие</th>
                <th className="text-left py-2 px-3 text-gray-400">Приоритет</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">Newchannel</td>
                <td className="py-2 px-3 text-gray-300">Создание канала</td>
                <td className="py-2 px-3 text-gray-300">Идентификация звонка, поиск контакта</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded text-xs">Высокий</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">Newstate</td>
                <td className="py-2 px-3 text-gray-300">Изменение состояния</td>
                <td className="py-2 px-3 text-gray-300">Обновление статуса (Ring → Up)</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded text-xs">Средний</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">Dial</td>
                <td className="py-2 px-3 text-gray-300">Направление вызова</td>
                <td className="py-2 px-3 text-gray-300">Определение ответственного</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded text-xs">Высокий</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">Answer</td>
                <td className="py-2 px-3 text-gray-300">Ответ на звонок</td>
                <td className="py-2 px-3 text-gray-300">Статус «Отвечено», начало таймера</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded text-xs">Средний</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3 font-mono text-blue-400">Hangup</td>
                <td className="py-2 px-3 text-gray-300">Завершение звонка</td>
                <td className="py-2 px-3 text-gray-300">Длительность, статус, обновление задачи</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded text-xs">Высокий</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-blue-400">Cdr</td>
                <td className="py-2 px-3 text-gray-300">CDR записан</td>
                <td className="py-2 px-3 text-gray-300">Финальные данные, ссылка на запись</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded text-xs">Высокий</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* State Machine */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Машина состояний звонка</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <div className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300">INIT</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-300">RINGING</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-purple-900/50 border border-purple-700 rounded-lg text-purple-300">CONNECTED</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-green-900/50 border border-green-700 rounded-lg text-green-300">COMPLETED</div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <div className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300">INIT</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-300">RINGING</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-red-900/50 border border-red-700 rounded-lg text-red-300">MISSED</div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <div className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300">INIT</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-300">RINGING</div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-2 bg-orange-900/50 border border-orange-700 rounded-lg text-orange-300">VOICEMAIL</div>
        </div>
      </div>
    </div>
  );
}
