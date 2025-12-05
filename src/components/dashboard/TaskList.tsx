import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  dueTime?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const initialTasks: Task[] = [
  { id: "1", title: "Film TikTok trend video", dueTime: "2:00 PM", completed: false, priority: "high" },
  { id: "2", title: "Edit YouTube vlog", dueTime: "5:00 PM", completed: false, priority: "medium" },
  { id: "3", title: "Reply to brand collab email", completed: true, priority: "high" },
  { id: "4", title: "Schedule Instagram posts", dueTime: "Tomorrow", completed: false, priority: "low" },
  { id: "5", title: "Review analytics dashboard", completed: false, priority: "medium" },
];

const priorityColors = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

export function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
          <p className="text-sm text-muted-foreground">{incompleteTasks.length} remaining</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <div className="space-y-2">
        {incompleteTasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group text-left"
          >
            <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{task.title}</p>
              {task.dueTime && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {task.dueTime}
                </p>
              )}
            </div>
            <div className={cn("w-2 h-2 rounded-full", priorityColors[task.priority])} />
          </button>
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed
              </p>
            </div>
            {completedTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group text-left opacity-60"
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground line-through">{task.title}</p>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
