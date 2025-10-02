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
  useDisclosure,
  Input,
  Pagination
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTaskTemplateContext } from "@/context/task-template-context";
import { TaskTemplateForm } from "./task-template-form";
import { TaskTemplateDetail } from "./task-template-detail";
import { useTranslations } from "next-intl";

export const TaskTemplateList: React.FC = () => {
  const {
    templates,
    loading,
    error,
    selectedTemplate,
    selectTaskTemplate,
    deleteTaskTemplate,
    handleSort,
  } = useTaskTemplateContext();

  const [search, setSearch] = React.useState("");

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedTemplates = filteredTemplates.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / rowsPerPage));

  const t = useTranslations('TaskTemplates');

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
        onDeleteOpenChange();
      } catch (error) {
        console.error(t('deleteFailed'), error);
      }
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-danger-50 text-danger rounded-medium">
        {t('error')}: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('viewTemplateTitle')}</h2>
        <Button
          color="primary"
          onPress={onCreateOpen}
          startContent={<Icon icon="lucide:plus" />}
        >
          {t('createTemplateTitle')}
        </Button>
      </div>

      <Input
        placeholder={t('searchByTitle')}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 w-full max-w-xs"
      />

      {loading && templates.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          aria-label={t('templateTableAriaLabel')}
          removeWrapper
          classNames={{
            base: "border border-default-200 rounded-medium overflow-hidden",
            thead: "bg-default-50",
          }}
        >
          <TableHeader>
            <TableColumn onClick={() => handleSort('title')}>{t('titleLabel')}</TableColumn>
            <TableColumn>{t('actionsLabel')}</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={t('noTemplates')}
            isLoading={loading && templates.length > 0}
            loadingContent={<Spinner />}
          >
            {paginatedTemplates.map((template: typeof templates[0]) => (
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
        </Table>)}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={page}
            total={totalPages}
            onChange={setPage}
            showControls
          />
        </div>
      )}

      {/* Create Task Template Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} size="lg" className="max-w-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('createTemplateTitle')}</ModalHeader>
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
              <ModalHeader>{t('editTemplateTitle')}</ModalHeader>
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
              <ModalHeader>{t('viewTemplateTitle')}</ModalHeader>
              <ModalBody>
                {selectedTemplate && <TaskTemplateDetail taskTemplate={selectedTemplate} />}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>{t('closeButton')}</Button>
                <Button color="primary" onPress={() => {
                  onClose();
                  onEditOpen();
                }}>{t('editButton')}</Button>
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
              <ModalHeader className="text-danger">{t('deleteConfirm')}</ModalHeader>
              <ModalBody>
                {t('deleteConfirmationMessage', { title: selectedTemplate?.title ?? "" })}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>{t('cancelButton')}</Button>
                <Button color="danger" onPress={confirmDelete}>{t('deleteButton')}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};