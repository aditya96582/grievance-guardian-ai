
import React from "react";
import { Grievance } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDepartmentLabel } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

interface GrievanceCardProps {
  grievance: Grievance;
  onClick?: () => void;
}

const GrievanceCard: React.FC<GrievanceCardProps> = ({ grievance, onClick }) => {
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

  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium line-clamp-1">{grievance.title}</CardTitle>
          <Badge className={getPriorityClass(grievance.priority)}>
            {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{grievance.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{getDepartmentLabel(grievance.category)}</Badge>
          <Badge className={getStatusClass(grievance.status)}>
            {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
        <span>{grievance.location}</span>
        <span>{formatDate(grievance.createdAt)}</span>
      </CardFooter>
    </Card>
  );
};

export default GrievanceCard;
