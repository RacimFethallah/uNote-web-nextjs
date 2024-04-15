"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { registerUser } from "@/actions/register";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { loginUser } from "@/actions/auth";
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


  const handleLogin = async (formData: FormData) => {
    const response = await loginUser(formData);
    if (response?.error) {
      toast.error(response.message);
    } else if (response) {
      toast.success(response.message);
      router.replace('/home');
    }
  }

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
          <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin(new FormData(e.currentTarget));
          }}>
            <Label htmlFor="email">Email</Label>
            <Input className="mb-5" id="email" name="email" placeholder="Email" type="email" />
            <Label htmlFor="password">Password</Label>
            <Input className="mb-5" id="password" name="password" placeholder="Password" type="password" />
            <Button type="submit" className="w-full">Login</Button>

          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-3 ">
          <Button variant="outline" className="w-full"><FcGoogle size={20} /></Button>
          <hr className="w-full" />
          <div className="text-sm">Don&apos;t have an account?</div>
          <Button className="w-full" variant="outline" onClick={() => router.push('?method=register')}>
            Register
          </Button>
        </CardFooter>
      </Card>
      <Toaster richColors position="top-center" />
    </motion.div>
  );
};

const Register = () => {
  const router = useRouter();



  const handleRegister = async (formData: FormData) => {
    const response = await registerUser(formData);
    if (response.error) {
      toast.error(response.message);
    } else if (response.success) {
      toast.success(response.message);
      router.replace('/home');
    }
  };

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
          <form onSubmit={(e) => {
            e.preventDefault();
            handleRegister(new FormData(e.currentTarget));
          }}>
            <Label htmlFor="username">Username</Label>
            <Input className="mb-5" id="username" name="username" placeholder="Username" />
            <Label htmlFor="email">Email</Label>
            <Input className="mb-5" id="email" name="email" placeholder="Email" type="email" />
            <Label htmlFor="password">Password</Label>
            <Input className="mb-5" id="password" name="password" placeholder="Password" type="password" />
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-3 ">

          <hr className="w-full" />
          <div className="text-sm">Already have an account?</div>
          <Button className="w-full" variant="outline" onClick={() => router.push('?method=login')}>
            Login
          </Button>
        </CardFooter>
      </Card>
      <Toaster richColors position="top-center" />

    </motion.div>
  );
};