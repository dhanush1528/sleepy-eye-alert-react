
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { SettingsAPI } from '@/lib/api';

interface SettingsFormValues {
  soundAlerts: boolean;
  sensitivity: number;
  resolution: string;
  frameRate: string;
}

const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Set up form
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      soundAlerts: true,
      sensitivity: 50,
      resolution: '640x480',
      frameRate: '30',
    },
  });
  
  // Load user settings on component mount
  useEffect(() => {
    // In a real app, this would fetch from the backend
    // For now, we'll use mock data
    const mockSettings = {
      soundAlerts: true,
      sensitivity: 50,
      resolution: '640x480',
      frameRate: '30',
    };
    
    form.reset(mockSettings);
    
    // Real implementation would be:
    /*
    const fetchSettings = async () => {
      try {
        const response = await SettingsAPI.getSettings();
        form.reset(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      }
    };
    
    fetchSettings();
    */
  }, [form]);
  
  // Save settings
  const onSubmit = (values: SettingsFormValues) => {
    setIsSaving(true);
    
    // For the demo, we'll just show a success message
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
    
    // Real implementation would be:
    /*
    SettingsAPI.updateSettings(values)
      .then(response => {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      })
      .catch(error => {
        console.error('Error saving settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
    */
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alert Preferences</CardTitle>
                    <CardDescription>
                      Configure how you want to be alerted when drowsiness is detected
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="soundAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Sound Alerts</FormLabel>
                            <FormDescription>
                              Play audio alerts when drowsiness is detected
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sensitivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detection Sensitivity</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={100}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <div>Less Sensitive</div>
                                <div>More Sensitive</div>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Adjust how sensitive the detection algorithm is to signs of drowsiness
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Webcam Settings</CardTitle>
                    <CardDescription>
                      Configure your webcam for optimal drowsiness detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="resolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Camera Resolution</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select resolution" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="320x240">320x240 (Low)</SelectItem>
                              <SelectItem value="640x480">640x480 (Medium)</SelectItem>
                              <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                              <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Higher resolutions provide better detection but require more processing power
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="frameRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frame Rate (FPS)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frame rate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 FPS (Low)</SelectItem>
                              <SelectItem value="30">30 FPS (Standard)</SelectItem>
                              <SelectItem value="60">60 FPS (High)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Higher frame rates provide smoother detection but use more resources
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
