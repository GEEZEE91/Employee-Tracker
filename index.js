const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');

let roleList = [];
let employeeList = [];
let managerList = [];
let departmentList = [];

// Connect to database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root',
      database: 'ems_db'
    },
  );
  
  connection.connect((err) => {
    if (err) {
        console.error("error connecting: "+err.stack);
        return;
    }
    console.log("connected as ID: "+connection.threadId);
    figlet('Employee Management System', (err,result) => {
        console.log(err || result+"\n");
        console.log("----------------------------------------------\n");
        console.log("Built by Gina Zivkovic \n");
        console.log("Github: geezee91\n");
        console.log("Using Inquirer, MySQL, Figlet, Node Package Manager and JavaScript \n")
        console.log("----------------------------------------------\n");
  promptUser();
});});

function promptUser() {
  inquirer.prompt({
      name: "action",
      type: "rawlist",
      pageSize: 20,
      message: "What would you like to do? -- Simply enter number assigned to action on scroll down to action--",
      choices: [
        new inquirer.Separator('---------- DEPARTMENT OPERATIONS --------'),
        "View all Departments",
        "Add Department",
        "Delete Department",
        "View total BUDGET by Department",

        new inquirer.Separator('---------- roles OPERATIONS --------------'),
          "View all roles",
          "Add roles",
          "Delete roles",

          new inquirer.Separator('---------- EMPLOYEE OPERATIONS ----------'),

          "View all Employees",
          "View Employees by Manager",
          "View Employees by Department",
          "Add Employee",
          "Update Employee roles",
          "Update Employee Manager",
          "Delete Employee",

          new inquirer.Separator(),
          "Exit"
      ]

  }).then(function (answers) {
      switch (answers.action) {
        case "View all Departments":
              viewDepartments();
              break;
        case "Add Department":
                addDepartment();
                break;
        case "Delete Department":
                deleteDepartment();
                break;
        case "View total BUDGET by Department":
                viewTotalBudgetByDepartment();
                 break;


        case "View all roles":
              viewRoles();
              break;
        case "Add roles":
                addRole();
                break;
        case "Delete roles":
                deleteRole();
                break;


        case "View all Employees":
              viewEmployees();
              break;
        case "View Employees by Manager":
                viewEmployeesByManager();
                break;
          
        case "Add Employee":
              addEmployee();
              break;

        case "Update Employee roles":
                updateEmployeeRoles();
                 break;
          
        case "Update Employee Manager":
              updateEmployeeManager();
              break; 
        
              case "View Employees by Department":
                viewEmployeeByDepartment();
                break; 


          case "Delete Employee":
              deleteEmployee();
              break;
       
        
          case "Exit":
              connection.end();
              break;
      }
  });
}


//Select from department
function viewDepartments() {
  console.log(`Viewing all Departments`);
  connection.query("select * from department", (err, res) => {
      if (err) throw err;
      console.table(res);
      promptUser();
  });
}

//Select from roles
function viewRoles() {
  console.log(`Viewing all roles`);
  connection.query("select * from roles", (err, res) => {
      if (err) throw err;
      console.table(res);
      promptUser();
  });
}
//Select from employee
// function viewEmployees() {
//   console.log(`Viewing all Employees`);
//   connection.query("select * from employee", (err, res) => {
//       if (err) throw err;
//       console.table(res);
//       promptUser();
//   });
// }

//View Employees/ READ all, SELECT * FROM
function viewEmployees() {
    console.log("Viewing employees\n");
  
    var query =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN roles r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Employees viewed!\n");
  
      firstPrompt();
    });
  
  }
// INSERT INTO department
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        // console.log(res);
        connection.query("INSERT INTO department SET ?", { department_name: res.deptName }, (err, res) => {
            if (err) throw err;
            console.table(`Successfully added ${deptName}`);
            promptUser();
        });
    });
  }

//INSERT into roles
//display department list to add role to or department to delete
function getDepartments() {
    return new Promise ((resolve, rejects) => {
        connection.query("SELECT department_name FROM department;", (err, res) => {
            if (err) {
                throw err;
            }
            for (let i = 0; i < res.length; i++) {
            departmentList.push(res[i].department_name);
            }
            resolve(departmentList);
        });
    });
  }
  //add role
  async function addRole() {
    await getDepartments();
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the new role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for the new role? (DON'T inc commas)"
        },
        {
            name: "department",
            type: "list",
            message: "Select department for new role?",
            choices: departmentList
        }
    ]).then(({ title, salary, department }) => {
        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE department_name = ?));", [title, salary, department], (err, res) => {
            if (err) {
                throw err;
            }
            console.log(`\nNew role successfully added -- ${title} - ${salary} - ${department}\n`);
            promptUser();
        });    
    })
  }

// Add Employee
function addEmployee() {
  inquirer.prompt([{
      type: "input",
      name: "firstName",
      message: "What is the employees first name?"
  },
  {
      type: "input",
      name: "lastName",
      message: "What is the employees last name?"
  },
  {
      type: "list",
      name: "rolesId",
      message: "What is the employees roles ID?",
      choices: roleList
  },
  {
      type: "number",
      name: "managerId",
      message: "What is the employees manager's ID?",
   
  }
  ]).then(function (res) {
      connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.rolesId, res.managerId], (err, data) => {
          if (err) throw err;
          console.table("Successfully Added employee");
          promptUser();
      });
  });
}

function updateEmployeeRoles() {
  inquirer.prompt([
      {
          type: "input",
          message: "Please select the employeeID to update their roles?",
          name: "employee_Id",
          choices: roleList
      }, {
          type: "number",
          message: "enter the new roles ID:",
          name: "role_id",
          choices: roleList
      }
  ]).then(function (res) {
      connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role_id, res.employee_Id], (err, data) => {
          if (err) throw err;
          console.table(`Successfully updated Employee's roles`);
          promptUser();
      });
  });
}

function updateEmployeeManager() {
  inquirer.prompt([
      {
          type: "input",
          message: "Please enter the employeeID to update their manager?",
          name: "employee_Id"
      }, {
          type: "number",
          message: "Please enter the new Manager's ID:",
          name: "manager_id"
      }
  ]).then(function (res) {
      connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [res.manager_id, res.employee_Id], (err, data) => {
          if (err) throw err;
          console.table(`Successfully updated Employee's Manager`);
          promptUser();
      });
  });
}

function deleteEmployee() {
  inquirer.prompt([
      {
          type: "input",
          message: "What is the ID of the employee you want to delete?",
          name: "idDelete"
      }
  ]).then(function (res) {
      connection.query("DELETE FROM employee WHERE id = ?", [res.idDelete], (err, data) => {
          if (err) throw err;
          console.table(`Successfully deleted employee by ID`);
          promptUser();
      });
  });
}

// Delete Department
async function deleteDepartment() {
    await getDepartments();
    inquirer.prompt([
        {
            name: "department",
            type: "list",
            message: "What department would you like to delete?",
            choices: departmentList
        }
    ]).then(function (res) {
                connection.query("DELETE FROM department WHERE department_name = ?", [res.department], (err, data) => { 
                  if (err) throw err;
            console.table(`Successfully deleted department`);
            promptUser();
   })})};

function getRoles() {
    return new Promise((resolve, rejects) => {
        connection.query("SELECT title FROM roles;", (err, res) => {
            if (err) {
                throw err;
            }
            for (let i = 0; i < res.length; i++) {
                roleList.push(res[i].title);
            }
            resolve(roleList);
        });
    });
  }
  
  async function deleteRole() {
    await getRoles();
    inquirer.prompt([
        {
            name: "deleteRole",
            type: "list",
            message: "What role would you like to delete?",
            choices: roleList
        }
    ]).then(function (res) {
                connection.query("DELETE FROM roles WHERE title = ?", [res.deleteRole], (err, data) => { 
                  if (err) throw err;
            console.table(`Successfully deleted Role`);
            promptUser();
   })})};
  

//View Employees by Manager and Department
function viewEmployeesByManager() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.department_name AS department, roles.salary FROM employee JOIN roles on employee.role_id = roles.id JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      promptUser();
  });
}

// Make a department array
function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");
  
    var query =
      `SELECT d.id, d.department_name, r.salary AS budget
    FROM employee e
    LEFT JOIN roles r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.department_name`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      const departmentChoices = res.map(data => ({
        value: data.id, name: data.name
      }));
  
      console.table(res);
      console.log("Department view succeed!\n");
  
      promptDepartment(departmentChoices);
    });
  }
  
  // User choose the department list, then employees pop up
  function promptDepartment(departmentChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you choose?",
          choices: departmentChoices
        }
      ])
      .then(function (answer) {
        console.log("answer ", answer.departmentId);
  
        var query =
          `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department 
    FROM employee e
    JOIN roles r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    WHERE d.id = ?`
  
        connection.query(query, answer.departmentId, function (err, res) {
          if (err) throw err;
  
          console.table("response ", res);
          console.log(res.affectedRows + "Employees are viewed!\n");
  
          promptUser();
        });
      });
  }
  
  
  // Make a employee array
  function addEmployee() {
    console.log("Inserting an employee!")
  
    var query =
      `SELECT r.id, r.title, r.salary 
        FROM roles r`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      const roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
      }));
  
      console.table(res);
      console.log("RoleToInsert!");
  
      promptInsert(roleChoices);
    });
  }
  function promptInsert(roleChoices) {

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleChoices
        },
      ])
      .then(function (answer) {
        console.log(answer);
  
        var query = `INSERT INTO employee SET ?`
        connection.query(query,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log(res.insertedRows + "Inserted successfully!\n");
  
            promptUser();
          });
      });
  }
//View utilized budget by department
function viewTotalBudgetByDepartment() {
  console.log(`Viewing Budget by departments`);
  connection.query("SELECT department.id, department.department_name, SUM(roles.salary) AS Utilized_Budget FROM employee JOIN roles on employee.role_id = roles.id JOIN department on roles.department_id = department.id GROUP BY department.id", (err, res) => {
      if (err) throw err;
      console.table(res);
      promptUser();
  });
}


 promptUser();15