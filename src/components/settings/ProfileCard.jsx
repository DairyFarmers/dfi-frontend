import { useState } from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EditableField } from "./EditableField";
import { EditButtons } from "./EditButtons";
import { useUserSettings } from '@/hooks/useUserSettings';

export const ProfileCard = ({ settings, updateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      first_name: settings?.user?.first_name,
      last_name: settings?.user?.last_name
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setFormData({});
    } catch (error) {
      // Error handling done in parent
    }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <CardTitle>Profile Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              section="profile"
              field="first_name"
              label="First Name"
              value={isEditing ? formData.first_name : settings?.user?.first_name}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <EditableField
              section="profile"
              field="last_name"
              label="Last Name"
              value={isEditing ? formData.last_name : settings?.user?.last_name}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
              <Label className="font-medium">Email:</Label>
              <span className="text-sm">{settings?.user?.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
              <Label className="font-medium">User ID:</Label>
              <span className="text-sm">{settings?.user?.id}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <EditButtons
        section="profile"
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Card>
  );
};