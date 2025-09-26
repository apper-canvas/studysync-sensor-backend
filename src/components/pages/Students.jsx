import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { studentsService } from '@/services/api/studentsService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    year: '',
    gpa: '',
    phone: '',
    chemistry_marks_c: ''
  });

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: '1', label: 'First Year' },
    { value: '2', label: 'Second Year' },
    { value: '3', label: 'Third Year' },
    { value: '4', label: 'Fourth Year' },
    { value: 'Graduate', label: 'Graduate' }
  ];

  const majorOptions = [
    { value: '', label: 'All Majors' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English Literature', label: 'English Literature' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Economics', label: 'Economics' }
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentsService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

const filteredStudents = students.filter(student => {
    const matchesSearch = (student.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (student.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (student.major?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    const matchesYear = !selectedYear || student.year === selectedYear;
    const matchesMajor = !selectedMajor || student.major === selectedMajor;
    
    return matchesSearch && matchesYear && matchesMajor;
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
      if (editingStudent) {
        await studentsService.update(editingStudent.Id, formData);
        setStudents(prev => prev.map(student => 
          student.Id === editingStudent.Id 
            ? { ...student, ...formData }
            : student
        ));
        toast.success('Student updated successfully');
        setIsEditModalOpen(false);
      } else {
        const newStudent = await studentsService.create(formData);
        setStudents(prev => [...prev, newStudent]);
        toast.success('Student added successfully');
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(editingStudent ? 'Failed to update student' : 'Failed to add student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
setFormData({
      name: student.name ?? '',
      email: student.email ?? '',
      major: student.major ?? '',
      year: student.year ?? '',
      gpa: student.gpa?.toString() ?? '',
      phone: student.phone ?? '',
      chemistry_marks_c: student.chemistry_marks_c?.toString() ?? ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (student) => {
if (window.confirm(`Are you sure you want to delete ${student.name_c ?? 'this student'}?`)) {
      try {
        await studentsService.delete(student.Id);
        setStudents(prev => prev.filter(s => s.Id !== student.Id));
        toast.success('Student deleted successfully');
      } catch (err) {
        toast.error('Failed to delete student');
      }
    }
  };

  const resetForm = () => {
setFormData({
      name: '',
      email: '',
      major: '',
      year: '',
      gpa: '',
      phone: '',
      chemistry_marks_c: ''
    });
    setEditingStudent(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.7) return 'bg-green-100 text-green-800';
    if (gpa >= 3.0) return 'bg-blue-100 text-blue-800';
    if (gpa >= 2.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student information and records</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search students..."
          className="md:col-span-1"
        />
<Select
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
          options={yearOptions}
          placeholder="Filter by Year"
        />
        <Select
          value={selectedMajor}
          onChange={(value) => setSelectedMajor(value)}
          options={majorOptions}
          placeholder="Filter by Major"
        />
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Empty 
          title="No students found" 
          description="No students match your current search criteria."
          action={
            <Button onClick={openAddModal} variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Student
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <motion.div
              key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={20} className="text-blue-600" />
                    </div>
                    <div>
<h3 className="font-semibold text-gray-900">{student.name ?? ''}</h3>
                      <p className="text-sm text-gray-600">{student.email ?? ''}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(student)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(student)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Major:</span>
<Badge variant="secondary">{student.major ?? ''}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Year:</span>
                    <Badge variant="outline">
{student.year === 'Graduate' ? 'Graduate' : `Year ${student.year ?? ''}`}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">GPA:</span>
<Badge className={getGpaColor(student.gpa)}>
                      {student.gpa?.toFixed(2) ?? '0.00'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phone:</span>
<span className="text-sm font-medium">{student.phone ?? ''}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter student's full name"
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

<FormField label="Major" required>
            <Select
              name="major"
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              options={majorOptions.slice(1)}
              placeholder="Select major"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
<FormField label="Academic Year" required>
              <Select
                name="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                options={yearOptions.slice(1)}
                placeholder="Select year"
                required
              />
            </FormField>

            <FormField label="GPA">
              <Input
                name="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </FormField>
          </div>
<FormField label="Phone Number">
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </FormField>

          <FormField label="Chemistry Marks">
            <Input
              type="number"
              step="0.1"
              name="chemistry_marks_c"
              value={formData.chemistry_marks_c}
              onChange={handleInputChange}
              placeholder="Enter chemistry marks"
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
              Add Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter student's full name"
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

<FormField label="Major" required>
            <Select
              name="major"
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              options={majorOptions.slice(1)}
              placeholder="Select major"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
<FormField label="Academic Year" required>
              <Select
                name="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                options={yearOptions.slice(1)}
                placeholder="Select year"
                required
              />
            </FormField>

            <FormField label="GPA">
              <Input
                name="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </FormField>
</div>
<FormField label="Phone Number">
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </FormField>

          <FormField label="Chemistry Marks">
            <Input
              type="number"
              step="0.1"
              name="chemistry_marks_c"
              value={formData.chemistry_marks_c}
              onChange={handleInputChange}
              placeholder="Enter chemistry marks"
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
              Update Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;