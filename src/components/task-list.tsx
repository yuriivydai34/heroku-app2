import React from "react";
import { 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Spinner,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useTaskContext } from "../context/task-context";
import { TaskForm } from "./task-form";
import { TaskDetail } from "./task-detail";
import { useUserContext } from "../context/user-context";

export const TaskList: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    selectedTask,
    selectTask,
    deleteTask
  } = useTaskContext();

  const { users } = useUserContext();

  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onOpenChange: onCreateOpenChange 
  } = useDisclosure();

  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onOpenChange: onEditOpenChange 
  } = useDisclosure();

  const { 
    isOpen: isViewOpen, 
    onOpen: onViewOpen, 
    onOpenChange: onViewOpenChange 
  } = useDisclosure();

  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onOpenChange: onDeleteOpenChange 
  } = useDisclosure();

  const handleEdit = (task: typeof tasks[0]) => {
    selectTask(task);
    onEditOpen();
  };

  const handleView = (task: typeof tasks[0]) => {
    selectTask(task);
    onViewOpen();
  };

  const handleDelete = (task: typeof tasks[0]) => {
    selectTask(task);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (selectedTask?.id) {
      try {
        await deleteTask(selectedTask.id);
        onDeleteOpenChange(false);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getUserName = (id: number) => {
    const user = users.find(u => u.id === id);
    return user ? user.UserProfile?.name : `User #${id}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-danger-50 text-danger rounded-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button 
          color="primary" 
          onPress={onCreateOpen}
          startContent={<Icon icon="lucide:plus" />}
        >
          Create Task
        </Button>
      </div>

      {loading && tasks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table 
          aria-label="Tasks table"
          removeWrapper
          classNames={{
            base: "border border-default-200 rounded-medium overflow-hidden",
            thead: "bg-default-50",
          }}
        >
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>DEADLINE</TableColumn>
            <TableColumn>CREATOR</TableColumn>
            <TableColumn>SUPERVISOR</TableColumn>
            <TableColumn>FILES</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent="No tasks found"
            isLoading={loading && tasks.length > 0}
            loadingContent={<Spinner />}
          >
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="font-medium">{task.title}</div>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={task.active ? "success" : "default"} 
                    variant="flat"
                    size="sm"
                  >
                    {task.active ? "Active" : "Inactive"}
                  </Chip>
                </TableCell>
                <TableCell>{formatDate(task.deadline)}</TableCell>
                <TableCell>{getUserName(task.userIdCreator)}</TableCell>
                <TableCell>{getUserName(task.userIdSupervisor)}</TableCell>
                <TableCell>
                  {task.files && task.files.length > 0 ? (
                    <Chip size="sm" variant="flat">{task.files.length} files</Chip>
                  ) : (
                    <span className="text-default-400">No files</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="View details">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleView(task)}
                      >
                        <Icon icon="lucide:eye" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit task">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleEdit(task)}
                      >
                        <Icon icon="lucide:pencil" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete task" color="danger">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger" 
                        onPress={() => handleDelete(task)}
                      >
                        <Icon icon="lucide:trash" />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Task</ModalHeader>
              <ModalBody>
                <TaskForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Task</ModalHeader>
              <ModalBody>
                <TaskForm task={selectedTask} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Task Modal */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Task Details</ModalHeader>
              <ModalBody>
                {selectedTask && <TaskDetail task={selectedTask} />}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button color="primary" onPress={() => {
                  onClose();
                  onEditOpen();
                }}>Edit</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-danger">Confirm Deletion</ModalHeader>
              <ModalBody>
                Are you sure you want to delete the task "{selectedTask?.title}"? This action cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={confirmDelete}>Delete</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};