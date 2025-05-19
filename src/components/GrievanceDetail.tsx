
import React, { useState } from "react";
import { Grievance, StatusType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getDepartmentLabel } from "@/data/mockData";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAISuggestions } from "@/utils/aiService";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface GrievanceDetailProps {
  grievance: Grievance;
  onClose: () => void;
  onStatusUpdate?: (id: string, status: StatusType) => void;
}

const GrievanceDetail: React.FC<GrievanceDetailProps> = ({ grievance, onClose, onStatusUpdate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<StatusType>(grievance.status);

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'open': return 'status-open';
      case 'processing': return 'status-processing';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const getSentimentClass = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-300';
      case 'neutral': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'negative': return 'bg-red-100 text-red-800 border-red-300';
      default: return '';
    }
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const aiSuggestions = await getAISuggestions(grievance);
      setSuggestions(aiSuggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleUpdateStatus = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (onStatusUpdate) {
        onStatusUpdate(grievance.id, status);
      }
      
      toast({
        title: "Status Updated",
        description: `Grievance status has been updated to ${status}.`,
      });
      
      setLoading(false);
      onClose();
    }, 1000);
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{grievance.title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              ID: {grievance.id} • Submitted: {formatDate(grievance.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className={getPriorityClass(grievance.priority)}>
              {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)} Priority
            </Badge>
            <Badge className={getStatusClass(grievance.status)}>
              {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">Complaint Details</h3>
          <p className="text-gray-700">{grievance.description}</p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-1">Citizen Information</h3>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-medium">Name:</span> {grievance.submittedBy}</p>
              <p className="text-sm"><span className="font-medium">Contact:</span> {grievance.contactNumber}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {grievance.location}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Classification</h3>
            <div className="space-y-1">
              <p className="text-sm flex items-center">
                <span className="font-medium mr-2">Department:</span> 
                <Badge variant="outline">{getDepartmentLabel(grievance.category)}</Badge>
              </p>
              <p className="text-sm flex items-center">
                <span className="font-medium mr-2">Sentiment:</span> 
                <Badge className={getSentimentClass(grievance.sentiment)}>
                  {grievance.sentiment.charAt(0).toUpperCase() + grievance.sentiment.slice(1)}
                </Badge>
              </p>
              {grievance.assignedTo && (
                <p className="text-sm"><span className="font-medium">Assigned to:</span> {grievance.assignedTo}</p>
              )}
            </div>
          </div>
        </div>
        
        {grievance.aiSummary && (
          <Alert>
            <AlertDescription>
              <span className="font-medium">AI Summary:</span> {grievance.aiSummary}
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">AI Suggestions</h3>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={loadingSuggestions}
              onClick={handleGetSuggestions}
            >
              {loadingSuggestions ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Loading...
                </>
              ) : (
                'Get AI Suggestions'
              )}
            </Button>
          </div>
          
          {suggestions.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Click the button to get AI-powered suggestions for handling this grievance.</p>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="status">Update Status</Label>
            <Select 
              defaultValue={status} 
              onValueChange={(value) => setStatus(value as StatusType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Action Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes on actions taken or to be taken"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleUpdateStatus} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrievanceDetail;
