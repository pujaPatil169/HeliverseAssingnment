import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema, Listing } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface BookingFormProps {
  listing: Listing;
  onSuccess?: () => void;
}

export default function BookingForm({ listing, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Set tomorrow as default end date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find the first valid unit to use as default
  const findFirstValidUnit = () => {
    if (!listing.units || listing.units.length === 0) return null;
    return listing.units.find(unit => unit && unit.id && unit.id.trim() !== '');
  };

  const defaultUnit = findFirstValidUnit();

  // Convert price to number to ensure consistent type
  const getUnitPrice = (unit: any) => {
    if (!unit) return 0;
    const price = unit.price;
    return typeof price === 'string' ? parseFloat(price) : (price || 0);
  };

  const form = useForm({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      listingId: listing.id,
      startDate: new Date(),
      endDate: tomorrow,
      unitId: defaultUnit?.id || "",
      totalPrice: getUnitPrice(defaultUnit) || parseFloat(String(listing.price)) || 0,
      status: "pending",
      paymentStatus: "pending"
    },
  });

  const selectedUnit = listing.units.find(
    (unit) => unit.id === form.watch("unitId")
  );

  // Validate dates whenever they change
  useEffect(() => {
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

    if (startDate && endDate && startDate > endDate) {
      form.setValue("endDate", new Date(startDate));
    }
  }, [form.watch("startDate"), form.watch("endDate")]);

  const calculateTotalPrice = () => {
    if (!selectedUnit) return form.watch("totalPrice") || 0;

    // Calculate number of days between start and end date
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    let days = 1;

    if (startDate instanceof Date && endDate instanceof Date) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    const unitPrice = parseFloat(selectedUnit.price) || 0;
    return (unitPrice * days).toFixed(2);
  };

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        setIsSubmitting(true);
        console.log("Submitting booking data to API:", data);
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });

        const responseText = await res.text();
        console.log("API Response Status:", res.status);
        console.log("API Response Text:", responseText);

        if (!res.ok) {
          let errorMessage = "Failed to create booking";
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If parsing fails, use the response text directly
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
          responseData = { message: "Booking created but response format was unexpected" };
        }

        return responseData;
      } catch (error: any) {
        console.error("Error creating booking:", error);
        setFormError(error.message || "Failed to create booking");
        toast({
          title: "Error",
          description: error.message || "Failed to create booking",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: (data) => {
      console.log("Booking created successfully:", data);
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      onSuccess?.();
    },
  });

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-4">
      <form
        onSubmit={form.handleSubmit((data) => {
          // Validate unit selection
          if (!data.unitId) {
            setFormError("Please select a unit");
            toast({
              title: "Form Error",
              description: "Please select a unit",
              variant: "destructive",
            });
            return;
          }
          createBookingMutation.mutate(data);
        })}
        className="space-y-4"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Unit Type</label>
            <Select
              value={form.watch("unitId")}
              onValueChange={(value) => {
                if (value) {
                  form.setValue("unitId", value);
                  const unit = listing.units.find((u) => u.id === value);
                  if (unit) {
                    form.setValue("totalPrice", parseFloat(unit.price) || 0);
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {listing.units && listing.units.length > 0 ? (
                      listing.units
                        .filter(unit => unit && unit.id && unit.id.trim() !== '')
                        .map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name} - ${parseFloat(unit.price) || 0}/night
                          </SelectItem>
                        ))
                ) : (
                  <SelectItem value="no-units" disabled>No units available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.unitId && (
              <p className="text-red-500 text-sm">Please select a unit</p>
            )}
          </div>

          {selectedUnit && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">{selectedUnit.name}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedUnit.description}
              </p>
              <p className="text-sm">
                Capacity: {selectedUnit.capacity} {listing.type === "hotel" ? "people" : "seats"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("startDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("startDate") ? (
                      format(form.watch("startDate"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("startDate")}
                    onSelect={(date) => {
                      form.setValue("startDate", date!);
                      form.setValue("totalPrice", calculateTotalPrice());
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("endDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("endDate") ? (
                      format(form.watch("endDate"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("endDate")}
                    onSelect={(date) => {
                      form.setValue("endDate", date!);
                      form.setValue("totalPrice", calculateTotalPrice());
                    }}
                    initialFocus
                    disabled={(date) =>
                      date < form.watch("startDate") || date < new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span>Total Price:</span>
            <span className="font-bold">${calculateTotalPrice()}</span>
          </div>

          {formError && (
            <div className="bg-red-50 text-red-500 p-2 rounded mb-4 text-sm">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createBookingMutation.isPending}
          >
            {isSubmitting || createBookingMutation.isPending ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}