const mysql = require('mysql2');
// const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Express middleware
// const PORT = process.env.PORT || 3001;
// const app = express();

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
      if (err) throw err;
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
