import coursesData from "@/services/mockData/courses.json";

class CoursesService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.courses]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = this.courses.find(c => c.Id === id);
        if (course) {
          resolve({ ...course });
        } else {
          reject(new Error("Course not found"));
        }
      }, 200);
    });
  }

  async create(courseData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = this.courses.length > 0 ? Math.max(...this.courses.map(c => c.Id)) : 0;
        const newCourse = {
          Id: maxId + 1,
          ...courseData
        };
        this.courses.push(newCourse);
        resolve({ ...newCourse });
      }, 500);
    });
  }

  async update(id, courseData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.courses.findIndex(c => c.Id === id);
        if (index !== -1) {
          this.courses[index] = { ...this.courses[index], ...courseData };
          resolve({ ...this.courses[index] });
        } else {
          reject(new Error("Course not found"));
        }
      }, 500);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.courses.findIndex(c => c.Id === id);
        if (index !== -1) {
          this.courses.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Course not found"));
        }
      }, 300);
    });
  }
}

export const coursesService = new CoursesService();