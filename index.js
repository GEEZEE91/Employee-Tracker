const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const figlet = require('figlet');
const chalk = require('chalk');


process.on('warning', e => console.warn(e.stack));

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
        console.log(chalk.blue.bold(`==============================================================================================`));
        console.log("Built by Gina Zivkovic \n");
        console.log("Github: geezee91\n");
        console.log("Using Inquirer, MySQL, Figlet, Node Package Manager and JavaScript \n")
        console.log(chalk.blue.bold(`==============================================================================================`));
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

        new inquirer.Separator('---------- ROLE OPERATIONS --------------'),
          "View all roles",
          "Add roles",
          "Delete roles",

          new inquirer.Separator('---------- EMPLOYEE OPERATIONS ----------'),

          "View all Employees",
          "View Employees by Manager",
          "View Employees by Department",
          "Add Employee",
          "Add Manager",
          "Update Employee Role",
          "Update Employee Manager",
          "Delete Employee",

          new inquirer.Separator(),
          "Exit"
      ],
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
        case "Update Employee Role":
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
          case "Add Manager":
              addManager();
              break;
          case "Exit":
              connection.end();
              break;
      }});}

//view dept
function viewDepartments(){
    console.log(chalk.green.bold(`====================================================================================`));
     console.log(nchalk.red.bold('Viewing all Departments'));
  connection.query(`SELECT department.id AS ID, department.department_name AS Department FROM department`, function (err, res) {
    if (err) throw err;
      console.log(chalk.green.bold(`====================================================================================`));
      console.log(chalk.green.bold(`====================================================================================`));
    console.table(res);
      console.log(chalk.green.bold(`====================================================================================`));
    console.log("\nDepartments Viewed!\n");
      console.log(chalk.green.bold(`====================================================================================`));
    promptUser();
  });}

//view from roles
function viewRoles() {
    console.log(chalk.green.bold(`====================================================================================`));
console.log(`\nViewing all Roles\n`);
 connection.query(`SELECT roles.id As ID, roles.title AS Title, CONCAT('$', Format(roles.salary, 2))  AS "Salary", department.department_name AS Department
 FROM roles INNER JOIN department ON roles.department_id = department.id`, function (err, res) {
     if (err) throw err;
     console.log(chalk.green.bold(`====================================================================================`));
     console.log(chalk.green.bold(`====================================================================================`));
     console.table(res);
     console.log(chalk.green.bold(`====================================================================================`));
     console.log("\nRoles Viewed\n");
     console.log(chalk.green.bold(`====================================================================================`));
     promptUser();
 });}

//View Employees/ READ all, SELECT * FROM
function viewEmployees () {
    console.log(chalk.green.bold(`====================================================================================`));
  console.log("\nViewing all Employees\n");
    connection.query(`  SELECT employee_table.id AS ID, employee_table.first_name AS "First Name", employee_table.last_name AS "Last Name", department_table.department_name AS Department,
                        role_table.title AS Title, CONCAT('$', Format(role_table.salary, 2)) AS Salary,
                        CONCAT_WS(" ", manager_join.first_name, manager_join.last_name) AS Manager
                        FROM employee employee_table LEFT JOIN employee manager_join ON manager_join.id = employee_table.manager_id INNER JOIN roles role_table ON employee_table.role_id = role_table.id
                        INNER JOIN department department_table ON role_table.department_id = department_table.id
                        ORDER BY employee_table.id ASC`, function (err, res) {
      if (err) throw err;
        console.log(chalk.green.bold(`====================================================================================`));
        console.log(chalk.green.bold(`====================================================================================`));
      console.table(res);
        console.log(chalk.green.bold(`====================================================================================`));
      console.log("\nEmployees Viewed\n");
        console.log(chalk.green.bold(`====================================================================================`));
      promptUser();
    });}

// INSERT department
 function addDepartment(){
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then(({deptName}) => {
        connection.query(`INSERT INTO department (department_name) VALUES (?)`, [deptName], (err) => {
            if (err) throw err;
            console.log(chalk.green.bold(`====================================================================================`));
            console.log ("\nSuccessfully added -- " + deptName + " -- to Departments\n");
            console.log(chalk.green.bold(`====================================================================================`));
            promptUser();
        })});}

//add role
function addRole() {
    connection.query(`SELECT department_name, id FROM department`, (err, res) => {
      if (err) throw err;
      const departmentList =  res.map(({ department_name, id }) => ({ name: department_name, value: id }))
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
            if (err) {throw err;
            }
            console.log(chalk.green.bold(`====================================================================================`));
            console.log(`\nSuccessfully added New Role -- ${title} - $${salary} --`);
            console.log(chalk.green.bold(`====================================================================================`));
            promptUser();
        });    
    });
  });}

//Update Employee Role
function updateEmployeeRoles() {
    connection.query( `SELECT * FROM employee`, (err, res) => {
      if (err) throw err;
        const employeeList = res.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));
        inquirer.prompt([
            {
                type:'list',
                name: 'employeeChoice',
                message: "Select Employee, to update their Role?",
                choices: employeeList
            }
        ])
        .then (({employeeChoice}) =>{
            const criteria = [employeeChoice];
            connection.query(`SELECT roles.id, roles.title FROM roles`, (err, resp) => {
                if (err) throw err;
                const roles = resp.map(({id, title}) => ({name: title, value:id}));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleChoice',
                        message: "Select employee's new Role?",
                        choices: roles
                    },
                ])
                .then (({ roleChoice }) => {
                    const role = [roleChoice];
                    criteria.push(role);
                    const criteriaReverse = criteria.reverse();
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, criteriaReverse, (err, res) =>
                    { if (err) throw err;
                        console.log(chalk.green.bold(`====================================================================================`));
                      console.table(`Successfully Updated Employee's Role`);
                        console.log(chalk.green.bold(`====================================================================================`));
                      promptUser();
                    });
                }) });  } )});}

//Update Manager
function updateEmployeeManager() {
    connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        const employeeList = res.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }))
        inquirer.prompt([
            {
                type: "list",
                message: "Select Employee, to update their Manager?",
                name: "employeeList",
                choices: employeeList
            }
        ]).then(({employeeList}) => {
            const employee = [employeeList];
            const employeeAnswers = [];
            employeeAnswers.push(employee);
            connection.query(`SELECT *
                              FROM employee
                              where manager_id IS NULL`, (err, resp) => {
                const managerList = resp.map(({id, first_name, last_name}) => ({
                    value: `${id}`, name: `${first_name} ${last_name}`,
                }));
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Select Employee's new Manager?",
                        name: "managerList",
                        choices: managerList
                    }
                ]).then(({managerList}) => {
                    const manager = [managerList];
                    const managerAnswers = [];
                    managerAnswers.push(manager);
                    connection.query(`UPDATE employee
                                      SET manager_id = '${managerAnswers}'
                                      WHERE employee.id = '${employeeAnswers}'`, [employeeAnswers, managerAnswers], (err, res) => {
                        if (err) throw err;
                        console.log(chalk.green.bold(`====================================================================================`));
                        console.log("\nEmployee Manager has been Updated\n");
                        console.log(chalk.green.bold(`====================================================================================`));
                        promptUser();
                    });})})
        })});}
// Delete employee
function deleteEmployee() {
    connection.query('SELECT * FROM employee', (err, res) =>{
    const employees = res.map(({id, first_name, last_name}) =>({name: first_name + " " + last_name, value:id}))
  inquirer.prompt([
      {
          type: "list",
          message: "Select employee to delete?",
          name: "empDelete",
          choices: employees 
      }
  ]).then(({empDelete}) => {
      connection.query(`DELETE FROM employee WHERE employee.id = ?`, [empDelete], (err, res) => {
          if (err) throw err;
          console.log(chalk.green.bold(`====================================================================================`));
          console.table(`\nSuccessfully Deleted Employee ${empDelete}\n`);
          console.log(chalk.green.bold(`====================================================================================`));
          promptUser();
      });});
});}

// Delete Department
function deleteDepartment() {
  connection.query(`SELECT * FROM department`, (err, data) => {
  const departments = data.map(({id,  department_name}) => ({name:  department_name, value: id}))
  inquirer.prompt([
      {
          type: 'list',
          name: 'department',
          message: "Which Department would you like to delete?",
          choices: departments
      }
  ]).then(({department}) => {
      connection.query(`DELETE
                        FROM department
                        WHERE (department.id) = (?)`,
          [department],
          (err, result) => {
              if (err) throw err;
              console.log(chalk.green.bold(`====================================================================================`));
              console.log("\nSuccessfully Deleted Department\n");
              console.log(chalk.green.bold(`====================================================================================`));
             promptUser();
          })}
      )});}

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
              .then (({role}) =>{
                  connection.query(`DELETE FROM roles WHERE roles.id = ?`, [role], (err, res) => {
                      if (err) throw err;
                      console.log(chalk.green.bold(`====================================================================================`));
                      console.table(`\nSuccessfully Deleted Role\n`);
                      console.log(chalk.green.bold(`====================================================================================`));
                      promptUser();
                  }); })
              });}
      
//View Employees by Manager and Department
function viewEmployeesByManager() {
    console.log(chalk.green.bold(`====================================================================================`));
  console.log('\nView Employees By Manager\n');
    console.log(chalk.green.bold(`====================================================================================`));
    connection.query(`SELECT *
                              FROM employee
                              where manager_id IS NULL`, (err, resp) => {
        const managerList = resp.map(({id, first_name, last_name}) => ({
            value: `${id}`, name: `${first_name} ${last_name}`,
        }));
  inquirer.prompt([
      {
          type: 'list',
          name: "managerId",
          message: "Choose a Manager to view Employees?",
          choices: managerList
      }]).then(({managerId}) => {
      connection.query(` SELECT employee_table1.id AS ID, CONCAT_WS(" ",employee_table1.first_name, employee_table1.last_name) AS Manager,
                                CONCAT_WS(" ", employee_table2.first_name, employee_table2.last_name) AS Employee
                         FROM employee employee_table1 join employee employee_table2 ON employee_table1.id = employee_table2.manager_id
                         WHERE employee_table1.id = ?`, [managerId], (err, res)=> {
          if (err) throw err;
          console.log(chalk.green.bold(`====================================================================================`));
          console.table(res);
          console.log(chalk.green.bold(`====================================================================================`));
          console.log('\nEmployees by Manager Table\n');
          console.log(chalk.green.bold(`====================================================================================`));
          promptUser();
      }); })
    });}

// Make a department array
function viewEmployeeByDepartment() {
    console.log(chalk.green.bold(`====================================================================================`));
  console.log('\nView Employees By Department\n');
    console.log(chalk.green.bold(`====================================================================================`));
  connection.query(`SELECT * FROM department`, (err, data) => {
    const departments = data.map(({id,  department_name}) =>({name:  department_name, value: id}))
    inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Choose a department to view Employees?",
          choices: departments
        }
      ]).then (({departmentId}) => {
        connection.query(`SELECT e.id AS "ID", e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", CONCAT('$', Format(r.salary, 2))  AS "Salary", d.department_name AS Department FROM employee e JOIN roles r ON e.role_id = r.id JOIN department d ON d.id = r.department_id WHERE d.id = ?`, [departmentId],  (err, res)=>{
          if (err) throw err;
            console.log(chalk.green.bold(`====================================================================================`));
          console.table(res);
            console.log(chalk.green.bold(`====================================================================================`));
          promptUser();
        });
      });
  });}

  // Add employee 
function addEmployee() {
    console.log(chalk.green.bold(`====================================================================================`));
    console.log("\nAdd Employee\n");
    console.log(chalk.green.bold(`====================================================================================`));
    let roleList = [];
    function getRoles() {
        connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                roleList.push(res[i].title); }
        });
        return roleList;}
    let managerArr = [];
        connection.query(`SELECT *
                              FROM employee
                              where manager_id IS NULL`, (err, resp) => {
            const managerList = resp.map(({id, first_name, last_name}) => ({
                value: `${id}`, name: `${first_name} ${last_name}`,
            }));
            managerArr.push(managerList)
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
          message: "Select the employee's manager's ID?",
          choices: managerList
      }
      ]) .then(function (val) {
        const rolesId = getRoles().indexOf(val.roleId) + 1;
     const managersId = val.managerId;
        connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
            [
                val.first_name,
                val.last_name,
                rolesId,
                managersId
            ], function(err) {
            if (err) throw err;
            console.table(val);
            console.log(chalk.green.bold(`====================================================================================`));
            console.table(`\nSuccessfully Added Employee\n`);
            console.log(chalk.green.bold(`====================================================================================`));
            promptUser();
          });})
      });}
  
//View utilized budget by department
function viewTotalBudgetByDepartment() {
    console.log(chalk.green.bold(`====================================================================================`));
  console.log(`\nViewing Budget by Departments\n`);
    console.log(chalk.green.bold(`====================================================================================`));
  connection.query(`
      SELECT IF (GROUPING(department_table.department_name), 'Total Department Salaries', department_table.department_name) AS Department,
      CONCAT('$', Format(SUM(role_table.salary), 2)) AS "Department Salary" 
      FROM employee employee_table LEFT JOIN employee manager_join ON manager_join.id = employee_table.manager_id
      INNER JOIN roles role_table ON employee_table.role_id = role_table.id 
      INNER JOIN department department_table ON role_table.department_id = department_table.id
      GROUP BY department_table.department_name WITH ROLLUP`, (err, res) => {
      if (err) throw err;
      console.log(chalk.green.bold(`====================================================================================`));
      console.table(res);
      console.log(chalk.green.bold(`====================================================================================`));
      promptUser();
  });}

function addManager() {
    console.log(chalk.green.bold(`====================================================================================`));
    console.log("\nAdd New Manager\n");
    console.log(chalk.green.bold(`====================================================================================`));
    let rolesList = [];
    function getRole() {
        connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                rolesList.push(res[i].title); }
        });
        return rolesList;}
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
                choices: getRole()
            }
        ]) .then(function (val) {
            const rolesId = getRole().indexOf(val.roleId) + 1;
            connection.query(
                `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`,
                [
                    val.first_name,
                    val.last_name,
                    rolesId,
                ], function(err) {
                    if (err) throw err;
                    console.table(val)
                    console.log(chalk.green.bold(`====================================================================================`));
                    console.table(`\nSuccessfully Added Manager\n`);
                    console.log(chalk.green.bold(`====================================================================================`));
                    promptUser();
                });});}
