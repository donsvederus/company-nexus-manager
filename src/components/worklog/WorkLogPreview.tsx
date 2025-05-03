import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkLogPreviewProps {
  clientId: string;
  workLogs: WorkLog[];
}

export function WorkLogPreview({ clientId, workLogs }: WorkLogPreviewProps) {
  const navigate = useNavigate();
  
  // Sort logs by due date (if exists), then by creation date
  const sortedLogs = [...workLogs].sort((a, b) => {
    // If both have due dates, compare them
    if (a.dueDate && b.dueDate) {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    // If only one has a due date, prioritize it
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    // Otherwise sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Show at most 5 recent logs
  const recentLogs = sortedLogs.slice(0, 5);
  
  const handleNavigateToWorkLog = () => {
    navigate(`/clients/${clientId}/worklog`);
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—";
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Recent and upcoming work tasks</CardDescription>
        </div>
        <Button 
          onClick={handleNavigateToWorkLog}
          variant="outline"
          className="flex items-center gap-1"
        >
          <CalendarDays className="h-4 w-4" /> View All Tasks
        </Button>
      </CardHeader>
      <CardContent>
        {recentLogs.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No tasks found</p>
            <Button 
              onClick={handleNavigateToWorkLog}
              variant="outline"
              className="flex items-center gap-1"
            >
              <CalendarDays className="h-4 w-4" /> Create Work Tasks
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentLogs.map(log => (
              <div 
                key={log.id} 
                className="flex justify-between items-center border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                onClick={handleNavigateToWorkLog}
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {log.description || "Untitled Task"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Created: {formatDate(log.createdAt)}</span>
                    {log.completed && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {log.dueDate && (
                    <div className="text-sm text-right">
                      <div className="text-muted-foreground">Due</div>
                      <div className={`font-medium ${new Date(log.dueDate) < new Date() && !log.completed ? 'text-red-600' : ''}`}>
                        {formatDate(log.dueDate)}
                      </div>
                    </div>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            
            {workLogs.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full text-sm" 
                onClick={handleNavigateToWorkLog}
              >
                View all {workLogs.length} tasks
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WorkLogPreview;
