import React from 'react';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, User, Shield, Bell } from 'lucide-react';

const Settings = () => {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <SettingsIcon size={28} style={{ marginRight: '12px' }} /> User Settings
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SettingItem icon={<User size={20}/>} title="Profile Information" desc="Update your name and email address." />
          <SettingItem icon={<Shield size={20}/>} title="Security" desc="Change your password and manage sessions." />
          <SettingItem icon={<Bell size={20}/>} title="Notifications" desc="Configure budget alerts and insight emails." />
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, title, desc }) => (
  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#1e293b' }}>{icon}</div>
    <div>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{desc}</p>
    </div>
  </div>
);

export default Settings;