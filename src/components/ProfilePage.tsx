
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grievance } from "@/types";
import { sampleGrievances } from "@/data/mockData";
import GrievanceCard from "./GrievanceCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GrievanceDetail from "./GrievanceDetail";
import { Loader2 } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("123 Main St, Lucknow, UP");
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  
  // Mock user's grievances (in a real app, these would be fetched based on user ID)
  const userGrievances = sampleGrievances.slice(0, 3);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setLoading(false);
    }, 1000);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    // In a real app, this would update the status on the server
    toast({
      title: "Status Updated",
      description: `Grievance status has been updated to ${status}.`,
    });
    setSelectedGrievance(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="grievances">My Grievances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card className="max-w-2xl">
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="grievances" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Your Grievance History</h2>
            
            {userGrievances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userGrievances.map(grievance => (
                  <GrievanceCard 
                    key={grievance.id} 
                    grievance={grievance} 
                    onClick={() => setSelectedGrievance(grievance)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    You haven't submitted any grievances yet. 
                  </p>
                  <Button className="mt-4">Submit a Grievance</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedGrievance} onOpenChange={(open) => !open && setSelectedGrievance(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGrievance && (
            <GrievanceDetail 
              grievance={selectedGrievance} 
              onClose={() => setSelectedGrievance(null)} 
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
