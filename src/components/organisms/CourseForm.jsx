import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    creditHours: "",
    instructor: "",
    currentGrade: "",
    semester: "",
    color: "#2563eb",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        code: course.code || "",
        creditHours: course.creditHours || "",
        instructor: course.instructor || "",
        currentGrade: course.currentGrade || "",
        semester: course.semester || "",
        color: course.color || "#2563eb",
      });
    }
  }, [course]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
    }

    if (!formData.creditHours || formData.creditHours < 1 || formData.creditHours > 6) {
      newErrors.creditHours = "Credit hours must be between 1 and 6";
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
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
      const courseData = {
        ...formData,
        creditHours: parseInt(formData.creditHours),
      };

      await onSubmit(courseData);
      
      if (course) {
        toast.success("Course updated successfully!");
      } else {
        toast.success("Course added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save course. Please try again.");
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

  const gradeOptions = [
    { value: "", label: "Select Grade" },
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

  const semesterOptions = [
    { value: "", label: "Select Semester" },
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2025", label: "Spring 2025" },
    { value: "Summer 2024", label: "Summer 2024" },
    { value: "Fall 2023", label: "Fall 2023" },
    { value: "Spring 2024", label: "Spring 2024" },
  ];

  const colorOptions = [
    "#2563eb", "#dc2626", "#059669", "#d97706", "#7c3aed", 
    "#db2777", "#0891b2", "#65a30d", "#ea580c", "#9333ea"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Course Name"
          error={errors.name}
          required
        >
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Introduction to Computer Science"
            error={!!errors.name}
          />
        </FormField>

        <FormField
          label="Course Code"
          error={errors.code}
          required
        >
          <Input
            value={formData.code}
            onChange={(e) => handleInputChange("code", e.target.value)}
            placeholder="e.g., CS 101"
            error={!!errors.code}
          />
        </FormField>

        <FormField
          label="Credit Hours"
          error={errors.creditHours}
          required
        >
          <Input
            type="number"
            min="1"
            max="6"
            value={formData.creditHours}
            onChange={(e) => handleInputChange("creditHours", e.target.value)}
            placeholder="3"
            error={!!errors.creditHours}
          />
        </FormField>

        <FormField
          label="Instructor"
          error={errors.instructor}
          required
        >
          <Input
            value={formData.instructor}
            onChange={(e) => handleInputChange("instructor", e.target.value)}
            placeholder="Prof. Smith"
            error={!!errors.instructor}
          />
        </FormField>

        <FormField
          label="Current Grade"
          error={errors.currentGrade}
        >
          <Select
            value={formData.currentGrade}
            onChange={(e) => handleInputChange("currentGrade", e.target.value)}
            error={!!errors.currentGrade}
          >
            {gradeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Semester"
          error={errors.semester}
          required
        >
          <Select
            value={formData.semester}
            onChange={(e) => handleInputChange("semester", e.target.value)}
            error={!!errors.semester}
          >
            {semesterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Course Color">
        <div className="flex flex-wrap gap-3">
          {colorOptions.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => handleInputChange("color", color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                formData.color === color 
                  ? "border-slate-400 ring-2 ring-slate-300" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </FormField>

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
          icon={isSubmitting ? "Loader2" : course ? "Save" : "Plus"}
        >
          {isSubmitting ? "Saving..." : course ? "Update Course" : "Add Course"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;