import React, { useState, useRef } from 'react';
import { Settings, RotateCcw, Save, Upload } from 'lucide-react';
import { useLotteryStore } from '../store/lotteryStore';
import { SettingsModal } from './SettingsModal';
import { LogoSettingsModal } from './LogoSettingsModal';
import { ResetConfirmModal } from './ResetConfirmModal';

export const Header: React.FC = () => {
  const { settings, prizeTiers, updateSettings, updatePrizeTier, reset } = useLotteryStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoSettings, setShowLogoSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = () => {
    const settingsData = {
      settings,
      prizeTiers
    };

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lottery-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') return;

        const data = JSON.parse(content);
        
        // Validate the data structure
        if (data.settings && data.prizeTiers) {
          // Update settings
          updateSettings(data.settings);
          
          // Update each prize tier
          data.prizeTiers.forEach((tier: any) => {
            updatePrizeTier(tier.id, tier);
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        alert('設定ファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => setShowLogoSettings(true)}>
            <img 
              src={settings.logoUrl}
              alt="Logo" 
              className="h-8 md:h-10"
            />
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-full p-2 transition-colors hover:bg-purple-800"
              aria-label="設定"
            >
              <Settings className="h-6 w-6 text-pink-400" />
            </button>
            <button
              onClick={handleSaveSettings}
              className="rounded-full p-2 transition-colors hover:bg-purple-800"
              aria-label="設定を保存"
            >
              <Save className="h-6 w-6 text-pink-400" />
            </button>
            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleLoadSettings}
                className="hidden"
              />
              <div className="rounded-full p-2 transition-colors hover:bg-purple-800">
                <Upload className="h-6 w-6 text-pink-400" />
              </div>
            </label>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="rounded-full p-2 transition-colors hover:bg-purple-800"
              aria-label="リセット"
            >
              <RotateCcw className="h-6 w-6 text-pink-400" />
            </button>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <LogoSettingsModal
        isOpen={showLogoSettings}
        onClose={() => setShowLogoSettings(false)}
      />

      <ResetConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={reset}
      />
    </>
  );
};