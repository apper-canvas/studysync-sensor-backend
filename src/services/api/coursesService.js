import { toast } from "react-toastify";

class CoursesService {
  constructor() {
    this.tableName = 'course_c';
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "credit_hours_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "color_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || '',
        code: course.code_c || '',
        creditHours: course.credit_hours_c || 0,
        instructor: course.instructor_c || '',
        currentGrade: course.current_grade_c || '',
        semester: course.semester_c || '',
        color: course.color_c || '#2563eb'
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "credit_hours_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "color_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Course not found");
      }
      
      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || '',
        code: course.code_c || '',
        creditHours: course.credit_hours_c || 0,
        instructor: course.instructor_c || '',
        currentGrade: course.current_grade_c || '',
        semester: course.semester_c || '',
        color: course.color_c || '#2563eb'
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [{
          name_c: courseData.name || '',
          code_c: courseData.code || '',
          credit_hours_c: parseInt(courseData.creditHours) || 0,
          instructor_c: courseData.instructor || '',
          current_grade_c: courseData.currentGrade || '',
          semester_c: courseData.semester || '',
          color_c: courseData.color || '#2563eb'
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.name_c || '',
            code: created.code_c || '',
            creditHours: created.credit_hours_c || 0,
            instructor: created.instructor_c || '',
            currentGrade: created.current_grade_c || '',
            semester: created.semester_c || '',
            color: created.color_c || '#2563eb'
          };
        }
      }
      
      throw new Error("Failed to create course");
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [{
          Id: id,
          name_c: courseData.name || '',
          code_c: courseData.code || '',
          credit_hours_c: parseInt(courseData.creditHours) || 0,
          instructor_c: courseData.instructor || '',
          current_grade_c: courseData.currentGrade || '',
          semester_c: courseData.semester || '',
          color_c: courseData.color || '#2563eb'
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            code: updated.code_c || '',
            creditHours: updated.credit_hours_c || 0,
            instructor: updated.instructor_c || '',
            currentGrade: updated.current_grade_c || '',
            semester: updated.semester_c || '',
            color: updated.color_c || '#2563eb'
          };
        }
      }
      
      throw new Error("Failed to update course");
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const coursesService = new CoursesService();