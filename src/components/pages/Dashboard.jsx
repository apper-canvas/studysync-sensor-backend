import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const [coursesData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Loading type="card" count={2} />
          <Loading type="list" count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title="Dashboard Error"
        message={error}
        onRetry={loadData}
      />
    );
  }

  const calculateGPA = () => {
    const coursesWithGrades = courses.filter(course => course.currentGrade);
    if (coursesWithGrades.length === 0) return 0;

    const gradePoints = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    coursesWithGrades.forEach(course => {
      const points = gradePoints[course.currentGrade] || 0;
      totalPoints += points * course.creditHours;
      totalCredits += course.creditHours;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  };

  const getUpcomingAssignments = () => {
    const now = new Date();
    const nextWeek = addDays(now, 7);
    
    return assignments
      .filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return assignment.status === "pending" && dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getPendingAssignments = () => {
    return assignments.filter(assignment => assignment.status === "pending");
  };

  const getCompletedAssignments = () => {
    return assignments.filter(assignment => assignment.status === "completed");
  };

  const getDateLabel = (date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM dd");
  };

  const getDateColor = (date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "error";
    if (isTomorrow(dueDate)) return "warning";
    return "secondary";
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "secondary";
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const currentGPA = calculateGPA();
  const upcomingAssignments = getUpcomingAssignments();
  const pendingCount = getPendingAssignments().length;
  const completedCount = getCompletedAssignments().length;
  const totalCredits = courses.reduce((sum, course) => sum + course.creditHours, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={currentGPA.toFixed(2)}
          icon="Award"
          color={currentGPA >= 3.5 ? "success" : currentGPA >= 3.0 ? "warning" : "error"}
          trend={currentGPA >= 3.5 ? "up" : currentGPA >= 2.0 ? "neutral" : "down"}
          trendValue={`${courses.length} courses`}
        />
        
        <StatCard
          title="Active Courses"
          value={courses.length}
          icon="BookOpen"
          color="primary"
          trend="neutral"
          trendValue={`${totalCredits} credits`}
        />
        
        <StatCard
          title="Pending Tasks"
          value={pendingCount}
          icon="Clock"
          color={pendingCount > 10 ? "error" : pendingCount > 5 ? "warning" : "success"}
          trend={pendingCount > 10 ? "down" : "up"}
          trendValue={`${completedCount} completed`}
        />
        
        <StatCard
          title="This Week"
          value={upcomingAssignments.length}
          icon="CalendarDays"
          color={upcomingAssignments.length > 3 ? "warning" : "success"}
          trend="neutral"
          trendValue="assignments due"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Zap" size={20} className="text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                icon="Plus"
                onClick={() => navigate("/courses")}
              >
                Add New Course
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                icon="FileText"
                onClick={() => navigate("/assignments")}
              >
                Create Assignment
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                icon="Calculator"
                onClick={() => navigate("/gpa")}
              >
                Calculate GPA
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="BookOpen" size={20} className="text-primary" />
                  <span>Active Courses</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/courses")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses.length === 0 ? (
                <Empty
                  icon="BookOpen"
                  title="No courses yet"
                  message="Add your first course to get started"
                  actionLabel="Add Course"
                  onAction={() => navigate("/courses")}
                  className="py-4"
                />
              ) : (
                courses.slice(0, 3).map((course) => (
                  <div
                    key={course.Id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <p className="font-medium text-slate-900">{course.code}</p>
                        <p className="text-sm text-slate-600">{course.name}</p>
                      </div>
                    </div>
                    {course.currentGrade && (
                      <Badge variant="secondary" size="sm">
                        {course.currentGrade}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Assignments */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={20} className="text-primary" />
                  <span>Upcoming</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/assignments")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAssignments.length === 0 ? (
                <Empty
                  icon="CheckCircle"
                  title="All caught up!"
                  message="No assignments due this week"
                  actionLabel="Add Assignment"
                  onAction={() => navigate("/assignments")}
                  className="py-4"
                />
              ) : (
                upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.Id}
                    className="flex items-start justify-between p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-slate-600 truncate">
                        {getCourseName(assignment.courseId)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={getDateColor(assignment.dueDate)} size="sm">
                          {getDateLabel(assignment.dueDate)}
                        </Badge>
                        <Badge variant={getPriorityColor(assignment.priority)} size="sm">
                          {assignment.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      {courses.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              <span>Academic Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {currentGPA.toFixed(2)}
                </div>
                <p className="text-sm text-slate-600">Current GPA</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-blue-500"
                    style={{ width: `${(currentGPA / 4) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {Math.round((completedCount / (completedCount + pendingCount)) * 100) || 0}%
                </div>
                <p className="text-sm text-slate-600">Completion Rate</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-success to-green-500"
                    style={{ width: `${Math.round((completedCount / (completedCount + pendingCount)) * 100) || 0}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {totalCredits}
                </div>
                <p className="text-sm text-slate-600">Total Credits</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-warning to-amber-500"
                    style={{ width: `${Math.min((totalCredits / 120) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;