
import React from "react";
import GrievanceForm from "@/components/GrievanceForm";
import { useNavigate } from "react-router-dom";

const SubmitGrievance: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmitSuccess = (id: string) => {
    // Redirect to dashboard after successful submission
    navigate('/');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submit New Grievance</h1>
      <p className="text-gray-500 max-w-2xl">
        Our AI-powered system will analyze your grievance to determine its priority and route it to the appropriate department for quick resolution.
      </p>
      
      <GrievanceForm onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default SubmitGrievance;
