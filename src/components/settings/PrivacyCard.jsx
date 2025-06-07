import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const PrivacyCard = ({ settings, onToggle }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Privacy Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(settings?.privacy_settings || {}).map(([key, value]) => (
            <div key={key} className="p-3 rounded-lg bg-muted/10">
              <div className="flex items-center justify-between">
                <Label className="capitalize font-medium">
                  {key.replace(/_/g, ' ')}
                </Label>
                <Switch
                  checked={value}
                  onCheckedChange={() => onToggle('privacy_settings', key, value)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};