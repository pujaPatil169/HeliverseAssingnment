import { useQuery } from "@tanstack/react-query";
import { Listing, Booking } from "@shared/schema";
import ListingForm from "@/components/listings/listing-form";
import ListingCard from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function VendorDashboard() {
  const [open, setOpen] = useState(false);
  
  const { data: listings, isLoading: listingsLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Listing</DialogTitle>
            </DialogHeader>
            <ListingForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Listings</h2>
        {listingsLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
        {bookingsLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        ) : (
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Dates</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-4">{booking.id}</td>
                    <td className="p-4">
                      {new Date(booking.startDate).toLocaleDateString()} - 
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{booking.status}</td>
                    <td className="p-4">${booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
