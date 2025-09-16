import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Task } from "../../types/task";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, completed: boolean) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  return (
    <Table removeWrapper aria-label="Tasks list">
      <TableHeader>
        <TableColumn>TASK</TableColumn>
        <TableColumn>PRIORITY</TableColumn>
        <TableColumn>DUE DATE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No tasks found">
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
                {task.priority}
              </div>
            </TableCell>
            <TableCell>{formatDate(task.dueDate)}</TableCell>
            <TableCell>
              <div
                className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${task.completed ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                {task.completed ? "Completed" : "Pending"}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Tooltip content={task.completed ? "Mark as pending" : "Mark as completed"}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => onStatusChange(task.id, !task.completed)}
                  >
                    <Icon
                      icon={task.completed ? "lucide:x-circle" : "lucide:check-circle"}
                      className="text-lg"
                    />
                  </Button>
                </Tooltip>
                <Tooltip content="Edit task">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => onEdit(task)}
                  >
                    <Icon icon="lucide:pencil" className="text-lg" />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete task" color="danger">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onDelete(task.id)}
                  >
                    <Icon icon="lucide:trash-2" className="text-lg" />
                  </Button>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-danger";
    case "medium":
      return "bg-warning";
    case "low":
      return "bg-success";
    default:
      return "bg-default";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}