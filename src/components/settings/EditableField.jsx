import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const EditableField = ({ section, field, label, value, isEditing, onChange }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
    <Label className="font-medium">{label}:</Label>
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <Input
          className="max-w-[200px]"
          value={value || ''}
          onChange={(e) => onChange(section, field, e.target.value)}
        />
      ) : (
        <span className="text-sm">{value || 'Not set'}</span>
      )}
    </div>
  </div>
);