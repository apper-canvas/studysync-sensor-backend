import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import CourseCard from "@/components/organisms/CourseCard";
import CourseForm from "@/components/organisms/CourseForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { coursesService } from "@/services/api/coursesService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await coursesService.getAll();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [courses, searchTerm]);

  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = await coursesService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      setShowAddModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEditCourse = async (courseData) => {
    try {
      const updatedCourse = await coursesService.update(selectedCourse.Id, courseData);
      setCourses(prev => prev.map(course => 
        course.Id === selectedCourse.Id ? updatedCourse : course
      ));
      setShowEditModal(false);
      setSelectedCourse(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await coursesService.delete(courseToDelete.Id);
      setCourses(prev => prev.filter(course => course.Id !== courseToDelete.Id));
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  if (isLoading) {
    return <Loading type="card" count={6} />;
  }

  if (error) {
    return (
      <Error
        title="Unable to load courses"
        message={error}
        onRetry={loadCourses}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-600 mt-1">Manage your academic courses and track progress</p>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto"
        >
          Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search courses..."
          onSearch={setSearchTerm}
        />
      </div>

      {/* Course Stats */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{courses.length}</div>
            <div className="text-sm text-slate-600">Total Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {courses.reduce((sum, course) => sum + course.creditHours, 0)}
            </div>
            <div className="text-sm text-slate-600">Total Credits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {courses.filter(course => course.currentGrade).length}
            </div>
            <div className="text-sm text-slate-600">Graded Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {courses.length > 0 ? (
                (() => {
                  const gradedCourses = courses.filter(course => course.currentGrade);
                  if (gradedCourses.length === 0) return "N/A";
                  
                  const gradePoints = {
                    "A+": 4.0, "A": 4.0, "A-": 3.7,
                    "B+": 3.3, "B": 3.0, "B-": 2.7,
                    "C+": 2.3, "C": 2.0, "C-": 1.7,
                    "D+": 1.3, "D": 1.0, "D-": 0.7,
                    "F": 0.0
                  };
                  
                  let totalPoints = 0;
                  let totalCredits = 0;
                  
                  gradedCourses.forEach(course => {
                    const points = gradePoints[course.currentGrade] || 0;
                    totalPoints += points * course.creditHours;
                    totalCredits += course.creditHours;
                  });
                  
                  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
                })()
              ) : "N/A"}
            </div>
            <div className="text-sm text-slate-600">Current GPA</div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title={searchTerm ? "No courses found" : "No courses yet"}
          message={
            searchTerm 
              ? "Try adjusting your search terms to find courses."
              : "Add your first course to start tracking your academic progress."
          }
          actionLabel="Add Your First Course"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onEdit={openEditModal}
              onDelete={openDeleteConfirm}
            />
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Course"
        size="lg"
      >
        <CourseForm
          onSubmit={handleAddCourse}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCourse(null);
        }}
        title="Edit Course"
        size="lg"
      >
        <CourseForm
          course={selectedCourse}
          onSubmit={handleEditCourse}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCourseToDelete(null);
        }}
        title="Delete Course"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{courseToDelete?.name}</strong>? 
            This action cannot be undone and will remove all associated assignments.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setCourseToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCourse}
              icon="Trash2"
            >
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Courses;