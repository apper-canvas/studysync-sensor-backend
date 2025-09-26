import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { coursesService } from "@/services/api/coursesService";

const GPACalculator = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await coursesService.getAll();
      setCourses(data);
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

  const gradePoints = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "D-": 0.7,
    "F": 0.0,
  };

  const calculateGPA = (coursesList = courses) => {
    const gradedCourses = coursesList.filter(course => course.currentGrade);
    if (gradedCourses.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    gradedCourses.forEach(course => {
      const points = gradePoints[course.currentGrade] || 0;
      totalPoints += points * course.creditHours;
      totalCredits += course.creditHours;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const getGPAByYear = () => {
    const years = {};
    courses.forEach(course => {
      const year = course.semester?.split(" ")[1] || "Unknown";
      if (!years[year]) years[year] = [];
      years[year].push(course);
    });

    return Object.entries(years).map(([year, yearCourses]) => ({
      year,
      courses: yearCourses,
      gpa: calculateGPA(yearCourses),
      credits: yearCourses.reduce((sum, course) => sum + course.creditHours, 0),
    }));
  };

  const getGPABySemester = () => {
    const semesters = {};
    courses.forEach(course => {
      const semester = course.semester || "Unknown";
      if (!semesters[semester]) semesters[semester] = [];
      semesters[semester].push(course);
    });

    return Object.entries(semesters).map(([semester, semesterCourses]) => ({
      semester,
      courses: semesterCourses,
      gpa: calculateGPA(semesterCourses),
      credits: semesterCourses.reduce((sum, course) => sum + course.creditHours, 0),
    }));
  };

  const getGradeDistribution = () => {
    const distribution = {};
    courses.filter(course => course.currentGrade).forEach(course => {
      const grade = course.currentGrade;
      if (!distribution[grade]) distribution[grade] = 0;
      distribution[grade]++;
    });
    return distribution;
  };

  const getGPARange = (gpa) => {
    if (gpa >= 3.8) return { label: "Summa Cum Laude", color: "success" };
    if (gpa >= 3.5) return { label: "Magna Cum Laude", color: "primary" };
    if (gpa >= 3.0) return { label: "Good Standing", color: "warning" };
    if (gpa >= 2.0) return { label: "Satisfactory", color: "secondary" };
    return { label: "Needs Improvement", color: "error" };
  };

  if (isLoading) {
    return <Loading type="card" count={6} />;
  }

  if (error) {
    return (
      <Error
        title="Unable to load GPA data"
        message={error}
        onRetry={loadCourses}
      />
    );
  }

  if (courses.length === 0) {
    return (
      <Empty
        icon="Calculator"
        title="No courses available"
        message="Add courses with grades to calculate your GPA."
        actionLabel="Add Courses"
        onAction={() => window.location.href = "/courses"}
      />
    );
  }

  const currentGPA = calculateGPA();
  const totalCredits = courses.reduce((sum, course) => sum + course.creditHours, 0);
  const completedCredits = courses.filter(course => course.currentGrade).reduce((sum, course) => sum + course.creditHours, 0);
  const gpaRange = getGPARange(currentGPA);
  const yearlyGPA = getGPAByYear();
  const semesterGPA = getGPABySemester();
  const gradeDistribution = getGradeDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">GPA Calculator</h1>
        <p className="text-slate-600 mt-1">Track your academic performance and calculate GPA</p>
      </div>

      {/* Current GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-blue-50 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Award" size={24} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {currentGPA.toFixed(2)}
            </div>
            <p className="text-sm text-slate-600 mb-2">Current GPA</p>
            <Badge variant={gpaRange.color} size="sm">
              {gpaRange.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {completedCredits}
            </div>
            <p className="text-sm text-slate-600 mb-2">Completed Credits</p>
            <p className="text-xs text-slate-500">of {totalCredits} total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-warning to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {courses.filter(c => c.currentGrade).length}
            </div>
            <p className="text-sm text-slate-600 mb-2">Graded Courses</p>
            <p className="text-xs text-slate-500">of {courses.length} total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round((completedCredits / 120) * 100)}%
            </div>
            <p className="text-sm text-slate-600 mb-2">Progress</p>
            <p className="text-xs text-slate-500">toward 120 credits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Breakdown */}
        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
              <span>Semester Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {semesterGPA.length > 0 ? semesterGPA.map((semester) => (
                <div key={semester.semester} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{semester.semester}</p>
                    <p className="text-sm text-slate-600">{semester.credits} credits</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">
                      {semester.gpa.toFixed(2)}
                    </div>
                    <Badge 
                      variant={getGPARange(semester.gpa).color} 
                      size="sm"
                    >
                      GPA
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-500 py-4">
                  No graded courses available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" size={20} className="text-primary" />
              <span>Grade Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.keys(gradeDistribution).length > 0 ? Object.entries(gradeDistribution)
                .sort((a, b) => gradePoints[b[0]] - gradePoints[a[0]])
                .map(([grade, count]) => {
                  const percentage = (count / courses.filter(c => c.currentGrade).length) * 100;
                  const gradeColor = gradePoints[grade] >= 3.7 ? "success" : 
                                   gradePoints[grade] >= 3.0 ? "primary" : 
                                   gradePoints[grade] >= 2.0 ? "warning" : "error";
                  
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={gradeColor} size="sm" className="w-12 justify-center">
                          {grade}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {count} course{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-primary to-blue-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-12 text-right">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                }) : (
                <p className="text-center text-slate-500 py-4">
                  No graded courses available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Details */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="List" size={20} className="text-primary" />
            <span>Course Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-medium text-slate-900">Course</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-900">Code</th>
                  <th className="text-center py-3 px-2 font-medium text-slate-900">Credits</th>
                  <th className="text-center py-3 px-2 font-medium text-slate-900">Grade</th>
                  <th className="text-center py-3 px-2 font-medium text-slate-900">Points</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-900">Semester</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr 
                    key={course.Id} 
                    className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-slate-50/30" : ""}`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="font-medium text-slate-900">{course.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600">{course.code}</td>
                    <td className="py-3 px-2 text-center text-slate-900">{course.creditHours}</td>
                    <td className="py-3 px-2 text-center">
                      {course.currentGrade ? (
                        <Badge 
                          variant={
                            gradePoints[course.currentGrade] >= 3.7 ? "success" :
                            gradePoints[course.currentGrade] >= 3.0 ? "primary" :
                            gradePoints[course.currentGrade] >= 2.0 ? "warning" : "error"
                          }
                          size="sm"
                        >
                          {course.currentGrade}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-900">
                      {course.currentGrade ? 
                        ((gradePoints[course.currentGrade] || 0) * course.creditHours).toFixed(1) : 
                        "-"
                      }
                    </td>
                    <td className="py-3 px-2 text-slate-600">{course.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GPA Scale Reference */}
      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Info" size={20} className="text-primary" />
            <span>GPA Scale Reference</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(gradePoints).map(([grade, points]) => (
              <div key={grade} className="text-center p-3 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">{grade}</div>
                <div className="text-sm text-slate-600">{points.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <Badge variant="success" className="mb-2">Summa Cum Laude</Badge>
                <p className="text-sm text-slate-600">3.8 - 4.0 GPA</p>
              </div>
              <div>
                <Badge variant="primary" className="mb-2">Magna Cum Laude</Badge>
                <p className="text-sm text-slate-600">3.5 - 3.79 GPA</p>
              </div>
              <div>
                <Badge variant="warning" className="mb-2">Good Standing</Badge>
                <p className="text-sm text-slate-600">3.0 - 3.49 GPA</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Satisfactory</Badge>
                <p className="text-sm text-slate-600">2.0 - 2.99 GPA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPACalculator;