const mysql = require('mysql2');
// const express = require('express');
require("console.table");
const consoleTable  = require('console.table');

// Express middleware
// const PORT = process.env.PORT || 3001;
// const app = express();
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
    console.log(`Connected to the ems_db database.`)
  );
  
  runApp();

//Splash screen to show employee tracker
function runApp() {
  const display = ( `
=== ╔════════════════╗ ===
=== ║    EMPLOYEE    ║ ===
=== ║    DATABASE    ║ ===
=== ╚════════════════╝ ===
  `);
  console.log(display);
  promptUser();
}

function promptUser() {
  inquirer.prompt({
      name: "action",
      type: "list",
      pageSize: 20,
      message: "What would you like to do?",
      choices: [
        new inquirer.Separator('---------- DEPARTMENT OPERATIONS --------'),
        "View all Departments",
        "Add Department",
        "Delete Department",
        "View total BUDGET by Department",

        new inquirer.Separator('---------- ROLE OPERATIONS --------------'),
          "View all Roles",
          "Add Role",
          "Delete Role",

          new inquirer.Separator('---------- EMPLOYEE OPERATIONS ----------'),

          "View all Employees",
          "View Employees by Manager",
          "Add Employee",
          "Update Employee Role",
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


        case "View all Roles":
              viewRoles();
              break;
        case "Add Role":
                addRole();
                break;
        case "Delete Role":
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

        case "Update Employee Role":
                updateEmployeeRole();
                 break;
          
        case "Update Employee Manager":
              updateEmployeeManager();
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

//Select from role
function viewRoles() {
  console.log(`Viewing all roles`);
  connection.query("select * from roles", (err, res) => {
      if (err) throw err
      console.table(res);
      promptUser();
  });
}
//Select from employee
function viewEmployees() {
  console.log(`Viewing all Employees`);
  connection.query("select * from employee", (err, res) => {
      if (err) throw err;
      console.table(res);
      promptUser();
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
          console.table(`Successfully added department`);
          promptUser();
      });
  });
}


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
      connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE department_id = ?));", [title, salary, department], (err, res) => {
          if (err) {
              throw err;
          }
          console.log(`\nNew role successfully added -- ${title} - ${salary} - ${department}\n`);
          promptUser();
      });    
  })
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

 // Get the current list of roles from the database to pass into the addEmployee prompt
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


