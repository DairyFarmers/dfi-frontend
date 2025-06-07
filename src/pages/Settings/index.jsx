import { useState } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import Sidebar from "@/components/layout/sidebar";
import TopNavbar from "@/components/layout/top-navbar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { LocationCard } from "@/components/settings/LocationCard";
import { ContactCard } from "@/components/settings/ContactCard";
import { PrivacyCard } from "@/components/settings/PrivacyCard";
import { ChangePasswordCard } from "@/components/settings/ChangePasswordCard";

export default function Settings() {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const { 
    settings, 
    isLoading, 
    error, 
    refetch,
    updateSpecificPreference,
    updateProfile,
    updateContact,
    updateLocation,
    addLocation,
    setPrimaryLocation,
    deleteLocation,
    changePassword
  } = useUserSettings();

  const handlePreferenceToggle = async (type, key, value) => {
    try {
      await updateSpecificPreference(type, {
        [key]: typeof value === 'boolean' ? !value : value
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }
    try {
      await updateSpecificPreference('password', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handlePasswordDataChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
      return (
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavbar />
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavbar />
            <div className="p-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading sales</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{error.message}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetch()}
                    className="ml-4"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings, preferences, and privacy options.
              </p>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <ProfileCard 
                settings={settings} 
                updateProfile={updateProfile} 
              />
              <ContactCard 
                settings={settings} 
                updateContact={updateContact} 
              />
              <LocationCard 
                settings={settings} 
                updateLocation={updateLocation}
                addLocation={addLocation}
                setPrimaryLocation={setPrimaryLocation}
                deleteLocation={deleteLocation}
              />
              <PrivacyCard 
                settings={settings} 
                onToggle={handlePreferenceToggle} 
              />
              <ChangePasswordCard
                changePassword={changePassword}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}