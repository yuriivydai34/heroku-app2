import { Button } from "@heroui/react";

const CreateTaskTemplatesForm = ({ handleCreateTemplate, newTemplate, setNewTemplate, setShowCreateForm }: CreateTaskTemplateFormProps) => {
  return (
    <form onSubmit={handleCreateTemplate} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Назва *
        </label>
        <input
          type="text"
          id="title"
          value={newTemplate.title}
          onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть назву шаблона"
          style={{ color: 'black' }}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Опис
        </label>
        <textarea
          id="description"
          value={newTemplate.description}
          onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть опис шаблона"
          style={{ color: 'black' }}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={() => setShowCreateForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Створити
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskTemplatesForm;