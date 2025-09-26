import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { departmentsService } from '@/services/api/departmentsService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    head_of_department_c: '',
    Tags: ''
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentsService.getAll();
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(department => {
    const searchLower = searchTerm.toLowerCase();
    const name = department.name_c || department.Name || '';
    const description = department.description_c || '';
    const head = department.head_of_department_c || '';
    const tags = department.Tags || '';
    
    return (
      name.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower) ||
      head.toLowerCase().includes(searchLower) ||
      tags.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c.trim()) {
      toast.error('Department name is required');
      return;
    }

    try {
      if (editingDepartment) {
        // Update existing department
        const updated = await departmentsService.update(editingDepartment.Id, formData);
        if (updated) {
          setDepartments(prev => 
            prev.map(dept => dept.Id === editingDepartment.Id ? updated : dept)
          );
          setIsEditModalOpen(false);
          resetForm();
        }
      } else {
        // Create new department
        const created = await departmentsService.create(formData);
        if (created) {
          setDepartments(prev => [...prev, created]);
          setIsAddModalOpen(false);
          resetForm();
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(`Failed to ${editingDepartment ? 'update' : 'create'} department`);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name_c: department.name_c || department.Name || '',
      description_c: department.description_c || '',
      head_of_department_c: department.head_of_department_c || '',
      Tags: department.Tags || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (department) => {
    const departmentName = department.name_c || department.Name || 'this department';
    if (window.confirm(`Are you sure you want to delete ${departmentName}?`)) {
      const success = await departmentsService.delete(department.Id);
      if (success) {
        setDepartments(prev => prev.filter(d => d.Id !== department.Id));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_c: '',
      description_c: '',
      head_of_department_c: '',
      Tags: ''
    });
    setEditingDepartment(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const formatTags = (tags) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage academic departments and leadership</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Department
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search departments..."
        />
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <Empty 
          icon="Building"
          title={searchTerm ? "No departments found" : "No departments yet"}
          message={
            searchTerm 
              ? "Try adjusting your search terms to find departments."
              : "Add your first department to start organizing your academic structure."
          }
          actionLabel="Add First Department"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <motion.div
              key={department.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {department.name_c || department.Name || 'Unnamed Department'}
                      </h3>
                      {department.head_of_department_c && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Head:</span> {department.head_of_department_c}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(department)}
                        className="p-2"
                      >
                        <ApperIcon name="Edit" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(department)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>

                  {department.description_c && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {department.description_c}
                      </p>
                    </div>
                  )}

                  {department.Tags && (
                    <div className="flex flex-wrap gap-1">
                      {formatTags(department.Tags).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Department"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Department Name" required>
            <Input
              name="name_c"
              value={formData.name_c}
              onChange={handleInputChange}
              placeholder="Enter department name"
              required
            />
          </FormField>

          <FormField label="Head of Department">
            <Input
              name="head_of_department_c"
              value={formData.head_of_department_c}
              onChange={handleInputChange}
              placeholder="Enter department head name"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description_c"
              value={formData.description_c}
              onChange={handleInputChange}
              placeholder="Enter department description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </FormField>

          <FormField label="Tags">
            <Input
              name="Tags"
              value={formData.Tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas (e.g., "Science, Research, Graduate")
            </p>
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Department"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Department Name" required>
            <Input
              name="name_c"
              value={formData.name_c}
              onChange={handleInputChange}
              placeholder="Enter department name"
              required
            />
          </FormField>

          <FormField label="Head of Department">
            <Input
              name="head_of_department_c"
              value={formData.head_of_department_c}
              onChange={handleInputChange}
              placeholder="Enter department head name"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description_c"
              value={formData.description_c}
              onChange={handleInputChange}
              placeholder="Enter department description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </FormField>

          <FormField label="Tags">
            <Input
              name="Tags"
              value={formData.Tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas (e.g., "Science, Research, Graduate")
            </p>
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;