import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Card } from "@/components/atoms/Card";
import { teachersService } from "@/services/api/teachersService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    employeeId: ''
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teachersService.getAll();
      setTeachers(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = (teacher.name_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (teacher.email_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (teacher.department_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (teacher.employee_id_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teachersService.update(editingTeacher.Id, formData);
        setTeachers(prev => prev.map(teacher => 
          teacher.Id === editingTeacher.Id 
            ? { ...teacher, ...formData }
            : teacher
        ));
        toast.success('Teacher updated successfully');
        setIsEditModalOpen(false);
      } else {
        const newTeacher = await teachersService.create(formData);
        setTeachers(prev => [...prev, newTeacher]);
        toast.success('Teacher added successfully');
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(editingTeacher ? 'Failed to update teacher' : 'Failed to add teacher');
    }
  };

const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name_c ?? '',
      email: teacher.email_c ?? '',
      phone: teacher.phone_c ?? '',
      department: teacher.department_c ?? '',
      employeeId: teacher.employee_id_c ?? ''
    });
    setIsEditModalOpen(true);
  };

const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.name_c ?? 'this teacher'}?`)) {
      try {
        await teachersService.delete(teacher.Id);
        setTeachers(prev => prev.filter(t => t.Id !== teacher.Id));
        toast.success('Teacher deleted successfully');
      } catch (err) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      employeeId: ''
    });
    setEditingTeacher(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTeachers} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage teacher information and records</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search teachers..."
        />
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Empty 
          title="No teachers found" 
          description="No teachers match your current search criteria."
          action={
            <Button onClick={openAddModal} variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Teacher
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="UserCheck" size={20} className="text-green-600" />
                    </div>
<div>
                      <h3 className="font-semibold text-gray-900">{teacher.name_c ?? ''}</h3>
                      <p className="text-sm text-gray-600">{teacher.email_c ?? ''}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(teacher)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(teacher)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
<div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Department:</span>
                    <Badge variant="secondary">{teacher.department_c ?? 'N/A'}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Employee ID:</span>
                    <Badge variant="outline">{teacher.employee_id_c ?? 'N/A'}</Badge>
                  </div>
<div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{teacher.phone_c ?? 'N/A'}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter teacher's full name"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Phone Number">
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </FormField>

          <FormField label="Department">
            <Input
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
            />
          </FormField>

          <FormField label="Employee ID">
            <Input
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              placeholder="Enter employee ID"
            />
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
              Add Teacher
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Teacher"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter teacher's full name"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Phone Number">
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </FormField>

          <FormField label="Department">
            <Input
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
            />
          </FormField>

          <FormField label="Employee ID">
            <Input
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              placeholder="Enter employee ID"
            />
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
              Update Teacher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;