import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentsService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.assignments]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const assignment = this.assignments.find(a => a.Id === id);
        if (assignment) {
          resolve({ ...assignment });
        } else {
          reject(new Error("Assignment not found"));
        }
      }, 200);
    });
  }

  async create(assignmentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = this.assignments.length > 0 ? Math.max(...this.assignments.map(a => a.Id)) : 0;
        const newAssignment = {
          Id: maxId + 1,
          ...assignmentData
        };
        this.assignments.push(newAssignment);
        resolve({ ...newAssignment });
      }, 500);
    });
  }

  async update(id, assignmentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.assignments.findIndex(a => a.Id === id);
        if (index !== -1) {
          this.assignments[index] = { ...this.assignments[index], ...assignmentData };
          resolve({ ...this.assignments[index] });
        } else {
          reject(new Error("Assignment not found"));
        }
      }, 500);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.assignments.findIndex(a => a.Id === id);
        if (index !== -1) {
          this.assignments.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Assignment not found"));
        }
      }, 300);
    });
  }

  async getByCourseId(courseId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseAssignments = this.assignments.filter(a => a.courseId === courseId);
        resolve([...courseAssignments]);
      }, 200);
    });
  }

  async getByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statusAssignments = this.assignments.filter(a => a.status === status);
        resolve([...statusAssignments]);
      }, 200);
    });
  }
}

export const assignmentsService = new AssignmentsService();