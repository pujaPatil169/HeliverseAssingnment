import { Listing } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign } from "lucide-react";
import BookingForm from "@/components/bookings/booking-form";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ListingCardProps {
  listing: Listing;
  showBookingForm?: boolean;
  showApproval?: boolean;
}

export default function ListingCard({ listing, showBookingForm, showApproval }: ListingCardProps) {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const approveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/listings/${listing.id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <span className="text-xl">{listing.name}</span>
            <span className="text-sm text-muted-foreground block">
              {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
            </span>
          </div>
          <div className="text-xl font-bold">${listing.price}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <img
            src={listing.imageUrl}
            alt={listing.name}
            className="w-full h-48 object-cover rounded-md"
          />
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {listing.address}, {listing.city}, {listing.state} {listing.zip}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{listing.description}</p>

          {showBookingForm && (
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Book Now</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book {listing.name}</DialogTitle>
                </DialogHeader>
                <BookingForm 
                  listing={listing}
                  onSuccess={() => setBookingDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}

          {showApproval && (
            <Button 
              className="w-full"
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
            >
              Approve Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
