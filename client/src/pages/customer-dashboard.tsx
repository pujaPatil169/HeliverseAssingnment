import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import ListingCard from "@/components/listings/listing-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function CustomerDashboard() {
  const [searchCity, setSearchCity] = useState("");
  const [type, setType] = useState<"all" | "hotel" | "restaurant">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: [
      "/api/listings",
      {
        city: searchCity,
        type: type !== "all" ? type : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        amenities,
        rating,
      },
    ],
  });

  const filteredListings = listings?.filter((listing) => {
    if (priceRange[0] > 0 && Number(listing.price) < priceRange[0]) return false;
    if (priceRange[1] < 1000 && Number(listing.price) > priceRange[1]) return false;
    if (rating && listing.rating && Number(listing.rating) < rating) return false;
    if (amenities.length > 0) {
      const hasAllAmenities = amenities.every((amenity) =>
        listing.amenities?.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    return true;
  });

  const amenityOptions = [
    "WiFi",
    "Parking",
    "Pool",
    "Gym",
    "Restaurant",
    "Room Service",
    "Bar",
    "Spa",
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Discover Places</h1>

      <div className="grid gap-6 mb-8">
        <div className="flex gap-4">
          <Input
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="max-w-xs"
          />

          <Select value={type} onValueChange={(value: any) => setType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <div className="pt-2">
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={(value: any) => setPriceRange(value)}
            />
            <div className="flex justify-between mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Rating</label>
          <Select
            value={rating?.toString() || "all"}
            onValueChange={(value) => setRating(value === "all" ? null : Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={r.toString()}>
                  {r} Stars & Up
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {amenityOptions.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAmenities([...amenities, amenity]);
                    } else {
                      setAmenities(amenities.filter((a) => a !== amenity));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing} showBookingForm />
          ))}
        </div>
      )}
    </div>
  );
}