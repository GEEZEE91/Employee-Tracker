const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');

let roleList = [];
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

//view dept's
function viewDepartments(){
  console.log('Viewing all Departments...\n');
  var query =
  `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log('----------------------------------------------------------------');
    console.log('All Departments\n');
    console.log('----------------------------------------------------------------');
    console.table(res);
    console.log("Departments Viewed!\n");

    promptUser();
  })};

//view from roles
function viewRoles() {
  console.log(`Viewing all Roles`);
  var query =
  `SELECT roles.id, roles.title, roles.salary, department.department_name AS department
               FROM roles
               INNER JOIN department ON roles.department_id = department.id`;
 connection.query(query, function (err, res) {
  if (err) throw err;
  console.log('----------------------------------------------------------------');
  console.log('All Roles\n');
  console.log('----------------------------------------------------------------');

      console.table(res);
      console.log("Roles Viewed!\n");  
      promptUser();
  });
}



//View Employees/ READ all, SELECT * FROM
function viewEmployees () {
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
      console.log('----------------------------------------------------------------');
      console.log('All Employees\n');
      console.log('----------------------------------------------------------------');
      console.table(res);
      console.log("Employees viewed!\n");
  
      promptUser();
    });
 
  };
// INSERT INTO department
 function addDepartment() {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "What Department would you like to add?",
            validate: deptName => {
              if (deptName) {
                  return true;
              } else {
                  console.log('Please enter a department');
                  return false;
              }
            }
        }
    ]).then(res =>{
        connection.query(`INSERT INTO department (department_name)VALUES (?)`, res.deptName, (err, results) => {
            if (err) throw err;
            console.log('----------------------------------------------------------------');
            console.log ("Successfully added -- " + res.deptName + " -- to Departments");
            console.log('----------------------------------------------------------------');
            promptUser();
        });
    });
  };

//INSERT into roles
//display department list to add role to or department to delete
function getDepartments() {
    return new Promise ((resolve, rejects) => {
        connection.query(`SELECT department_name, id FROM department`, (err, res) => {
            if (err) throw err;
            const departmentList =  res.map(({ department_name, id }) => ({ name: department_name, value: id }))
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
    ]).then(({ title, salary, department}) => {
        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, department], (err, res) => {
            if (err) {
                throw err;
            }
            console.log('----------------------------------------------------------------');
            console.log(`\nSuccessfully added New Role -- ${title} - ${salary} --`);
            console.log('----------------------------------------------------------------');
            promptUser();
        });    
    });
  }



function updateEmployeeRoles() {
    connection.query( `SELECT * FROM employee`, (err, res) => {
      if (err) throw err;
        const employeesList = res.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}))
        inquirer.prompt([
            {
                type:'list',
                name: 'employee',
                message: "Which employee's role would you like to change?",
                choices: employeesList
            }
        ])
        .then (employeeChoice =>{
            const criteria = [employeeChoice.employee];
            connection.query(`SELECT roles.id, roles.title FROM roles`, (err, resp) => {
                const roles = resp.map(({id, title}) => ({name: title, value:id}));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's new role?",
                        choices: roles
                    },
                ])
                .then (roleChoice =>{
                    const role = roleChoice.role;
                    criteria.push(role);
                    const criteriaReverse = criteria.reverse();
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, criteriaReverse, (err, res) =>
                    { if (err) throw err;
                      console.log('----------------------------------------------------------------');
                      console.table(`Successfully updated Employee's Role`);
                      console.log('----------------------------------------------------------------');
                      viewEmployees();
                      promptUser();
                    }) 
                })
            })

            
        })
    })

}

//Update Manager
function updateEmployeeManager() {
  connection.query('SELECT * FROM employee', (err, res) =>{
    const employeeList = res.map(({id, first_name, last_name}) =>({name: first_name + " " + last_name, value:id}));
  inquirer.prompt([
      {
          type: "list",
          message: "Please enter the employeeID to update their manager?",
          name: "employee",
          choices: employeeList

      },
    ]).then(empChoice => {
      const employee = empChoice.employee;
      const params = []; 
      params.push(employee);
      connection.query(`SELECT * FROM employee`, (err, res) => {
          const managerList = res.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value:id}));
     
          inquirer.prompt([
          {
          type: "list",
          message: "Please enter the new Manager",
          name: "manager",
          choices: managerList
      }
  ]) .then(managerChoice => {
    const manager = managerChoice.manager;
    params.push(manager); 
    
    let employee = params[0]
    params[0] = manager
    params[1] = employee 
    
    connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, params, (err, result) => {
      if (err) throw err;
    console.log("Employee has been updated!");
  
    viewEmployees();
    promptUser();

});})})
})})
};

// Delete employee
function deleteEmployee() {
    connection.query('SELECT * FROM employee', (err, res) =>{
        const employees = res.map(({id, first_name, last_name}) =>({name: first_name + " " + last_name, value:id}));
  inquirer.prompt([
      {
          type: "list",
          message: "Select employee to delete?",
          name: "empDelete",
          choices: employees 
      }
  ]).then(function (res) {
      connection.query("DELETE FROM employee WHERE employee.id = ?", [res.empDelete], (err, res) => {
          if (err) throw err;
          console.table(`Successfully deleted employee`);
          promptUser();
      });
  });
})}

// Delete Department
function deleteDepartment() {
  connection.query(`SELECT * FROM department`, (err, data) => {
  const departments = data.map(({id,  department_name}) =>({name:  department_name, value: id}));
  inquirer.prompt([
      {
          type: 'list',
          name: 'department',
          message: "Which Department would you like to delete?",
          choices: departments
      }
  ])
  .then (departmentChoice => {
      const criteria = [departmentChoice.department];
      connection.query(`DELETE FROM department WHERE department.id = ?`, criteria, (err, result) => {
        if (err) throw err;
          console.log("You have deleted department");
          promptUser();

         })
      })
  })
}

function getRoles() {
    connection.query("SELECT * FROM roles", function(err, res) {
      if (err) throw err
      for (var i = 0; i < res.length; i++) {
        roleList.push(res[i].title); }
        })
        return roleList;
      };

var managersArr = [];
 function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
     if (err) throw err
        for (var i = 0; i < res.length; i++) {
         managersArr.push(res[i].first_name); }
          })
          return managersArr;
        };

// Delete Role
 function deleteRole() {
          connection.query(`SELECT roles.id, roles.title FROM roles`, (err, res) =>{
              const roles = res.map(({id, title}) => ({name: title, value:id}));
              inquirer.prompt([
              {
                  type: 'list',
                  name: 'role',
                  message: "Which Role would you like to delete?",
                  choices: roles
              }
              ])
              .then (roleChoice =>{
                  const criteria = [roleChoice.role];
                  connection.query(`DELETE FROM roles WHERE roles.id = ?`, criteria, (err, res) =>{
                        if (err) throw err;
                      })
           console.log('----------------------------------------------------------------');
           console.table(`Successfully deleted Role`);
           console.log('----------------------------------------------------------------');
           promptUser();
     
                  })
              })
          }
      
        
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
async function viewEmployeeByDepartment() {
  await getDepartments();
    inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you choose?",
          choices: departmentList
        }
      ])
      .then(function (answer) {
        console.log("answer ", answer.departmentId);
  
        connection.query(`SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department_name AS department 
        FROM employee e
        JOIN roles r
          ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`, answer.departmentId, function (err, res) {
          if (err) throw err;
          
          console.table("response ", res);  
          promptUser();
        });
      });
  }
  
  
  // Add employee 
  async function addEmployee() {

    console.log('----------------------------------------------------------------');
    console.log("Add Employee");
    console.log('----------------------------------------------------------------');

    inquirer.prompt([
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
          choices: getRoles()
        
        }, 
         {
          type: "list",
          name: "managerId",
          message: "What is the employees manager's ID?",
          choices: selectManager()
       
      }
      ]).then(function (val) {
        var roleId = getRoles().indexOf(val.roleId) + 1
        var managerId = selectManager().indexOf(val.managerId) + 1
        connection.query("INSERT INTO employee SET ?", 
        {
            first_name: val.first_name,
            last_name: val.last_name,
            manager_id: managerId,
            role_id: roleId
            
        }, function(err){
            if (err) throw err
            console.table(val)

            console.log('----------------------------------------------------------------');
            console.table("Successfully Added Employee");
            console.log('----------------------------------------------------------------');
            promptUser()
          });
      })}
  



//View utilized budget by department
function viewTotalBudgetByDepartment() {
  console.log(`Viewing Budget by Departments`);
  connection.query("SELECT department.id, department.department_name, SUM(roles.salary) AS Utilized_Budget FROM employee JOIN roles on employee.role_id = roles.id JOIN department on roles.department_id = department.id GROUP BY department.id", (err, res) => {
      if (err) throw err;
      console.log('----------------------------------------------------------------');
      console.table(res);
      console.log('----------------------------------------------------------------');
      promptUser();
  })}