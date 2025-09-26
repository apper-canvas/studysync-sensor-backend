import { useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const AssignmentList = ({ assignments, courses, onEdit, onDelete, onToggleComplete }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.color : "#64748b";
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "secondary";
    }
  };

  const getDateLabel = (date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    if (isPast(dueDate)) return "Overdue";
    return format(dueDate, "MMM dd");
  };

  const getDateColor = (date) => {
    const dueDate = new Date(date);
    if (isPast(dueDate) && !isToday(dueDate)) return "error";
    if (isToday(dueDate)) return "warning";
    if (isTomorrow(dueDate)) return "warning";
    return "secondary";
  };

  const filteredAndSortedAssignments = assignments
    .filter((assignment) => {
      if (filter === "all") return true;
      if (filter === "pending") return assignment.status === "pending";
      if (filter === "completed") return assignment.status === "completed";
      if (filter === "overdue") return isPast(new Date(assignment.dueDate)) && assignment.status === "pending";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority.toLowerCase()] - priorityOrder[a.priority.toLowerCase()];
      }
      if (sortBy === "course") {
        return getCourseName(a.courseId).localeCompare(getCourseName(b.courseId));
      }
      return 0;
    });

  const handleToggleComplete = (assignment) => {
    const newStatus = assignment.status === "completed" ? "pending" : "completed";
    onToggleComplete(assignment.Id, newStatus);
    
    if (newStatus === "completed") {
      toast.success("Assignment marked as completed!");
    } else {
      toast.info("Assignment marked as pending");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "completed", label: "Completed" },
                { key: "overdue", label: "Overdue" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    filter === key
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="course">Sort by Course</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assignment List */}
      <div className="space-y-3">
        {filteredAndSortedAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-white border-l-4 hover:shadow-md transition-all ${
              assignment.status === "completed" ? "opacity-75" : ""
            }`}
            style={{ borderLeftColor: getCourseColor(assignment.courseId) }}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(assignment)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      assignment.status === "completed"
                        ? "bg-success border-success"
                        : "border-slate-300 hover:border-primary"
                    }`}
                  >
                    {assignment.status === "completed" && (
                      <ApperIcon name="Check" size={12} className="text-white" />
                    )}
                  </button>

                  {/* Assignment Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-slate-900 mb-1 ${
                          assignment.status === "completed" ? "line-through" : ""
                        }`}>
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="BookOpen" size={14} className="text-slate-400" />
                            <span style={{ color: getCourseColor(assignment.courseId) }} className="font-medium">
                              {getCourseName(assignment.courseId)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" size={14} className="text-slate-400" />
                            <Badge variant={getDateColor(assignment.dueDate)} size="sm">
                              {getDateLabel(assignment.dueDate)}
                            </Badge>
                          </div>
                          
                          <Badge variant={getPriorityColor(assignment.priority)} size="sm">
                            {assignment.priority}
                          </Badge>

                          {assignment.grade && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Award" size={14} className="text-slate-400" />
                              <span className="text-slate-600">
                                {assignment.pointsEarned}/{assignment.pointsTotal} ({assignment.grade})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit2"
                          onClick={() => onEdit(assignment)}
                          className="p-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => onDelete(assignment)}
                          className="p-2 hover:text-red-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {filteredAndSortedAssignments.length === 0 && (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="FileText" size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No assignments found</h3>
              <p className="text-slate-600 mb-4">
                {filter === "all" 
                  ? "You don't have any assignments yet." 
                  : `No ${filter} assignments found.`}
              </p>
              <Button icon="Plus">Add Assignment</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;