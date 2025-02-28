import { useQuery } from "@tanstack/react-query";
import { Listing, User } from "@shared/schema";
import ListingCard from "@/components/listings/listing-card";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { data: listings, isLoading: listingsLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings", { approved: false }],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="listings">
        <TabsList className="mb-8">
          <TabsTrigger value="listings">Pending Listings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {listingsLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-border" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showApproval />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          {usersLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-border" />
          ) : (
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-4">{user.id}</td>
                      <td className="p-4">{user.username}</td>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
