import { useState } from 'react';

const codeFiles = [
  {
    name: 'ami-client.ts',
    language: 'typescript',
    description: 'Подключение к AMI и обработка событий',
    code: `import { AmiClient, AmiConnection } from 'asterisk-ami-client';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export class MikoPBXAmiClient extends EventEmitter {
  private client: AmiClient;
  private connected = false;

  constructor(
    private host: string,
    private port: number,
    private username: string,
    private password: string
  ) {
    super();
    this.client = new AmiClient({
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      events: true,
    });
  }

  async connect(): Promise<void> {
    try {
      const connection = await this.client.connect();
      this.connected = true;
      logger.info('Connected to MikoPBX AMI');

      // Подписка на нужные события
      connection.on('event', (event: AmiEvent) => {
        this.handleEvent(event);
      });

      connection.on('disconnect', () => {
        this.connected = false;
        logger.warn('Disconnected from AMI, reconnecting...');
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      logger.error('AMI connection failed:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private handleEvent(event: any): void {
    const eventType = event.name || event.event;
    
    switch (eventType) {
      case 'Newchannel':
        this.emit('newchannel', this.parseNewchannel(event));
        break;
      case 'Dial':
        this.emit('dial', this.parseDial(event));
        break;
      case 'Answer':
        this.emit('answer', this.parseAnswer(event));
        break;
      case 'Hangup':
        this.emit('hangup', this.parseHangup(event));
        break;
      case 'Cdr':
        this.emit('cdr', this.parseCdr(event));
        break;
      case 'AttendedTransfer':
      case 'BlindTransfer':
        this.emit('transfer', this.parseTransfer(event));
        break;
    }
  }

  private parseNewchannel(event: any) {
    return {
      uniqueId: event.uniqueid,
      channel: event.channel,
      callerNum: event.calleridnum,
      callerName: event.calleridname,
      context: event.context,
      exten: event.exten,
      state: event.channelstate,
    };
  }

  private parseDial(event: any) {
    return {
      uniqueId: event.uniqueid,
      destination: event.destination,
      subEvent: event.subevent,
      connectedLineNum: event.connectedlinenum,
    };
  }

  private parseHangup(event: any) {
    return {
      uniqueId: event.uniqueid,
      channel: event.channel,
      cause: event.cause,
      causeText: event.cause_txt,
    };
  }

  private parseCdr(event: any) {
    return {
      uniqueId: event.uniqueid,
      source: event.source,
      destination: event.destination,
      disposition: event.disposition,
      duration: parseInt(event.duration),
      billsec: parseInt(event.billsec),
      accountCode: event.accountcode,
      startTime: event.start,
      answerTime: event.answer,
      endTime: event.end,
    };
  }

  private parseTransfer(event: any) {
    return {
      uniqueId: event.uniqueid,
      transferType: event.name,
      transferTo: event.transferexten,
      transferFrom: event.channel,
    };
  }
}`
  },
  {
    name: 'contact-resolver.ts',
    language: 'typescript',
    description: 'Поиск и создание контактов в Planfix',
    code: `import { PlanfixClient } from './planfix-client';
import { PhoneFormatter } from './phone-formatter';
import { logger } from '../utils/logger';

export class ContactResolver {
  constructor(
    private planfix: PlanfixClient,
    private phoneFormatter: PhoneFormatter
  ) {}

  /**
   * Найти или создать контакт по номеру телефона
   */
  async resolve(phoneNumber: string): Promise<{
    contactId: number;
    isNew: boolean;
    contactName: string;
  }> {
    // Нормализуем номер
    const normalizedPhone = this.phoneFormatter.normalize(phoneNumber);
    const formattedPhone = this.phoneFormatter.formatForDisplay(normalizedPhone);

    // Ищем контакт
    const existing = await this.searchContact(normalizedPhone);
    
    if (existing) {
      logger.info(\`Contact found: \${existing.id} - \${existing.name}\`);
      return {
        contactId: existing.id,
        isNew: false,
        contactName: existing.name,
      };
    }

    // Создаём новый контакт
    logger.info(\`Creating new contact for: \${normalizedPhone}\`);
    const newContact = await this.createContact(normalizedPhone, formattedPhone);
    
    return {
      contactId: newContact.id,
      isNew: true,
      contactName: newContact.name,
    };
  }

  private async searchContact(phone: string): Promise<any | null> {
    try {
      const response = await this.planfix.get('/contact/search', {
        params: { phone },
      });

      if (response.contacts && response.contacts.length > 0) {
        return response.contacts[0];
      }
      return null;
    } catch (error) {
      logger.error('Contact search failed:', error);
      return null;
    }
  }

  private async createContact(
    phone: string,
    displayName: string
  ): Promise<{ id: number; name: string }> {
    try {
      const response = await this.planfix.post('/contact', {
        general: {
          type: 'contact',
          name: \`Клиент \${displayName}\`,
        },
        phones: [
          {
            number: phone,
            type: 'mobile',
            isMain: true,
          },
        ],
        tags: ['Новый клиент', 'Телефония'],
      });

      return {
        id: response.contact.id,
        name: response.contact.name,
      };
    } catch (error) {
      logger.error('Contact creation failed:', error);
      throw error;
    }
  }
}`
  },
  {
    name: 'call-handler.ts',
    language: 'typescript',
    description: 'Главный обработчик звонков',
    code: `import { MikoPBXAmiClient } from '../ami/client';
import { ContactResolver } from '../services/contact-resolver';
import { EmployeeMapper } from '../services/employee-mapper';
import { TaskManager } from '../services/task-manager';
import { RecordingService } from '../services/recording-service';
import { CallSession } from '../db/models/CallSession';
import { queue } from '../queue/bull-queue';
import { logger } from '../utils/logger';

export class CallHandler {
  constructor(
    private ami: MikoPBXAmiClient,
    private contactResolver: ContactResolver,
    private employeeMapper: EmployeeMapper,
    private taskManager: TaskManager,
    private recordingService: RecordingService
  ) {
    this.bindEvents();
  }

  private bindEvents(): void {
    this.ami.on('newchannel', (data) => this.onNewChannel(data));
    this.ami.on('dial', (data) => this.onDial(data));
    this.ami.on('answer', (data) => this.onAnswer(data));
    this.ami.on('hangup', (data) => this.onHangup(data));
    this.ami.on('cdr', (data) => this.onCdr(data));
    this.ami.on('transfer', (data) => this.onTransfer(data));
  }

  /**
   * Входящий звонок создан
   */
  private async onNewChannel(data: any): Promise<void> {
    const isExternal = data.context === 'from-external';
    const direction = isExternal ? 'inbound' : 'outbound';
    
    logger.info(\`New \${direction} call: \${data.callerNum} → \${data.exten}\`);

    // Создаём сессию звонка
    const session = await CallSession.create({
      uniqueId: data.uniqueId,
      callerNumber: data.callerNum,
      calleeNumber: data.exten,
      direction,
      status: 'ringing',
      startTime: new Date(),
      channelName: data.channel,
      context: data.context,
    });

    if (isExternal) {
      // Для входящего — ищем контакт
      await queue.add('resolve-contact', {
        sessionId: session.id,
        phoneNumber: data.callerNum,
      });
    }
  }

  /**
   * Звонок направлен сотруднику
   */
  private async onDial(data: any): Promise<void> {
    const session = await CallSession.findByUniqueId(data.uniqueId);
    if (!session) return;

    // Извлекаем внутренний номер из destination
    const extension = this.extractExtension(data.destination);
    if (!extension) return;

    // Находим сотрудника в Planfix
    const employee = await this.employeeMapper.getByExtension(extension);
    
    if (employee) {
      session.agentExtension = extension;
      session.agentPlanfixId = employee.planfixUserId;
      await session.save();
      
      logger.info(\`Call routed to: \${employee.name} (ext \${extension})\`);
    }
  }

  /**
   * На звонок ответили
   */
  private async onAnswer(data: any): Promise<void> {
    const session = await CallSession.findByUniqueId(data.uniqueId);
    if (!session) return;

    session.status = 'connected';
    session.answerTime = new Date();
    await session.save();

    // Создаём задачу в Planfix
    await queue.add('create-task', {
      sessionId: session.id,
      type: session.direction === 'inbound' ? 'inbound_call' : 'outbound_call',
    });
  }

  /**
   * Звонок завершён
   */
  private async onHangup(data: any): Promise<void> {
    const session = await CallSession.findByUniqueId(data.uniqueId);
    if (!session) return;

    session.endTime = new Date();
    session.duration = Math.round(
      (session.endTime.getTime() - session.startTime.getTime()) / 1000
    );
    
    if (session.status === 'ringing') {
      session.status = 'missed';
    } else {
      session.status = 'completed';
    }
    
    await session.save();

    // Обновляем задачу в Planfix
    await queue.add('update-task', {
      sessionId: session.id,
      action: 'finalize',
    });
  }

  /**
   * CDR записан (финальные данные)
   */
  private async onCdr(data: any): Promise<void> {
    const session = await CallSession.findByUniqueId(data.uniqueId);
    if (!session) return;

    session.duration = data.billsec;
    session.disposition = data.disposition;
    await session.save();

    // Проверяем наличие записи
    const recordingUrl = await this.recordingService.getRecordingUrl(
      data.uniqueId,
      data.startTime
    );

    if (recordingUrl) {
      session.recordingUrl = recordingUrl;
      await session.save();

      // Добавляем запись к задаче
      await queue.add('attach-recording', {
        sessionId: session.id,
        recordingUrl,
      });
    }
  }

  private extractExtension(destination: string): string | null {
    // SIP/201-00000001 → 201
    const match = destination.match(/\\/(\\d+)-/);
    return match ? match[1] : null;
  }
}`
  },
  {
    name: 'planfix-client.ts',
    language: 'typescript',
    description: 'HTTP клиент для Planfix API с retry и rate limiting',
    code: `import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RateLimiter } from 'limiter';
import { logger } from '../utils/logger';

export class PlanfixClient {
  private http: AxiosInstance;
  private limiter: RateLimiter;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private baseUrl: string,
    private clientId: string,
    private clientSecret: string
  ) {
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Rate limiter: 8 запросов в секунду
    this.limiter = new RateLimiter({
      tokensPerInterval: 8,
      interval: 'second',
    });

    // Interceptor для авторизации
    this.http.interceptors.request.use(async (config) => {
      await this.ensureToken();
      config.headers.Authorization = \`Bearer \${this.token}\`;
      return config;
    });

    // Interceptor для retry
    this.http.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        if (error.response?.status === 429) {
          // Rate limited — ждём и повторяем
          const retryAfter = parseInt(error.response.headers['retry-after'] || '5');
          logger.warn(\`Rate limited, waiting \${retryAfter}s\`);
          await this.sleep(retryAfter * 1000);
          return this.http.request(config);
        }
        
        if (error.response?.status >= 500 && (!config.retryCount || config.retryCount < 3)) {
          config.retryCount = (config.retryCount || 0) + 1;
          const delay = Math.pow(2, config.retryCount) * 1000;
          logger.warn(\`Server error, retry #\${config.retryCount} in \${delay}ms\`);
          await this.sleep(delay);
          return this.http.request(config);
        }
        
        throw error;
      }
    );
  }

  private async ensureToken(): Promise<void> {
    if (this.token && Date.now() < this.tokenExpiry) return;
    
    const response = await axios.post(
      \`\${this.baseUrl}/../oauth2/token\`,
      {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    );

    this.token = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    logger.info('Planfix token refreshed');
  }

  async get(path: string, config?: AxiosRequestConfig): Promise<any> {
    await this.limiter.removeTokens(1);
    const response = await this.http.get(path, config);
    return response.data;
  }

  async post(path: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    await this.limiter.removeTokens(1);
    const response = await this.http.post(path, data, config);
    return response.data;
  }

  async put(path: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    await this.limiter.removeTokens(1);
    const response = await this.http.put(path, data, config);
    return response.data;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}`
  },
  {
    name: 'recording-service.ts',
    language: 'typescript',
    description: 'Получение URL записи разговора',
    code: `import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger';

export class RecordingService {
  private recordBasePath: string;
  private publicUrl: string;

  constructor(config: {
    recordBasePath: string;  // /var/lib/asterisk/monitor
    publicUrl: string;       // https://pbx.company.ru:8080/records
  }) {
    this.recordBasePath = config.recordBasePath;
    this.publicUrl = config.publicUrl;
  }

  /**
   * Получить URL записи разговора по UniqueID
   */
  async getRecordingUrl(
    uniqueId: string,
    startTime: string
  ): Promise<string | null> {
    // Парсим дату из startTime
    const date = new Date(startTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Пробуем разные форматы имён файлов
    const possibleNames = [
      \`\${uniqueId}.mp3\`,
      \`\${uniqueId}.wav\`,
      \`record-\${uniqueId}.mp3\`,
      \`record-\${uniqueId}.wav\`,
    ];

    const dirPath = path.join(this.recordBasePath, String(year), month, day);

    for (const fileName of possibleNames) {
      const filePath = path.join(dirPath, fileName);
      
      if (fs.existsSync(filePath)) {
        const url = \`\${this.publicUrl}/\${year}/\${month}/\${day}/\${fileName}\`;
        logger.info(\`Recording found: \${url}\`);
        return url;
      }
    }

    // Если файл ещё не готов (запись продолжается), ждём
    logger.info(\`Recording not yet available for \${uniqueId}, will retry\`);
    return null;
  }

  /**
   * Проверить и дождаться появления записи
   */
  async waitForRecording(
    uniqueId: string,
    startTime: string,
    maxWaitMs: number = 30000
  ): Promise<string | null> {
    const startTimeMs = Date.now();
    
    while (Date.now() - startTimeMs < maxWaitMs) {
      const url = await this.getRecordingUrl(uniqueId, startTime);
      if (url) return url;
      
      // Ждём 3 секунды перед повторной проверкой
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    logger.warn(\`Recording not found after \${maxWaitMs}ms for \${uniqueId}\`);
    return null;
  }
}`
  }
];

export default function CodeExamples() {
  const [activeFile, setActiveFile] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Примеры кода</h2>
        <p className="text-gray-400">Готовые модули для middleware-сервера интеграции</p>
      </div>

      {/* File tabs */}
      <div className="flex flex-wrap gap-2">
        {codeFiles.map((file, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFile(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFile === idx
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-200 bg-gray-800/50'
            }`}
          >
            📄 {file.name}
          </button>
        ))}
      </div>

      {/* Active file */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">{codeFiles[activeFile].name}</h3>
            <p className="text-xs text-gray-400 mt-1">{codeFiles[activeFile].description}</p>
          </div>
          <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded text-xs">
            {codeFiles[activeFile].language}
          </span>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="p-4 text-xs font-mono text-gray-300 whitespace-pre leading-relaxed">
            {codeFiles[activeFile].code}
          </pre>
        </div>
      </div>

      {/* Docker Compose */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Docker Compose для развёртывания</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre">{`version: '3.8'

services:
  middleware:
    build: .
    restart: always
    environment:
      - MIKOPBX_AMI_HOST=192.168.1.10
      - MIKOPBX_AMI_PORT=5038
      - MIKOPBX_AMI_USER=planfix_integration
      - MIKOPBX_AMI_PASS=YourStrongPassword123
      - PLANFIX_API_URL=https://yourcompany.planfix.ru/api
      - PLANFIX_CLIENT_ID=your_client_id
      - PLANFIX_CLIENT_SECRET=your_client_secret
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/mikopbx
      - RECORDING_BASE_PATH=/var/lib/asterisk/monitor
      - RECORDING_PUBLIC_URL=https://pbx.company.ru:8080/records
    depends_on:
      - redis
      - postgres
    volumes:
      - ./mapping.json:/app/config/mapping.json:ro

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data

  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: mikopbx
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  redis_data:
  pg_data:`}</pre>
      </div>
    </div>
  );
}
