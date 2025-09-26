import studentsData from '../mockData/students.json';

// Mock database simulation with localStorage persistence
const STORAGE_KEY = 'studysync_students';

class StudentsService {
  constructor() {
    this.students = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [...studentsData];
    } catch (error) {
      console.warn('Failed to load students from storage:', error);
      return [...studentsData];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.students));
    } catch (error) {
      console.warn('Failed to save students to storage:', error);
    }
  }

  // Simulate network delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.students];
  }

  async getById(id) {
    await this.delay();
    const student = this.students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);
    }
    return { ...student };
  }

  async create(studentData) {
    await this.delay();
    
    // Generate new ID
    const maxId = this.students.reduce((max, student) => 
      Math.max(max, student.Id), 0);
    
    const newStudent = {
      Id: maxId + 1,
      name: studentData.name,
      email: studentData.email,
      major: studentData.major,
      year: studentData.year,
      gpa: parseFloat(studentData.gpa) || 0.0,
      phone: studentData.phone || '',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    
    this.students.push(newStudent);
    this.saveToStorage();
    
    return { ...newStudent };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    
    const updatedStudent = {
      ...this.students[index],
      name: updateData.name,
      email: updateData.email,
      major: updateData.major,
      year: updateData.year,
      gpa: parseFloat(updateData.gpa) || this.students[index].gpa,
      phone: updateData.phone || this.students[index].phone
    };
    
    this.students[index] = updatedStudent;
    this.saveToStorage();
    
    return { ...updatedStudent };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    
    const deletedStudent = this.students.splice(index, 1)[0];
    this.saveToStorage();
    
    return { ...deletedStudent };
  }

  // Additional utility methods
  async getByMajor(major) {
    await this.delay();
    return this.students.filter(s => 
      s.major.toLowerCase().includes(major.toLowerCase())
    );
  }

  async getByYear(year) {
    await this.delay();
    return this.students.filter(s => s.year === year);
  }

  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.students.filter(s =>
      s.name.toLowerCase().includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm) ||
      s.major.toLowerCase().includes(searchTerm)
    );
  }

  async getStats() {
    await this.delay();
    const stats = {
      total: this.students.length,
      byMajor: {},
      byYear: {},
      averageGpa: 0
    };

    let totalGpa = 0;
    let gpaCount = 0;

    this.students.forEach(student => {
      // Count by major
      stats.byMajor[student.major] = (stats.byMajor[student.major] || 0) + 1;
      
      // Count by year
      stats.byYear[student.year] = (stats.byYear[student.year] || 0) + 1;
      
      // Calculate average GPA
      if (student.gpa > 0) {
        totalGpa += student.gpa;
        gpaCount++;
      }
    });

    stats.averageGpa = gpaCount > 0 ? totalGpa / gpaCount : 0;

    return stats;
  }
}

// Export singleton instance
export const studentsService = new StudentsService();