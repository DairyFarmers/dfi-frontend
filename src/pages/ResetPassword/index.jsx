import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/redux/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2, Warehouse, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(resetPassword({ 
        uid, 
        token, 
        password: data.password 
      })).unwrap();
      navigate('/login', { 
        replace: true,
        state: { 
            message: 'Password reset successful. Please login with your new password.' 
        }
      });
    } catch (err) {
        navigate('/error', { replace: true });
        return;
    }
  };

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
              Choose a strong password that you haven't used before. 
              A good password is long, unique, and easy to remember but hard to guess.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Strong Password</h3>
              <p className="text-sm text-muted-foreground">Use a combination of letters, numbers, and symbols.</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Keep it Safe</h3>
              <p className="text-sm text-muted-foreground">Never share your password or store it in plain text.</p>
            </div>
          </div>
        </div>

        {/* Reset Form */}
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
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {(form.formState.errors.root || error) && (
                    <div className="p-3 text-sm text-white bg-destructive rounded-md animate-shake">
                      {form.formState.errors.root?.message || error}
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter new password"
                            {...field} 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password"
                            {...field} 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reset Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}