"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") ?? "login";

  return (
    <main className="flex items-center justify-center h-screen bg-slate-200">
      {method === "login" ? <Login /> : <Register />}
    </main>
  );
};

const Login = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ width: 350, height: 550 }}
      animate={{ width: 350, height: 450 }}
      transition={{ duration: 0.5 }}
      
    >
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="email">Email</Label>
            <Input className="mb-5" id="email" placeholder="Email" type="email" />
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Password" type="password" />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-3 ">
          <Button className="w-full">Login</Button>
          <hr className="w-full" />
          <div className="text-sm">Don't have an account?</div>
          <Button className="w-full" variant="outline" onClick={() => router.push('?method=register')}>
            Register
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Register = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ width: 350, height: 450 }}
      animate={{ width: 350, height: 550 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="username">Username</Label>
            <Input className="mb-5" id="username" placeholder="Username" />
            <Label htmlFor="email">Email</Label>
            <Input className="mb-5" id="email" placeholder="Email" type="email" />
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Password" type="password" />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-3 ">
          <Button className="w-full">Register</Button>
          <hr className="w-full" />
          <div className="text-sm">Already have an account?</div>
          <Button className="w-full" variant="outline" onClick={() => router.push('?method=login')}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};