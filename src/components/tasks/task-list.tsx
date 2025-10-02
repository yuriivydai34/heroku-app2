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
import { useTaskContext } from "@/context/task-context";
import { TaskForm } from "./task-form";
import { TaskDetail } from "./task-detail";
import { useUserContext } from "@/context/user-context";
import { useTranslations } from 'next-intl';

export const TaskList: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    selectedTask,
    selectTask,
    deleteTask
  } = useTaskContext();

  const t = useTranslations('TaskList');

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

  const getUserName = (id?: number) => {
    if (typeof id !== "number") return t('unknownUser');
    const user = users.find(u => u.id === id);
    return user ? user.UserProfile?.name : `User #${id}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('notAvailable');
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
        <h2 className="text-xl font-semibold">{t('tasks')}</h2>
        <Button 
          color="primary" 
          onPress={onCreateOpen}
          startContent={<Icon icon="lucide:plus" />}
        >
          {t('createTask')}
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
            <TableColumn>{t('title')}</TableColumn>
            <TableColumn>{t('status')}</TableColumn>
            <TableColumn>{t('deadline')}</TableColumn>
            <TableColumn>{t('creator')}</TableColumn>
            <TableColumn>{t('supervisor')}</TableColumn>
            <TableColumn>{t('files')}</TableColumn>
            <TableColumn>{t('actions')}</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={t('noTasksFound')}
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
                    <Chip size="sm" variant="flat">{task.files.length} {t('files')}</Chip>
                  ) : (
                    <span className="text-default-400">{t('noFiles')}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content={t('viewDetails')}>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleView(task)}
                      >
                        <Icon icon="lucide:eye" />
                      </Button>
                    </Tooltip>
                    <Tooltip content={t('editTask')}>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleEdit(task)}
                      >
                        <Icon icon="lucide:pencil" />
                      </Button>
                    </Tooltip>
                    <Tooltip content={t('deleteTask')} color="danger">
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
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('createNewTask')}</ModalHeader>
              <ModalBody>
                <TaskForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('editTask')}</ModalHeader>
              <ModalBody>
                <TaskForm task={selectedTask} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Task Modal */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('taskDetails')}</ModalHeader>
              <ModalBody>
                {selectedTask && <TaskDetail task={selectedTask} />}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>{t('close')}</Button>
                <Button color="primary" onPress={() => {
                  onClose();
                  onEditOpen();
                }}>{t('edit')}</Button>
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
              <ModalHeader className="text-danger">{t('confirmDeletion')}</ModalHeader>
              <ModalBody>
                {t('confirmDeletionMessage', { taskTitle: selectedTask?.title })}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>{t('cancel')}</Button>
                <Button color="danger" onPress={confirmDelete}>{t('delete')}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};