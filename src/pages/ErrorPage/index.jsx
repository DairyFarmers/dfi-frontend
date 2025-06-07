import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { XCircle, AlertTriangle, Info } from "lucide-react";

const errorTypes = {
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  info: {
    icon: Info,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
};

export default function ErrorPage({ 
  title = "An Error Occurred",
  description = "We apologize for the inconvenience.",
  message = "Something went wrong. Please try again later.",
  type = "error"
}) {
  const navigate = useNavigate();

  const primaryAction = {
    label: "Go Home",
    onClick: () => navigate('/', { replace: true }),
  };

  const ErrorIcon = errorTypes[type]?.icon || XCircle;
  const iconColorClass = errorTypes[type]?.color || 'text-destructive';
  const iconBgClass = errorTypes[type]?.bgColor || 'bg-destructive/10';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <div className={`mx-auto ${iconColorClass} w-16 h-16 rounded-full ${iconBgClass} flex items-center justify-center mb-4`}>
            <ErrorIcon className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {message}
          </p>
          <div className="space-y-2">
            {primaryAction && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}