import { useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableField } from "./EditableField";
import { EditButtons } from "./EditButtons";
import { useUserSettings } from '@/hooks/useUserSettings';

export const ContactCard = ({ settings, updateContact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      phone_primary: settings?.user?.contact?.phone_primary,
      phone_secondary: settings?.user?.contact?.phone_secondary
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      await updateContact(formData);
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
          <Bell className="h-5 w-5" />
          <CardTitle>Contact Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              section="contact"
              field="phone_primary"
              label="Phone Primary"
              value={isEditing ? formData.phone_primary : settings?.user?.contact?.phone_primary}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <EditableField
              section="contact"
              field="phone_secondary"
              label="Phone Secondary"
              value={isEditing ? formData.phone_secondary : settings?.user?.contact?.phone_secondary}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
      <EditButtons
        section="contact"
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Card>
  );
};