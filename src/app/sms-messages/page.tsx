"use client";

import React, { useState, useEffect } from 'react';

export default function SmsMessages() {
  const [sendForm, setSendForm] = useState({
    recipient: '',
    message: '',
    simPort: 0,
    sending: false
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    loadConfig();
    loadMessages();
  }, []);

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('dinstar_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setSendForm(prev => ({ ...prev, simPort: parsed.simPort || 0 }));
    }
  };

  const loadMessages = () => {
    const savedMessages = localStorage.getItem('dinstar_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  };

  const sendSms = async () => {
    if (!sendForm.recipient || !sendForm.message) {
      alert('Ju lutem plotësoni numrin dhe mesazhin');
      return;
    }

    if (!config) {
      alert('Gateway nuk është i konfiguruar. Shkoni tek konfigurimi.');
      return;
    }

    setSendForm(prev => ({ ...prev, sending: true }));

    try {
      // Simulate SMS sending
      const newMessage = {
        id: Date.now(),
        direction: 'outbound',
        recipient: sendForm.recipient,
        message: sendForm.message,
        simPort: sendForm.simPort,
        status: 'sent',
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem('dinstar_messages', JSON.stringify(updatedMessages));

      setSendForm({ recipient: '', message: '', simPort: sendForm.simPort, sending: false });
      alert('SMS u dërgua me sukses! (Demo mode)');

    } catch (error) {
      console.error('SMS send error:', error);
      alert('Gabim në dërgimin e SMS');
    } finally {
      setSendForm(prev => ({ ...prev, sending: false }));
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('sq-AL');
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Gateway nuk është i konfiguruar</h2>
          <a 
            href="/sms-config"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Shko tek Konfigurimi
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dinstar SMS Messages</h1>
              <p className="text-gray-600 mt-2">Dërgoni dhe merrni SMS përmes gateway Dinstar</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Gateway: {config.baseUrl}:{config.port}
              </div>
              <a 
                href="/sms-config"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Konfigurimi
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send SMS Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Dërgo SMS</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numri Marrës <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0697040852"
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porta SIM
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={sendForm.simPort}
                    onChange={(e) => setSendForm(prev => ({ ...prev, simPort: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Porta SIM (0-15). Default: {config.simPort}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesazhi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Shkruani mesazhin tuaj këtu..."
                    value={sendForm.message}
                    onChange={(e) => setSendForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {sendForm.message.length}/160 karaktere
                  </p>
                </div>
                
                <button
                  onClick={sendSms}
                  disabled={sendForm.sending || !sendForm.recipient || !sendForm.message}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
                >
                  {sendForm.sending ? 'Duke dërguar...' : 'Dërgo SMS'}
                </button>
              </div>
            </div>

            {/* Test Commands */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Test Command:</h3>
              <code className="block bg-white p-2 rounded text-xs break-all">
                {`curl --anyauth -u "${config.username}:${config.password}" -X POST -H "Content-Type: application/json" -d '{"text":"Test","port":[${sendForm.simPort}],"param":[{"number":"${sendForm.recipient || '0697040852'}","user_id":1234,"sn":"${config.serialNumber}"}]}' ${config.baseUrl}:${config.port}/api/send_sms`}
              </code>
            </div>
          </div>

          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Historiku i Mesazheve</h2>
                <button
                  onClick={loadMessages}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Rifresko
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {message.direction === 'inbound' ? 
                              `Nga: ${message.sender}` : 
                              `Tek: ${message.recipient}`
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(message.timestamp)} • Porta SIM: {message.simPort}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          message.status === 'sent' ? 'bg-green-100 text-green-800' :
                          message.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {message.status === 'sent' ? 'Dërguar' : 
                           message.status === 'delivered' ? 'Dorëzuar' : 'Gabim'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
                        {message.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg mb-2">Nuk ka mesazhe</p>
                      <p className="text-sm">Dërgoni SMS-in e parë tuaj për të filluar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}