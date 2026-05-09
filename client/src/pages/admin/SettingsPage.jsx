// Salon settings — wraps the tabbed SettingsForm component.

import SettingsForm from "../../components/admin/SettingsForm.jsx";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose-gold">Salon</p>
        <h1 className="font-display text-3xl md:text-4xl">Settings</h1>
      </div>
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
