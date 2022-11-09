const connection = require("./connection");

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }
  // Select all departments, join with employees and roles and sum up utilized department budget
  selectAllDepartments() {
    return this.connection.query(
      `
      SELECT department.id, department.name AS department, SUM(role.salary) AS utilized_budget
      FROM department 
      LEFT JOIN role ON role.department_id = department.id
      GROUP BY department.id
      `
    );
  }

  // Select all roles, join with departments to display the department name
  selectAllRoles() {
    return this.connection.query(
      `
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
      `
    );
  }

  // Select all employees, join with roles and departments to display their roles, salaries, departments, and managers
  selectAllEmployees() {
    return this.connection.query(
      `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
      CONCAT (manager.first_name, " ", manager.last_name) AS manager
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id 
      LEFT JOIN employee manager ON manager.id = employee.manager_id
      `
    );
  }

  // Create a new department
  insertDepartment(department) {
    return this.connection.query("INSERT INTO department SET ?", department);
  }

  // Create a new role
  insertRole(role) {
    return this.connection.query("INSERT INTO role SET ?", role);
  }

  // Create a new employee
  insertEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  // Update the chosen employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      `UPDATE employee SET role_id = ? WHERE id = ?`,
      [roleId, employeeId]
    );
  }

  // Select all employees in a given department, join with roles to display role titles
  selectAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      `
      SELECT employee.id, employee.first_name, employee.last_name, role.title
      FROM employee
      LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department department on role.department_id = department.id
      WHERE department.id = ?;
      `,
      departmentId
    );
  }
}

module.exports = new DB(connection);