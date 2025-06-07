import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, Pencil, Star, StarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const locationFormSchema = z.object({
  location_type: z.enum(['home', 'work', 'farm', 'storage', 'other'], {
    required_error: "Location type is required",
  }),
  address_line1: z.string().min(1, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required").default("Sri Lanka"),
});

export const LocationCard = ({ 
  settings, 
  updateLocation, 
  addLocation, 
  setPrimaryLocation,
  deleteLocation
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log('settings in LocationCard:', settings);
  const form = useForm({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      location_type: 'home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Sri Lanka',
    }
  });

  const locations = settings?.user?.locations || [];

  const handleDelete = async (locationId) => {
    try {
      await deleteLocation(locationId);
    } catch (error) {
      // Error handling done in parent
    }
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    form.reset({
      location_type: location.type,
      address_line1: location.address_line1,
      address_line2: location.address_line2,
      city: location.city,
      state: location.state,
      postal_code: location.postal_code,
      country: location.country,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedLocation(null);
    form.reset({
      location_type: 'home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Sri Lanka',
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedLocation) {
        await updateLocation(selectedLocation.id, data);
      } else {
        await addLocation(data);
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      // Error handling done in parent
    }
  };

  const LocationForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="farm">Farm</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address_line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1 *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Continue with other form fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address_line2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {selectedLocation ? 'Update' : 'Add'} Location
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <CardTitle>Locations</CardTitle>
          </div>
          <Button variant="outline" size="icon" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {locations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No locations added yet. Click the + button to add your first location.
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => (
                <Card key={location.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={location.is_primary ? "default" : "outline"}>
                          {location.type}
                        </Badge>
                        {location.is_primary && (
                          <Badge variant="secondary">Primary</Badge>
                        )}
                      </div>
                      <p className="mt-2">{location.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!location.is_primary && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPrimaryLocation(location.id)}
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(location)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(location.id)}
                          className="text-destructive hover:text-destructive"
                        >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedLocation ? 'Edit' : 'Add'} Location
            </DialogTitle>
          </DialogHeader>
          <LocationForm />
        </DialogContent>
      </Dialog>
    </Card>
  );
};