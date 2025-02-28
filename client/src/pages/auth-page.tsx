import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome to BookEase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Username"
                    {...loginForm.register("username")}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    {...loginForm.register("password")}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form
                  onSubmit={registerForm.handleSubmit((data) =>
                    registerMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Username"
                    {...registerForm.register("username")}
                  />
                  <Input
                    placeholder="Name"
                    {...registerForm.register("name")}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    {...registerForm.register("email")}
                  />
                  <Input
                    placeholder="Phone"
                    {...registerForm.register("phone")}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    {...registerForm.register("password")}
                  />
                  <select {...registerForm.register("role")} className="w-full p-2 border rounded">
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                  </select>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:block bg-gradient-to-br from-primary to-primary-foreground p-8">
        <div className="h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Perfect Stay or Dining Experience
          </h1>
          <p className="text-lg opacity-90">
            Book hotels and restaurants with ease. Join thousands of satisfied customers
            and vendors on our platform.
          </p>
        </div>
      </div>
    </div>
  );
}
