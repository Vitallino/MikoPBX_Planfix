export default function MikoConfig() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Настройка MikoPBX</h2>
        <p className="text-gray-400">Конфигурация MikoPBX для интеграции: AMI, записи, webhook</p>
      </div>

      {/* AMI Config */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <span>📡</span> Настройка AMI (Asterisk Manager Interface)
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Через веб-интерфейс MikoPBX:</h4>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Откройте <code className="text-blue-400">https://mikopbx-ip/admin</code></li>
              <li>Перейдите в <strong>Расширенные настройки → AMI</strong></li>
              <li>Включите AMI: <code className="text-green-400">Enabled = Yes</code></li>
              <li>Установите порт: <code className="text-green-400">5038</code> (по умолчанию)</li>
              <li>Создайте пользователя AMI:</li>
            </ol>
          </div>
          <div className="bg-gray-950 rounded-lg p-4">
            <h4 className="text-xs text-gray-500 mb-2">/etc/asterisk/manager_custom.conf</h4>
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`[planfix_integration]
secret = YourStrongPassword123
permit = 127.0.0.1/255.255.255.0
permit = 192.168.1.0/255.255.255.0
read = system,call,log,verbose,command,agent,user,config
write = system,call,log,verbose,command,agent,user,config`}</pre>
          </div>
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3">
            <p className="text-sm text-amber-300">
              ⚠️ <strong>Важно:</strong> Разрешайте подключение к AMI только с IP middleware-сервера. Не открывайте порт 5038 наружу.
            </p>
          </div>
        </div>
      </div>

      {/* Recording Config */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <span>🎙️</span> Настройка записи разговоров
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Включение записи:</h4>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Веб-интерфейс → <strong>Общие настройки → Запись разговоров</strong></li>
              <li>Включить: <code className="text-green-400">Записывать все разговоры = Да</code></li>
              <li>Формат: <code className="text-green-400">mp3</code> (рекомендуется) или wav</li>
              <li>Хранение: настроить автоудаление через N дней</li>
            </ol>
          </div>
          <div className="bg-gray-950 rounded-lg p-4">
            <h4 className="text-xs text-gray-500 mb-2">Доступ к записям по HTTP (Nginx):</h4>
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`# /etc/nginx/conf.d/records.conf
server {
    listen 8080;
    server_name pbx.company.ru;
    
    # Записи разговоров
    location /records/ {
        alias /var/lib/asterisk/monitor/;
        autoindex off;
        
        # Авторизация (опционально)
        auth_basic "Recordings";
        auth_basic_user_file /etc/nginx/.htpasswd;
        
        # CORS для Planfix
        add_header Access-Control-Allow-Origin *;
    }
    
    # Только для внутреннего использования
    allow 192.168.1.0/24;
    deny all;
}`}</pre>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Путь к записям в CDR:</h4>
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`# MikoPBX сохраняет записи по шаблону:
/var/lib/asterisk/monitor/{YEAR}/{MONTH}/{DAY}/{uniqueid}.mp3

# Пример:
/var/lib/asterisk/monitor/2024/01/15/1705312345.1234.mp3

# URL для Planfix:
https://pbx.company.ru:8080/records/2024/01/15/1705312345.1234.mp3`}</pre>
          </div>
        </div>
      </div>

      {/* CDR Config */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <span>📋</span> Настройка CDR (Call Detail Records)
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-950 rounded-lg p-4">
            <h4 className="text-xs text-gray-500 mb-2">cdr_custom.conf — дополнительные поля:</h4>
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`[general]
enable = yes

# Формат CDR события для AMI
[conftool]
enable = yes

# Передавать в CDR уникальные переменные канала
setvar = PLANFIX_SYNC=yes`}</pre>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Поля CDR, используемые в интеграции:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-400">Поле</th>
                    <th className="text-left py-2 px-3 text-gray-400">Описание</th>
                    <th className="text-left py-2 px-3 text-gray-400">Пример</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-blue-400">uniqueid</td>
                    <td className="py-2 px-3 text-gray-300">Уникальный ID звонка</td>
                    <td className="py-2 px-3 text-gray-400">1705312345.1234</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-blue-400">src</td>
                    <td className="py-2 px-3 text-gray-300">Номер источника</td>
                    <td className="py-2 px-3 text-gray-400">+79991234567</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-blue-400">dst</td>
                    <td className="py-2 px-3 text-gray-300">Набираемый номер</td>
                    <td className="py-2 px-3 text-gray-400">200</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-blue-400">disposition</td>
                    <td className="py-2 px-3 text-gray-300">Статус звонка</td>
                    <td className="py-2 px-3 text-gray-400">ANSWERED</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-blue-400">duration</td>
                    <td className="py-2 px-3 text-gray-300">Общая длительность (сек)</td>
                    <td className="py-2 px-3 text-gray-400">154</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-blue-400">billsec</td>
                    <td className="py-2 px-3 text-gray-300">Длительность разговора</td>
                    <td className="py-2 px-3 text-gray-400">145</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-blue-400">accountcode</td>
                    <td className="py-2 px-3 text-gray-300">Код аккаунта/группы</td>
                    <td className="py-2 px-3 text-gray-400">sales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Dialplan hooks */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <span>🔧</span> Dialplan hooks (опционально)
        </h3>
        <p className="text-sm text-gray-400 mb-4">Для расширенной интеграции можно использовать custom dialplan в MikoPBX:</p>
        <div className="bg-gray-950 rounded-lg p-4">
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{`# /etc/asterisk/extensions_custom.conf
# Хук перед маршрутизацией входящего звонка

[from-external-custom]
exten => _X.,1,NoOp(Incoming call from \${CALLERID(num)})
 same => n,Set(CHANNEL_VARIABLES=PLANFIX_SYNC=yes)
 same => n,Set(CDR(accountcode)=\${EXTEN})
 same => n,Return()

# Хук после завершения звонка
[h-h-custom]
exten => h,1,NoOp(Call ended: \${CDR(duration)} sec)
 same => n,Return()`}</pre>
        </div>
      </div>

      {/* Network requirements */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Сетевые требования</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Открыть (Middleware → MikoPBX)</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• TCP 5038 — AMI порт</li>
              <li>• TCP 8080 — Записи (опционально)</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Открыть (Middleware → Internet)</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• TCP 443 — Planfix API (HTTPS)</li>
              <li>• TCP 6379 — Redis (если внешний)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
