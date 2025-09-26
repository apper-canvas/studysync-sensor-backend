import { toast } from 'react-toastify';

class DepartmentsService {
  constructor() {
    this.tableName = 'department_c';
  }

  getApperClient() {
    if (typeof window === 'undefined' || !window.ApperSDK) {
      throw new Error('ApperSDK not loaded');
    }
    
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch departments:', response.message);
        toast.error(response.message || 'Failed to fetch departments');
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching departments:', error?.response?.data?.message || error);
      toast.error('Failed to load departments');
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await client.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(`Failed to fetch department ${id}:`, response.message);
        toast.error(response.message || 'Failed to fetch department');
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load department');
      return null;
    }
  }

  async create(departmentData) {
    try {
      const client = this.getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          name_c: departmentData.name_c || '',
          description_c: departmentData.description_c || '',
          head_of_department_c: departmentData.head_of_department_c || '',
          Name: departmentData.name_c || '',
          Tags: departmentData.Tags || ''
        }].filter(record => {
          // Remove empty fields
          const filtered = {};
          Object.keys(record).forEach(key => {
            if (record[key] !== '' && record[key] !== null && record[key] !== undefined) {
              filtered[key] = record[key];
            }
          });
          return Object.keys(filtered).length > 0 ? filtered : null;
        }).filter(Boolean)
      };

      const response = await client.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error('Failed to create department:', response.message);
        toast.error(response.message || 'Failed to create department');
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          toast.success('Department created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating department:', error?.response?.data?.message || error);
      toast.error('Failed to create department');
      return null;
    }
  }

  async update(id, departmentData) {
    try {
      const client = this.getApperClient();
      
      // Only include Updateable fields
      const updateData = {
        Id: id
      };

      if (departmentData.name_c !== undefined && departmentData.name_c !== '') {
        updateData.name_c = departmentData.name_c;
        updateData.Name = departmentData.name_c; // Keep Name in sync
      }
      if (departmentData.description_c !== undefined && departmentData.description_c !== '') {
        updateData.description_c = departmentData.description_c;
      }
      if (departmentData.head_of_department_c !== undefined && departmentData.head_of_department_c !== '') {
        updateData.head_of_department_c = departmentData.head_of_department_c;
      }
      if (departmentData.Tags !== undefined && departmentData.Tags !== '') {
        updateData.Tags = departmentData.Tags;
      }

      const payload = {
        records: [updateData]
      };

      const response = await client.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(`Failed to update department ${id}:`, response.message);
        toast.error(response.message || 'Failed to update department');
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          toast.success('Department updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to update department');
      return null;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [id]
      };

      const response = await client.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(`Failed to delete department ${id}:`, response.message);
        toast.error(response.message || 'Failed to delete department');
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Department deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to delete department');
      return false;
    }
  }
}

export const departmentsService = new DepartmentsService();