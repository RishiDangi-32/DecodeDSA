import { Settings, Shield, Server, Image, Cloud, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const handleSaveSettings = () => {
    toast.success('System settings saved successfully!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-brand-text-muted font-medium mt-1">
          Configure DSAverse platform parameters, integration APIs, and security keys.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* API connection status card */}
        <div className="glass p-6 rounded-2xl border border-brand-border/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-border/10 pb-3">
            <span className="text-brand-cyan"><Server size={18} /></span>
            <h3 className="font-bold text-brand-text-white text-sm">Server Integration Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Backend API Endpoint
                </label>
                <input
                  type="text"
                  readOnly
                  value="http://localhost:5000/api"
                  className="w-full bg-[#071A26]/85 border border-brand-border/30 rounded-xl px-4 py-2.5 text-xs font-mono text-brand-cyan focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Connection Health Status
                </label>
                <div className="flex items-center h-[42px] px-4 bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold rounded-xl gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                  <span>ONLINE & HEALTHY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloudinary Integration status card */}
        <div className="glass p-6 rounded-2xl border border-brand-border/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-border/10 pb-3">
            <span className="text-brand-cyan"><Cloud size={18} /></span>
            <h3 className="font-bold text-brand-text-white text-sm">Cloudinary Storage Integration</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">
              Images and media materials uploaded through the Lesson creator or Media Library are automatically saved to your Cloudinary storage container. Keys are resolved securely from the server environment setup.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Storage Status
                </label>
                <div className="flex items-center h-[42px] px-4 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-bold rounded-xl gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
                  <span>CLOUDINARY CONNECTED</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Default Folder
                </label>
                <input
                  type="text"
                  readOnly
                  value="dsaverse"
                  className="w-full bg-[#071A26]/85 border border-brand-border/30 rounded-xl px-4 py-2.5 text-xs font-mono text-brand-text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Super admin security credentials card */}
        <div className="glass p-6 rounded-2xl border border-brand-border/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-border/10 pb-3">
            <span className="text-brand-cyan"><Shield size={18} /></span>
            <h3 className="font-bold text-brand-text-white text-sm">Security & Access Roles</h3>
          </div>
          
          <div className="space-y-3 text-xs text-brand-text-muted font-semibold leading-relaxed">
            <div className="flex justify-between items-center py-2 border-b border-brand-border/5">
              <span>Active Super Admin Session</span>
              <span className="text-brand-text-white">Active</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-border/5">
              <span>Student Panel Access</span>
              <span className="text-red-400">DISABLED (PHASE 1)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Faculty Panel Access</span>
              <span className="text-red-400">DISABLED (PHASE 1)</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-brand-cyan text-[#071A26] font-bold text-sm rounded-xl shadow-cyan-glow hover:opacity-90 transition-opacity"
        >
          Save Settings
        </button>

      </div>
    </div>
  );
}
