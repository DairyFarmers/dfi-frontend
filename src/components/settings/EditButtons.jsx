import { Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EditButtons = ({ section, isEditing, onEdit, onSave, onCancel }) => (
  <div className="absolute top-4 right-4 flex items-center space-x-2">
    {isEditing ? (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-8 w-8 p-0"
        >
          <Save className="h-4 w-4" />
        </Button>
      </>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(section)}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    )}
  </div>
);