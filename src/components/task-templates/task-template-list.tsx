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
import { useTaskTemplateContext } from "@/context/task-template-context";
import { TaskTemplateForm } from "./task-template-form";
import { TaskTemplateDetail } from "./task-template-detail";

export const TaskTemplateList: React.FC = () => {
  const { 
    templates, 
    loading, 
    error, 
    selectedTemplate,
    selectTaskTemplate,
    deleteTaskTemplate
  } = useTaskTemplateContext();

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

  const handleEdit = (template: typeof templates[0]) => {
    selectTaskTemplate(template);
    onEditOpen();
  };

  const handleView = (template: typeof templates[0]) => {
    selectTaskTemplate(template);
    onViewOpen();
  };

  const handleDelete = (template: typeof templates[0]) => {
    selectTaskTemplate(template);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (selectedTemplate?.id) {
      try {
        await deleteTaskTemplate(selectedTemplate.id);
        onDeleteOpenChange(false);
      } catch (error) {
        console.error("Failed to delete task template:", error);
      }
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
        <h2 className="text-xl font-semibold">Task Templates</h2>
        <Button 
          color="primary" 
          onPress={onCreateOpen}
          startContent={<Icon icon="lucide:plus" />}
        >
          Create Task Template
        </Button>
      </div>

      {loading && templates.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table 
          aria-label="Task templates table"
          removeWrapper
          classNames={{
            base: "border border-default-200 rounded-medium overflow-hidden",
            thead: "bg-default-50",
          }}
        >
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent="No templates found"
            isLoading={loading && templates.length > 0}
            loadingContent={<Spinner />}
          >
            {templates.map((template: typeof templates[0]) => (
              <TableRow key={template.id}>
                <TableCell>
                  <div className="font-medium">{template.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="View details">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleView(template)}
                      >
                        <Icon icon="lucide:eye" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit task template">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleEdit(template)}
                      >
                        <Icon icon="lucide:pencil" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete task template" color="danger">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger" 
                        onPress={() => handleDelete(template)}
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

      {/* Create Task Template Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Task Template</ModalHeader>
              <ModalBody>
                <TaskTemplateForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Task Template Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Task Template</ModalHeader>
              <ModalBody>
                <TaskTemplateForm taskTemplate={selectedTemplate} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Task Template Modal */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Task Template Details</ModalHeader>
              <ModalBody>
                {selectedTemplate && <TaskTemplateDetail taskTemplate={selectedTemplate} />}
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
                Are you sure you want to delete the task template "{selectedTemplate?.title}"? This action cannot be undone.
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