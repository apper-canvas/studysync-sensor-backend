import { toast } from "react-toastify";

class AssignmentsService {
  constructor() {
    this.tableName = 'assignment_c';
    this.lookupFields = ['course_id_c'];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  prepareLookupFields(data) {
    const prepared = {...data};
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        prepared[fieldName] = prepared[fieldName]?.Id || parseInt(prepared[fieldName]);
      }
    });
    return prepared;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "points_earned_c"}},
          {"field": {"Name": "points_total_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || '',
        pointsEarned: assignment.points_earned_c || null,
        pointsTotal: assignment.points_total_c || null
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "points_earned_c"}},
          {"field": {"Name": "points_total_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Assignment not found");
      }
      
      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || '',
        pointsEarned: assignment.points_earned_c || null,
        pointsTotal: assignment.points_total_c || null
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          title_c: assignmentData.title || '',
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate || '',
          course_id_c: parseInt(assignmentData.courseId),
          priority_c: assignmentData.priority || 'medium',
          status_c: assignmentData.status || 'pending',
          grade_c: assignmentData.grade || '',
          points_earned_c: assignmentData.pointsEarned || null,
          points_total_c: assignmentData.pointsTotal || null
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
          console.error(`Failed to create ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c || '',
            description: created.description_c || '',
            dueDate: created.due_date_c || '',
            courseId: created.course_id_c?.Id || created.course_id_c,
            priority: created.priority_c || 'medium',
            status: created.status_c || 'pending',
            grade: created.grade_c || '',
            pointsEarned: created.points_earned_c || null,
            pointsTotal: created.points_total_c || null
          };
        }
      }
      
      throw new Error("Failed to create assignment");
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: id,
          title_c: assignmentData.title || '',
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate || '',
          course_id_c: assignmentData.courseId ? parseInt(assignmentData.courseId) : undefined,
          priority_c: assignmentData.priority || 'medium',
          status_c: assignmentData.status || 'pending',
          grade_c: assignmentData.grade || '',
          points_earned_c: assignmentData.pointsEarned || null,
          points_total_c: assignmentData.pointsTotal || null
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
          console.error(`Failed to update ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            description: updated.description_c || '',
            dueDate: updated.due_date_c || '',
            courseId: updated.course_id_c?.Id || updated.course_id_c,
            priority: updated.priority_c || 'medium',
            status: updated.status_c || 'pending',
            grade: updated.grade_c || '',
            pointsEarned: updated.points_earned_c || null,
            pointsTotal: updated.points_total_c || null
          };
        }
      }
      
      throw new Error("Failed to update assignment");
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "points_earned_c"}},
          {"field": {"Name": "points_total_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || '',
        pointsEarned: assignment.points_earned_c || null,
        pointsTotal: assignment.points_total_c || null
      }));
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "points_earned_c"}},
          {"field": {"Name": "points_total_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        grade: assignment.grade_c || '',
        pointsEarned: assignment.points_earned_c || null,
        pointsTotal: assignment.points_total_c || null
      }));
    } catch (error) {
      console.error("Error fetching assignments by status:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const assignmentsService = new AssignmentsService();