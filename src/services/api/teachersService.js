import { toast } from 'react-toastify';

class TeachersService {
  constructor() {
    this.tableName = 'teacher_c';
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "employee_id_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(teacher => ({
        Id: teacher.Id,
        name: teacher.name_c || '',
        email: teacher.email_c || '',
        phone: teacher.phone_c || '',
        department: teacher.department_c || '',
        employeeId: teacher.employee_id_c || ''
      }));
    } catch (error) {
      console.error("Error fetching teachers:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "employee_id_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Teacher with ID ${id} not found`);
      }
      
      const teacher = response.data;
      return {
        Id: teacher.Id,
        name: teacher.name_c || '',
        email: teacher.email_c || '',
        phone: teacher.phone_c || '',
        department: teacher.department_c || '',
        employeeId: teacher.employee_id_c || ''
      };
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(teacherData) {
    try {
      // Sanitize data to prevent circular reference errors
      const sanitizedData = {
        name_c: String(teacherData.name || '').trim(),
        email_c: String(teacherData.email || '').trim(),
        phone_c: String(teacherData.phone || '').trim(),
        department_c: String(teacherData.department || '').trim(),
        employee_id_c: String(teacherData.employeeId || '').trim()
      };

      const params = {
        records: [sanitizedData]
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
          console.error(`Failed to create ${failed.length} teachers:`, failed);
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
            email: created.email_c || '',
            phone: created.phone_c || '',
            department: created.department_c || '',
            employeeId: created.employee_id_c || ''
          };
        }
      }
      
      throw new Error("Failed to create teacher");
    } catch (error) {
      console.error("Error creating teacher:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      // Sanitize data to prevent circular reference errors
      const sanitizedData = {
        Id: parseInt(id),
        name_c: String(updateData.name || '').trim(),
        email_c: String(updateData.email || '').trim(),
        phone_c: String(updateData.phone || '').trim(),
        department_c: String(updateData.department || '').trim(),
        employee_id_c: String(updateData.employeeId || '').trim()
      };

      const params = {
        records: [sanitizedData]
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
          console.error(`Failed to update ${failed.length} teachers:`, failed);
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
            email: updated.email_c || '',
            phone: updated.phone_c || '',
            department: updated.department_c || '',
            employeeId: updated.employee_id_c || ''
          };
        }
      }
      
      throw new Error("Failed to update teacher");
    } catch (error) {
      console.error("Error updating teacher:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const deleted = successful[0].data;
          return {
            Id: deleted.Id,
            name: deleted.name_c || '',
            email: deleted.email_c || '',
            phone: deleted.phone_c || '',
            department: deleted.department_c || '',
            employeeId: deleted.employee_id_c || ''
          };
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting teacher:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "employee_id_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{"fieldName": "name_c", "operator": "Contains", "values": [query]}],
              operator: ""
            },
            {
              conditions: [{"fieldName": "email_c", "operator": "Contains", "values": [query]}],
              operator: ""
            },
            {
              conditions: [{"fieldName": "department_c", "operator": "Contains", "values": [query]}],
              operator: ""
            },
            {
              conditions: [{"fieldName": "employee_id_c", "operator": "Contains", "values": [query]}],
              operator: ""
            }
          ]
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(teacher => ({
        Id: teacher.Id,
        name: teacher.name_c || '',
        email: teacher.email_c || '',
        phone: teacher.phone_c || '',
        department: teacher.department_c || '',
        employeeId: teacher.employee_id_c || ''
      }));
    } catch (error) {
      console.error("Error searching teachers:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

// Export singleton instance
export const teachersService = new TeachersService();