
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grievance, PriorityType, StatusType } from "@/types";
import { sampleGrievances, departmentOptions } from "@/data/mockData";
import GrievanceCard from "./GrievanceCard";
import GrievanceDetail from "./GrievanceDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search } from "lucide-react";

const Dashboard: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>(sampleGrievances);
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>(sampleGrievances);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    let result = grievances;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        g => g.title.toLowerCase().includes(term) || 
             g.description.toLowerCase().includes(term) ||
             g.submittedBy.toLowerCase().includes(term) ||
             g.location.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(g => g.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(g => g.priority === priorityFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(g => g.category === departmentFilter);
    }
    
    setFilteredGrievances(result);
  }, [grievances, searchTerm, statusFilter, priorityFilter, departmentFilter]);

  const handleStatusUpdate = (id: string, newStatus: StatusType) => {
    const updatedGrievances = grievances.map(g => 
      g.id === id ? { ...g, status: newStatus, updatedAt: new Date().toISOString() } : g
    );
    setGrievances(updatedGrievances);
    setSelectedGrievance(null);
  };

  const getDashboardStats = () => {
    const totalGrievances = grievances.length;
    const openGrievances = grievances.filter(g => g.status === 'open').length;
    const resolvedGrievances = grievances.filter(g => g.status === 'resolved' || g.status === 'closed').length;
    const criticalGrievances = grievances.filter(g => g.priority === 'critical').length;
    
    return { totalGrievances, openGrievances, resolvedGrievances, criticalGrievances };
  };

  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Grievance Dashboard</h1>
          <p className="text-gray-500">Monitor and manage citizen grievances</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Grievances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGrievances}</div>
            <p className="text-xs text-muted-foreground mt-1">All submitted grievances</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Grievances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openGrievances}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Grievances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedGrievances}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully addressed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalGrievances}</div>
            <div className="flex items-center mt-1">
              <Badge className="priority-critical">Critical</Badge>
              <p className="text-xs text-muted-foreground ml-2">Highest priority</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search grievances..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <Select 
              defaultValue="all" 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              defaultValue="all" 
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              defaultValue="all" 
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentOptions.map(dept => (
                  <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrievances.length > 0 ? (
              filteredGrievances.map(grievance => (
                <GrievanceCard 
                  key={grievance.id} 
                  grievance={grievance} 
                  onClick={() => setSelectedGrievance(grievance)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No grievances found matching your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="open" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrievances.filter(g => g.status === 'open').length > 0 ? (
              filteredGrievances
                .filter(g => g.status === 'open')
                .map(grievance => (
                  <GrievanceCard 
                    key={grievance.id} 
                    grievance={grievance} 
                    onClick={() => setSelectedGrievance(grievance)}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No open grievances found.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="processing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrievances.filter(g => g.status === 'processing').length > 0 ? (
              filteredGrievances
                .filter(g => g.status === 'processing')
                .map(grievance => (
                  <GrievanceCard 
                    key={grievance.id} 
                    grievance={grievance} 
                    onClick={() => setSelectedGrievance(grievance)}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No grievances in processing.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrievances.filter(g => g.status === 'resolved' || g.status === 'closed').length > 0 ? (
              filteredGrievances
                .filter(g => g.status === 'resolved' || g.status === 'closed')
                .map(grievance => (
                  <GrievanceCard 
                    key={grievance.id} 
                    grievance={grievance} 
                    onClick={() => setSelectedGrievance(grievance)}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No resolved grievances found.</p>
              </div>
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

export default Dashboard;
