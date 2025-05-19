
import { DepartmentType, Grievance, PriorityType, SentimentType } from "@/types";

// This is a mock AI service that would normally call an actual AI API
// In a real implementation, this would connect to an LLM like GPT-4
export const analyzeGrievance = async (text: string): Promise<{
  sentiment: SentimentType;
  priority: PriorityType;
  category: DepartmentType;
  summary: string;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sentiment analysis based on keywords
  let sentiment: SentimentType = 'neutral';
  const negativeWords = ['not', 'problem', 'issue', 'bad', 'poor', 'terrible', 'broken', 'corruption', 'fail', 'damage', 'danger'];
  const positiveWords = ['good', 'great', 'excellent', 'thank', 'appreciate', 'helpful', 'resolved', 'fixed', 'improved'];
  
  const lowerText = text.toLowerCase();
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  
  if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
  }
  
  // Categorization based on keywords
  let category: DepartmentType = 'other';
  if (lowerText.includes('water') || lowerText.includes('supply') || lowerText.includes('tap')) {
    category = 'water_supply';
  } else if (lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('outage')) {
    category = 'electricity';
  } else if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('trash') || lowerText.includes('sanitation')) {
    category = 'sanitation';
  } else if (lowerText.includes('road') || lowerText.includes('street') || lowerText.includes('highway') || lowerText.includes('pothole')) {
    category = 'roads';
  } else if (lowerText.includes('hospital') || lowerText.includes('doctor') || lowerText.includes('medical') || lowerText.includes('health')) {
    category = 'healthcare';
  } else if (lowerText.includes('school') || lowerText.includes('college') || lowerText.includes('education') || lowerText.includes('teacher')) {
    category = 'education';
  } else if (lowerText.includes('police') || lowerText.includes('crime') || lowerText.includes('security') || lowerText.includes('theft')) {
    category = 'law_enforcement';
  } else if (lowerText.includes('house') || lowerText.includes('housing') || lowerText.includes('apartment')) {
    category = 'housing';
  } else if (lowerText.includes('farm') || lowerText.includes('crop') || lowerText.includes('agriculture')) {
    category = 'agriculture';
  }
  
  // Priority determination based on sentiment and urgency keywords
  let priority: PriorityType = 'medium';
  const urgentWords = ['urgent', 'immediately', 'emergency', 'danger', 'critical', 'life', 'death', 'serious', 'accident'];
  const highPriorityWords = ['children', 'elderly', 'disabled', 'sick', 'many people', 'community', 'days', 'week'];
  
  const urgentCount = urgentWords.filter(word => lowerText.includes(word)).length;
  const highPriorityCount = highPriorityWords.filter(word => lowerText.includes(word)).length;
  
  if (urgentCount > 0) {
    priority = 'critical';
  } else if (highPriorityCount > 0 || sentiment === 'negative') {
    priority = 'high';
  } else if (sentiment === 'neutral') {
    priority = 'medium';
  } else {
    priority = 'low';
  }
  
  // Generate simple summary (in a real implementation, this would be done by the LLM)
  let summary = '';
  if (text.length > 100) {
    summary = text.substring(0, 95) + '...';
  } else {
    summary = text;
  }
  
  return {
    sentiment,
    priority,
    category,
    summary
  };
};

// Function to get AI-generated suggestions for handling the grievance
export const getAISuggestions = async (grievance: Grievance): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock suggestions based on grievance type and priority
  const suggestions: string[] = [];
  
  if (grievance.priority === 'critical') {
    suggestions.push('This is a critical issue requiring immediate attention.');
    suggestions.push('Consider escalating to the department head.');
  } else if (grievance.priority === 'high') {
    suggestions.push('This issue should be addressed within 24-48 hours.');
  }
  
  switch (grievance.category) {
    case 'water_supply':
      suggestions.push('Check if this is an isolated issue or affects the entire area.');
      suggestions.push('Verify if any maintenance work is scheduled in the area.');
      break;
    case 'electricity':
      suggestions.push('Check if there are any scheduled power outages in the area.');
      suggestions.push('Verify if the issue is with the main grid or local distribution.');
      break;
    case 'roads':
      suggestions.push('Assess the severity of road damage and potential for accidents.');
      suggestions.push('Check if this road is under municipal or state highway authority.');
      break;
    case 'sanitation':
      suggestions.push('Check the regular garbage collection schedule for this area.');
      suggestions.push('Verify if this is a temporary disruption or a recurring issue.');
      break;
    default:
      suggestions.push('Gather more information about the specific nature of the complaint.');
      break;
  }
  
  if (grievance.sentiment === 'positive') {
    suggestions.push('This is positive feedback. Consider acknowledging the citizen's appreciation.');
  }
  
  return suggestions;
};

// Function to simulate similar cases search
export const findSimilarCases = async (grievance: Grievance): Promise<Grievance[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real implementation, this would use semantic search or similar techniques
  // For mock purposes, we'll just return cases with the same category
  return [];
};
