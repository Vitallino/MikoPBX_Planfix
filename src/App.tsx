import { useState } from 'react';
import Architecture from './components/Architecture';
import EventFlow from './components/EventFlow';
import ApiRequests from './components/ApiRequests';
import EventHandler from './components/EventHandler';
import MikoConfig from './components/MikoConfig';
import PlanfixConfig from './components/PlanfixConfig';
import Scenarios from './components/Scenarios';
import CodeExamples from './components/CodeExamples';

const sections = [
  { id: 'architecture', label: 'Архитектура', icon: '🏗️' },
  { id: 'event-flow', label: 'Поток событий', icon: '🔄' },
  { id: 'scenarios', label: 'Сценарии', icon: '📋' },
  { id: 'api-requests', label: 'API запросы', icon: '🌐' },
  { id: 'event-handler', label: 'Обработчик', icon: '⚙️' },
  { id: 'code-examples', label: 'Код', icon: '💻' },
  { id: 'miko-config', label: 'MikoPBX', icon: '📞' },
  { id: 'planfix-config', label: 'Planfix', icon: '📊' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('architecture');

  const renderSection = () => {
    switch (activeSection) {
      case 'architecture': return <Architecture />;
      case 'event-flow': return <EventFlow />;
      case 'scenarios': return <Scenarios />;
      case 'api-requests': return <ApiRequests />;
      case 'event-handler': return <EventHandler />;
      case 'code-examples': return <CodeExamples />;
      case 'miko-config': return <MikoConfig />;
      case 'planfix-config': return <PlanfixConfig />;
      default: return <Architecture />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xl">
              📞
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MikoPBX ↔ Planfix</h1>
              <p className="text-xs text-gray-400">Интеграция телефонии с CRM</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs font-medium">v1.0</span>
            <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs font-medium">AMI + REST API</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
