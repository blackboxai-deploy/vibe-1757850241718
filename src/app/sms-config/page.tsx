"use client";

import React, { useState } from 'react';

export default function SmsConfig() {
  const [config, setConfig] = useState({
    baseUrl: '',
    port: 8081,
    username: '',
    password: '',
    serialNumber: '',
    simPort: 0
  });

  const [status, setStatus] = useState('offline');
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      if (!config.baseUrl || !config.username || !config.password || !config.serialNumber) {
        alert('Ju lutem plotësoni të gjitha fushat e kërkuara');
        return;
      }

      localStorage.setItem('dinstar_config', JSON.stringify(config));
      alert('Konfigurimi u ruajt me sukses!');
      setStatus('configured');
    } catch (error) {
      console.error('Save error:', error);
      alert('Gabim në ruajtjen e konfigurimit');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    alert(`Test Connection:\nURL: ${config.baseUrl}:${config.port}\nUsername: ${config.username}\nSN: ${config.serialNumber}\n\nPërdorni curl command nga CMD për të testuar gateway tuaj.`);
  };

  React.useEffect(() => {
    const savedConfig = localStorage.getItem('dinstar_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
      setStatus('configured');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Konfigurimi i Dinstar Gateway</h1>
          <p className="text-gray-600">Konfiguroni lidhjen me gateway Dinstar për SMS</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            {/* Base URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="http://185.120.181.129 ose https://185.120.181.129"
                value={config.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vendosni URL-në e plotë me http:// ose https://
              </p>
            </div>

            {/* Port & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="8081"
                  value={config.port}
                  onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 8081)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Gjergji"
                  value={config.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password & Serial Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={config.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number (SN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="dbd2-0325-0044-0088"
                  value={config.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SIM Port Default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porta SIM Default
              </label>
              <input
                type="number"
                min="0"
                max="15"
                placeholder="0"
                value={config.simPort}
                onChange={(e) => handleInputChange('simPort', parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Porta SIM default (0-15). Mund të ndryshohet për çdo mesazh.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={saveConfiguration}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
              >
                {saving ? 'Duke ruajtur...' : 'Ruaj Konfigurimin'}
              </button>
              
              <button
                onClick={testConnection}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Info Testimi
              </button>
              
              <a
                href="/sms-messages"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md inline-block text-center"
              >
                SMS Messages
              </a>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Status</h3>
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> {config.baseUrl}:{config.port}</p>
            <p><strong>Username:</strong> {config.username}</p>
            <p><strong>Serial Number:</strong> {config.serialNumber}</p>
            <p><strong>SIM Port Default:</strong> {config.simPort}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                status === 'configured' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status === 'configured' ? 'I Konfiguruar' : 'Jo i Konfiguruar'}
              </span>
            </p>
          </div>
        </div>

        {/* Test Commands */}
        <div className="mt-6 bg-blue-50 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Komanda për Testim</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">HTTP Test:</p>
              <code className="block bg-gray-100 p-3 rounded text-xs break-all">
                {`curl --anyauth -u "${config.username}:${config.password}" -X POST -H "Content-Type: application/json" -d '{"text":"Test SMS","port":[${config.simPort}],"param":[{"number":"0697040852","user_id":1234,"sn":"${config.serialNumber}"}]}' ${config.baseUrl}:${config.port}/api/send_sms`}
              </code>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">HTTPS Test:</p>
              <code className="block bg-gray-100 p-3 rounded text-xs break-all">
                {`curl --anyauth -u "${config.username}:${config.password}" -X POST -H "Content-Type: application/json" -d '{"text":"Test HTTPS","port":[${config.simPort}],"param":[{"number":"0697040852","user_id":1234,"sn":"${config.serialNumber}"}]}' ${config.baseUrl.replace('http://', 'https://')}:${config.port}/api/send_sms -k`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}