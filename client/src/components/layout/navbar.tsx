import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-primary text-primary-foreground px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-xl font-bold">BookEase</a>
        </Link>

        <div className="flex items-center gap-4">
          {user.role === "customer" && (
            <Link href="/">
              <a className="hover:opacity-80">Browse</a>
            </Link>
          )}
          
          {user.role === "vendor" && (
            <Link href="/vendor">
              <a className="hover:opacity-80">Vendor Dashboard</a>
            </Link>
          )}
          
          {user.role === "admin" && (
            <Link href="/admin">
              <a className="hover:opacity-80">Admin Dashboard</a>
            </Link>
          )}

          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
