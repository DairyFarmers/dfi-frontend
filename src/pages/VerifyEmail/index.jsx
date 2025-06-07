import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, sendOTP } from '@/redux/slices/userSlice';
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";

const otpSchema = z.object({
  otp: z.string().length(8, "OTP must be 8 digits"),
});

export default function VerifyEmail () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const isEmailVerified = useSelector((state) => state.user.is_verified);
  const [otpSent, setOtpSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSendFailed, setOtpSendFailed] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOTP = async () => {
    try {
      setSendingOtp(true);
      setOtpSendFailed(false);
      await dispatch(sendOTP()).unwrap();
      setOtpSent(true);
      setSuccessMessage('Verification code sent successfully!');
    } catch (err) {
        setOtpSendFailed(true);
        setOtpSent(false);
    } finally {
        setSendingOtp(false);
    }
  };

  const getCardDescription = () => {
    if (otpSendFailed) {
      return "Failed to send verification code";
    }
    if (!otpSent) {
      return "Sending verification code...";
    }
    return `Enter the verification code sent to your email`;
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(verifyEmail({ passcode: data.otp })).unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      form.setError("otp", {
        message: err.message || "Verification failed - please try again"
      });
    }
  };

  useEffect(() => {
    if (isEmailVerified) {
      navigate('/', { replace: true });
      return;
    }
    
    if (!otpSent) {
      handleSendOTP();
    }
  }, [isEmailVerified, otpSent, navigate]);

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
            Verify Your Account
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To ensure the security of your account and protect your data, we need to verify your email address. 
            This helps us maintain a secure environment for all our users.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Secure Access</h3>
            <p className="text-sm text-muted-foreground">Protect your account with verified email authentication.</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Quick Process</h3>
            <p className="text-sm text-muted-foreground">Simple verification process that takes just a minute.</p>
          </div>
        </div>
      </div>
  
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
              <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
              <CardDescription>{getCardDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {successMessage && (
                    <div className="p-3 text-sm text-white bg-green-600 rounded-md">
                      {successMessage}
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-3 text-sm text-white bg-destructive rounded-md animate-shake">
                      {error}
                    </div>
                  )}

                {otpSendFailed && !otpSent && (
                    <Button 
                      type="button"
                      className="w-full"
                      onClick={handleSendOTP}
                      disabled={sendingOtp}
                    >
                      {sendingOtp && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Verification Code
                    </Button>
                  )}
                
                {otpSent && (
                    <>
                      <FormField
                        control={form.control}
                        name="otp"
                        disabled={loading}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter 8-digit code"
                                type="text"
                                maxLength={8}
                                className="text-center text-lg tracking-wider"
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
                          Verify Email
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleSendOTP}
                          disabled={sendingOtp}
                        >
                          Resend Code
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );  
};