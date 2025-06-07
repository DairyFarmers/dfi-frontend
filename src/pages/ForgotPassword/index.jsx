import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset } from '@/redux/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2, Warehouse, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [requestSent, setRequestSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(requestPasswordReset(data)).unwrap();
      setRequestSent(true);
    } catch (err) {
      setRequestSent(true);
    }
  };

  if (requestSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Hero Section */}
          <div className="hidden lg:block space-y-6 px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary rounded-xl">
                <Warehouse className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">DFI</h1>
                <p className="text-muted-foreground">Digital Factory Inventory</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-foreground">
                Check Your Email
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                If an account exists with the email you provided, you will receive password reset instructions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Secure Process</h3>
                <p className="text-sm text-muted-foreground">Reset your password safely with our secure process.</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Contact our support team if you're having trouble.</p>
              </div>
            </div>
          </div>

          {/* Success Card */}
          <div className="w-full max-w-md mx-auto">
            <Card className="border-border shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                <CardDescription>
                  We've sent the recovery instructions to your email if an account exists.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Return to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden lg:block space-y-6 px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary rounded-xl">
              <Warehouse className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dairy Farmers</h1>
              <p className="text-muted-foreground">Next-Gen Inventory Management Platform</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-foreground">
              Reset Your Password
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Secure Reset</h3>
              <p className="text-sm text-muted-foreground">Reset your password securely with email verification.</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Quick Process</h3>
              <p className="text-sm text-muted-foreground">Simple and fast password recovery process.</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
                <div className="p-2 bg-primary rounded-lg">
                  <Warehouse className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">DFI</span>
              </div>
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email to receive recovery instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email"
                            {...field} 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Recovery Email
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/login')}
                      disabled={loading}
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}