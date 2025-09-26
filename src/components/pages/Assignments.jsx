import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import AssignmentList from "@/components/organisms/AssignmentList";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
      setFilteredAssignments(assignmentsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load assignments and courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAssignments(assignments);
    } else {
      const filtered = assignments.filter(assignment => {
        const course = courses.find(c => c.Id === assignment.courseId);
        const courseName = course ? course.name : "";
        
        return assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               courseName.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredAssignments(filtered);
    }
  }, [assignments, courses, searchTerm]);

  const handleAddAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentsService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      setShowAddModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEditAssignment = async (assignmentData) => {
    try {
      const updatedAssignment = await assignmentsService.update(selectedAssignment.Id, assignmentData);
      setAssignments(prev => prev.map(assignment => 
        assignment.Id === selectedAssignment.Id ? updatedAssignment : assignment
      ));
      setShowEditModal(false);
      setSelectedAssignment(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      await assignmentsService.delete(assignmentToDelete.Id);
      setAssignments(prev => prev.filter(assignment => assignment.Id !== assignmentToDelete.Id));
      setShowDeleteConfirm(false);
      setAssignmentToDelete(null);
      toast.success("Assignment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete assignment. Please try again.");
    }
  };

  const handleToggleComplete = async (assignmentId, newStatus) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const updatedAssignment = await assignmentsService.update(assignmentId, {
        ...assignment,
        status: newStatus
      });
      
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? updatedAssignment : a
      ));
    } catch (error) {
      toast.error("Failed to update assignment status");
    }
  };

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteConfirm(true);
  };

  if (isLoading) {
    return <Loading type="list" count={5} />;
  }

  if (error) {
    return (
      <Error
        title="Unable to load assignments"
        message={error}
        onRetry={loadData}
      />
    );
  }

  const pendingCount = assignments.filter(a => a.status === "pending").length;
  const completedCount = assignments.filter(a => a.status === "completed").length;
  const overdueCount = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const now = new Date();
    return a.status === "pending" && dueDate < now && !isToday(dueDate);
  }).length;

  function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-600 mt-1">Track and manage all your course assignments</p>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto"
          disabled={courses.length === 0}
        >
          Add Assignment
        </Button>
      </div>

      {courses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No courses available"
          message="You need to add courses before creating assignments."
          actionLabel="Add Course"
          onAction={() => window.location.href = "/courses"}
        />
      ) : (
        <>
          {/* Search */}
          <div className="max-w-md">
            <SearchBar
              placeholder="Search assignments..."
              onSearch={setSearchTerm}
            />
          </div>

          {/* Assignment Stats */}
          {assignments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{assignments.length}</div>
                <div className="text-sm text-slate-600">Total Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                <div className="text-sm text-slate-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{completedCount}</div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">{overdueCount}</div>
                <div className="text-sm text-slate-600">Overdue</div>
              </div>
            </div>
          )}

          {/* Assignment List */}
          {assignments.length === 0 ? (
            <Empty
              icon="FileText"
              title="No assignments yet"
              message="Create your first assignment to start tracking your academic tasks."
              actionLabel="Add Your First Assignment"
              onAction={() => setShowAddModal(true)}
            />
          ) : (
            <AssignmentList
              assignments={filteredAssignments}
              courses={courses}
              onEdit={openEditModal}
              onDelete={openDeleteConfirm}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </>
      )}

      {/* Add Assignment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Assignment"
        size="lg"
      >
        <AssignmentForm
          courses={courses}
          onSubmit={handleAddAssignment}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAssignment(null);
        }}
        title="Edit Assignment"
        size="lg"
      >
        <AssignmentForm
          assignment={selectedAssignment}
          courses={courses}
          onSubmit={handleEditAssignment}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedAssignment(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setAssignmentToDelete(null);
        }}
        title="Delete Assignment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{assignmentToDelete?.title}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setAssignmentToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAssignment}
              icon="Trash2"
            >
              Delete Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Assignments;