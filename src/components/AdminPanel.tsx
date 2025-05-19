
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { sampleGrievances, departmentOptions, getDepartmentLabel } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GrievanceDetail from "./GrievanceDetail";
import { Grievance, StatusType } from "@/types";

const AdminPanel: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>(sampleGrievances);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  const handleStatusUpdate = (id: string, newStatus: StatusType) => {
    const updatedGrievances = grievances.map(g => 
      g.id === id ? { ...g, status: newStatus, updatedAt: new Date().toISOString() } : g
    );
    setGrievances(updatedGrievances);
    setSelectedGrievance(null);
  };

  // Calculate department statistics
  const departmentStats = departmentOptions.map(dept => {
    const totalForDept = grievances.filter(g => g.category === dept.value).length;
    const resolvedForDept = grievances.filter(g => 
      g.category === dept.value && (g.status === 'resolved' || g.status === 'closed')
    ).length;
    
    const percentResolved = totalForDept > 0 
      ? Math.round((resolvedForDept / totalForDept) * 100) 
      : 0;
    
    const openForDept = grievances.filter(g => 
      g.category === dept.value && g.status === 'open'
    ).length;
    
    const processingForDept = grievances.filter(g => 
      g.category === dept.value && g.status === 'processing'
    ).length;
    
    return {
      name: dept.label,
      value: dept.value,
      total: totalForDept,
      resolved: resolvedForDept,
      open: openForDept,
      processing: processingForDept,
      percentResolved
    };
  }).filter(dept => dept.total > 0);

  // Priority statistics for pie chart
  const priorityStats = [
    { name: 'Critical', value: grievances.filter(g => g.priority === 'critical').length, color: '#ef4444' },
    { name: 'High', value: grievances.filter(g => g.priority === 'high').length, color: '#f97316' },
    { name: 'Medium', value: grievances.filter(g => g.priority === 'medium').length, color: '#eab308' },
    { name: 'Low', value: grievances.filter(g => g.priority === 'low').length, color: '#22c55e' }
  ];

  // Status statistics for bar chart
  const statusStats = [
    { name: 'Open', value: grievances.filter(g => g.status === 'open').length, color: '#3b82f6' },
    { name: 'Processing', value: grievances.filter(g => g.status === 'processing').length, color: '#a855f7' },
    { name: 'Resolved', value: grievances.filter(g => g.status === 'resolved').length, color: '#22c55e' },
    { name: 'Closed', value: grievances.filter(g => g.status === 'closed').length, color: '#6b7280' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Analyze grievance trends and department performance</p>
      </div>
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="departments">Department Status</TabsTrigger>
          <TabsTrigger value="critical">Critical Issues</TabsTrigger>
        </TabsList>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grievance Status Distribution</CardTitle>
                <CardDescription>Current status of all grievances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusStats}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Grievances">
                        {statusStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Breakdown by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {priorityStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Department-wise Grievance Distribution</CardTitle>
                <CardDescription>Number of grievances assigned to each department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentStats}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="open" name="Open" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="processing" name="Processing" stackId="a" fill="#a855f7" />
                      <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Departments Tab */}
        <TabsContent value="departments" className="mt-0">
          <div className="space-y-6">
            {departmentStats.map((dept) => (
              <Card key={dept.value}>
                <CardHeader className="pb-2">
                  <CardTitle>{dept.name}</CardTitle>
                  <CardDescription>
                    {dept.total} total grievances • {dept.percentResolved}% resolved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resolution Progress</span>
                      <span>{dept.resolved}/{dept.total}</span>
                    </div>
                    <Progress value={dept.percentResolved} className="h-2" />
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="bg-blue-50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span>{dept.open} Open</span>
                      </div>
                      <div className="bg-purple-50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        <span>{dept.processing} Processing</span>
                      </div>
                      <div className="bg-green-50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span>{dept.resolved} Resolved</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Critical Issues Tab */}
        <TabsContent value="critical" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Critical Grievances</CardTitle>
              <CardDescription>
                Highest priority issues requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {grievances.filter(g => g.priority === 'critical').length > 0 ? (
                <div className="space-y-4">
                  {grievances
                    .filter(g => g.priority === 'critical')
                    .map(grievance => (
                      <div 
                        key={grievance.id} 
                        className="border p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedGrievance(grievance)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{grievance.title}</h3>
                            <p className="text-sm text-gray-500">{grievance.location}</p>
                          </div>
                          <Badge className={`status-${grievance.status}`}>
                            {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{grievance.description}</p>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <span>ID: {grievance.id}</span>
                          <Badge variant="outline">{getDepartmentLabel(grievance.category)}</Badge>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No critical grievances at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
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

export default AdminPanel;
