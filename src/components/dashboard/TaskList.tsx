import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  dueTime?: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: "1", title: "Film TikTok trend video", dueTime: "2:00 PM", completed: false },
  { id: "2", title: "Edit YouTube vlog", dueTime: "5:00 PM", completed: false },
  { id: "3", title: "Reply to brand collab email", completed: true },
  { id: "4", title: "Schedule Instagram posts", dueTime: "Tomorrow", completed: false },
  { id: "5", title: "Review analytics dashboard", completed: false },
];

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
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-foreground">Today's Tasks</h3>
          <p className="text-sm text-muted-foreground">{incompleteTasks.length} remaining</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="space-y-1">
        {incompleteTasks.map((task, index) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-300 group text-left opacity-0 animate-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Circle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{task.title}</p>
              {task.dueTime && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {task.dueTime}
                </p>
              )}
            </div>
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
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-300 group text-left opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <p className="text-sm text-muted-foreground line-through">{task.title}</p>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
