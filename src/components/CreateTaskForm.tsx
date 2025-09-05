import { useState } from "react";

interface UserData {
  id: string;
  username: string;
}

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  usersIdAssociate: number[];
  userIdSupervisor: number;
}

interface TaskTemplateData {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
}

interface CreateTaskFormProps {
  handleCreateTask: (e: React.FormEvent) => void;
  newTask: TaskData;
  setNewTask: React.Dispatch<React.SetStateAction<TaskData>>;
  users: UserData[];
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  templates: TaskTemplateData[];
}

const CreateTaskForm = ({ handleCreateTask, newTask, setNewTask, users, setShowCreateForm, templates }: CreateTaskFormProps) => {
  const [templateSelected, setTemplateSelected] = useState<TaskTemplateData | null>(null);
  
  const onSelectTemplate = (template: TaskTemplateData) => {
    setTemplateSelected(template);
    setNewTask({ ...newTask, title: template.title, description: template.description });
  };
  
  return (
    <form onSubmit={handleCreateTask} className="space-y-4">
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-gray-700">
          Template
        </label>
        <select
          id="template"
          value={templateSelected?.id || 0}
          onChange={(e) => {
            const selectedTemplate = templates.find(template => String(template.id) === e.target.value);
            if (selectedTemplate) {
              onSelectTemplate(selectedTemplate);
            }
          }}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        >
          <option value={0}>Select template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title} (ID: {template.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
          style={{ color: 'black' }}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description"
          style={{ color: 'black' }}
        />
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
          Deadline
        </label>
        <input
          type="datetime-local"
          id="deadline"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        />
      </div>
      <div>
        <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
          Supervisor
        </label>
        <select
          id="supervisor"
          value={newTask.userIdSupervisor}
          onChange={(e) => setNewTask({ ...newTask, userIdSupervisor: Number(e.target.value) })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        >
          <option value={0}>Select supervisor</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} (ID: {user.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="associate" className="block text-sm font-medium text-gray-700">
          Associate
        </label>
        <select
          id="associate"
          multiple
          value={(newTask.usersIdAssociate ?? []).map(String)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
            setNewTask({ ...newTask, usersIdAssociate: selected });
          }}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} (ID: {user.id})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple associates.</p>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setShowCreateForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Create Task
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;