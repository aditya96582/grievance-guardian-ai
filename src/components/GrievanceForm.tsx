
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzeGrievance } from "@/utils/aiService";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SentimentType, PriorityType, DepartmentType } from "@/types";
import { generateId } from "@/utils/helpers";

interface GrievanceFormProps {
  onSubmitSuccess?: (id: string) => void;
}

const GrievanceForm: React.FC<GrievanceFormProps> = ({ onSubmitSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  
  const [aiResult, setAiResult] = useState<{
    sentiment: SentimentType | null;
    priority: PriorityType | null;
    category: DepartmentType | null;
    summary: string | null;
  }>({
    sentiment: null,
    priority: null,
    category: null,
    summary: null
  });

  const handleAnalyze = async () => {
    if (!description) {
      toast({
        title: "Description required",
        description: "Please provide a detailed description of your grievance for AI analysis.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeGrievance(description);
      setAiResult({
        sentiment: result.sentiment,
        priority: result.priority,
        category: result.category,
        summary: result.summary
      });
      
      toast({
        title: "Analysis Complete",
        description: "Your grievance has been analyzed by our AI system.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your grievance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !name || !contact || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!aiResult.sentiment || !aiResult.priority || !aiResult.category) {
      toast({
        title: "Analysis required",
        description: "Please analyze your grievance before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const grievanceId = generateId();
      
      toast({
        title: "Grievance Submitted Successfully",
        description: `Your grievance has been submitted with ID: ${grievanceId}`,
      });
      
      // Reset the form
      setTitle("");
      setDescription("");
      setName("");
      setContact("");
      setLocation("");
      setAiResult({
        sentiment: null,
        priority: null,
        category: null,
        summary: null
      });
      
      setLoading(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(grievanceId);
      }
    }, 1500);
  };

  const getSentimentBadge = (sentiment: SentimentType | null) => {
    if (!sentiment) return null;
    
    const classes = {
      positive: "bg-green-100 text-green-800 border-green-300",
      neutral: "bg-blue-100 text-blue-800 border-blue-300",
      negative: "bg-red-100 text-red-800 border-red-300"
    };
    
    return (
      <Badge className={classes[sentiment]}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </Badge>
    );
  };
  
  const getPriorityBadge = (priority: PriorityType | null) => {
    if (!priority) return null;
    
    const classes = {
      critical: "priority-critical",
      high: "priority-high",
      medium: "priority-medium",
      low: "priority-low"
    };
    
    return (
      <Badge className={classes[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a New Grievance</CardTitle>
        <CardDescription>
          Please provide detailed information about your grievance. Our AI system will analyze it to route it to the appropriate department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief title of your grievance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide as much detail as possible about your grievance"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAnalyze} 
              disabled={analyzing || !description}
              className="mt-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze with AI'
              )}
            </Button>
          </div>
          
          {(aiResult.sentiment || aiResult.priority || aiResult.category) && (
            <div className="bg-slate-50 p-4 rounded-md border">
              <h3 className="font-medium mb-2">AI Analysis Results</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium">Sentiment:</span>
                  {getSentimentBadge(aiResult.sentiment)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium">Priority:</span>
                  {getPriorityBadge(aiResult.priority)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium">Department:</span>
                  {aiResult.category && (
                    <Badge variant="outline">
                      {aiResult.category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="Your contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Your detailed address/location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading || analyzing}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Grievance'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GrievanceForm;
