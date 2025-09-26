import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const AssignmentForm = ({ assignment, courses, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: "",
    priority: "medium",
    status: "pending",
    grade: "",
    pointsEarned: "",
    pointsTotal: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assignment) {
      const dueDate = new Date(assignment.dueDate);
      const formattedDate = dueDate.toISOString().split("T")[0];
      
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: formattedDate,
        courseId: assignment.courseId || "",
        priority: assignment.priority || "medium",
        status: assignment.status || "pending",
        grade: assignment.grade || "",
        pointsEarned: assignment.pointsEarned || "",
        pointsTotal: assignment.pointsTotal || "",
      });
    }
  }, [assignment]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Please select a course";
    }

    if (formData.pointsEarned && !formData.pointsTotal) {
      newErrors.pointsTotal = "Total points is required when earned points is provided";
    }

    if (formData.pointsTotal && formData.pointsEarned > formData.pointsTotal) {
      newErrors.pointsEarned = "Earned points cannot exceed total points";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const assignmentData = {
        ...formData,
        courseId: parseInt(formData.courseId),
        pointsEarned: formData.pointsEarned ? parseFloat(formData.pointsEarned) : null,
        pointsTotal: formData.pointsTotal ? parseFloat(formData.pointsTotal) : null,
      };

      await onSubmit(assignmentData);
      
      if (assignment) {
        toast.success("Assignment updated successfully!");
      } else {
        toast.success("Assignment added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const gradeOptions = [
    { value: "", label: "No Grade Yet" },
    { value: "A+", label: "A+ (4.0)" },
    { value: "A", label: "A (4.0)" },
    { value: "A-", label: "A- (3.7)" },
    { value: "B+", label: "B+ (3.3)" },
    { value: "B", label: "B (3.0)" },
    { value: "B-", label: "B- (2.7)" },
    { value: "C+", label: "C+ (2.3)" },
    { value: "C", label: "C (2.0)" },
    { value: "C-", label: "C- (1.7)" },
    { value: "D+", label: "D+ (1.3)" },
    { value: "D", label: "D (1.0)" },
    { value: "D-", label: "D- (0.7)" },
    { value: "F", label: "F (0.0)" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Assignment Title"
          error={errors.title}
          required
          className="md:col-span-2"
        >
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Final Project Presentation"
            error={!!errors.title}
          />
        </FormField>

        <FormField
          label="Description"
          error={errors.description}
          required
          className="md:col-span-2"
        >
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief description of the assignment..."
            rows={3}
            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          />
        </FormField>

        <FormField
          label="Due Date"
          error={errors.dueDate}
          required
        >
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            error={!!errors.dueDate}
          />
        </FormField>

        <FormField
          label="Course"
          error={errors.courseId}
          required
        >
          <Select
            value={formData.courseId}
            onChange={(e) => handleInputChange("courseId", e.target.value)}
            error={!!errors.courseId}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.name} ({course.code})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Priority"
          error={errors.priority}
        >
          <Select
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
            error={!!errors.priority}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Status"
          error={errors.status}
        >
          <Select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            error={!!errors.status}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {/* Grading Section */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Grading (Optional)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Grade"
            error={errors.grade}
          >
            <Select
              value={formData.grade}
              onChange={(e) => handleInputChange("grade", e.target.value)}
              error={!!errors.grade}
            >
              {gradeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Points Earned"
            error={errors.pointsEarned}
          >
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.pointsEarned}
              onChange={(e) => handleInputChange("pointsEarned", e.target.value)}
              placeholder="95"
              error={!!errors.pointsEarned}
            />
          </FormField>

          <FormField
            label="Total Points"
            error={errors.pointsTotal}
          >
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.pointsTotal}
              onChange={(e) => handleInputChange("pointsTotal", e.target.value)}
              placeholder="100"
              error={!!errors.pointsTotal}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={isSubmitting ? "Loader2" : assignment ? "Save" : "Plus"}
        >
          {isSubmitting ? "Saving..." : assignment ? "Update Assignment" : "Add Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;