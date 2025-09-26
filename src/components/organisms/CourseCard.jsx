import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, onEdit, onDelete }) => {
  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
      case "A+":
        return "success";
      case "A-":
      case "B+":
        return "primary";
      case "B":
      case "B-":
        return "warning";
      case "C+":
      case "C":
        return "warning";
      default:
        return "error";
    }
  };

  const getGPAFromGrade = (grade) => {
    const gradeMap = {
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
    return gradeMap[grade] || 0.0;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full bg-gradient-to-br from-white to-slate-50/50 border-l-4 hover:shadow-lg`} 
            style={{ borderLeftColor: course.color }}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                {course.name}
              </CardTitle>
              <p className="text-sm text-slate-600 font-medium">{course.code}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="Edit2"
                onClick={() => onEdit(course)}
                className="p-2"
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={() => onDelete(course)}
                className="p-2 hover:text-red-600"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="User" size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600">{course.instructor}</span>
              </div>
              <Badge variant="secondary" size="sm">
                {course.creditHours} Credits
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600">{course.semester}</span>
              </div>
              <div className="text-right">
                <Badge variant={getGradeColor(course.currentGrade)} size="sm" className="mb-1">
                  {course.currentGrade}
                </Badge>
                <p className="text-xs text-slate-500">
                  {getGPAFromGrade(course.currentGrade).toFixed(1)} GPA
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium text-slate-900">85%</span>
              </div>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300"
                  style={{ width: "85%" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseCard;