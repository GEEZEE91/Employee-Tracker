const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");
const figlet = require("figlet");

process.on("warning", (e) => console.warn(e.stack));

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "root",
  database: "ems_db",
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as ID: " + connection.threadId);
  figlet("Employee Management System", (err, result) => {
    console.log(err || result + "\n");
    console.log("----------------------------------------------\n");
    console.log("Built by Gina Zivkovic \n");
    console.log("Github: geezee91\n");
    console.log(
      "Using Inquirer, MySQL, Figlet, Node Package Manager and JavaScript \n"
    );
    console.log("----------------------------------------------\n");
    promptUser();
  });
});

function promptUser() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      pageSize: 20,
      message:
        "What would you like to do? -- Simply enter number assigned to action on scroll down to action--",
      choices: [
        new inquirer.Separator("---------- DEPARTMENT OPERATIONS --------"),
        "View all Departments",
        "Add Department",
        "Delete Department",
        "View total BUDGET by Department",

        new inquirer.Separator("---------- ROLE OPERATIONS --------------"),
        "View all roles",
        "Add roles",
        "Delete roles",

        new inquirer.Separator("---------- EMPLOYEE OPERATIONS ----------"),

        "View all Employees",
        "View Employees by Manager",
        "View Employees by Department",
        "Add Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Delete Employee",

        new inquirer.Separator(),
        "Exit",
      ],
    })
    .then(function (answers) {
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
        case "Exit":
          connection.end();
          break;
      }
    });
}

// view dept
function viewDepartments() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nViewing all Departments...\n");
  connection.query(
    "SELECT department.id AS id, department.department_name AS department FROM department",
    function (err, res) {
      if (err) throw err;
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("All Departments\n");
      console.log(
        "----------------------------------------------------------------"
      );
      console.table(res);
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("\nDepartments Viewed!\n");
      console.log(
        "----------------------------------------------------------------"
      );
      promptUser();
    }
  );
}

// view from roles
function viewRoles() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nViewing all Roles\n");
  connection.query(
    `SELECT roles.id, roles.title, roles.salary, department.department_name AS department
 FROM roles INNER JOIN department ON roles.department_id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("All Roles\n");
      console.log(
        "----------------------------------------------------------------"
      );
      console.table(res);
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("\nRoles Viewed!\n");
      console.log(
        "----------------------------------------------------------------"
      );
      promptUser();
    }
  );
}

// View Employees/ READ all, SELECT * FROM
function viewEmployees() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nViewing all Employees\n");
  connection.query(
    `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id`,
    function (err, res) {
      if (err) throw err;
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("All Employees\n");
      console.log(
        "----------------------------------------------------------------"
      );
      console.table(res);
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("\nEmployees viewed!\n");
      console.log(
        "----------------------------------------------------------------"
      );
      promptUser();
    }
  );
}

// INSERT department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What Department would you like to add?",
      },
    ])
    .then(({ deptName }) =>
      connection.query(
        "INSERT INTO department (department_name) VALUES (?)",
        [deptName],
        (err) => {
          if (err) throw err;
          console.log(
            "----------------------------------------------------------------"
          );
          console.log(
            "\nSuccessfully added -- " + deptName + " -- to Departments\n"
          );
          console.log(
            "----------------------------------------------------------------"
          );
          promptUser();
        }
      )
    );
}

// add role
function addRole() {
  connection.query("SELECT department_name, id FROM department", (err, res) => {
    if (err) throw err;
    const departmentList = res.map(({ department_name, id }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the new role? (DON'T inc commas)",
        },
        {
          name: "department",
          type: "list",
          message: "Select department for new role?",
          choices: departmentList,
        },
      ])
      .then(({ title, salary, department }) => {
        connection.query(
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
          [title, salary, department],
          (err, res) => {
            if (err) {
              throw err;
            }
            console.log(
              "----------------------------------------------------------------"
            );
            console.log(
              `\nSuccessfully added New Role -- ${title} - ${salary} --`
            );
            console.log(
              "----------------------------------------------------------------"
            );
            viewRoles();
            promptUser();
          }
        );
      });
  });
}

// Update Employee Role
function updateEmployeeRoles() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employeeList = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeChoice",
          message: "Select Employee, to update their Role?",
          choices: employeeList,
        },
      ])
      .then(({ employeeChoice }) => {
        const criteria = [employeeChoice];
        connection.query(
          "SELECT roles.id, roles.title FROM roles",
          (err, resp) => {
            if (err) throw err;
            const roles = resp.map(({ id, title }) => ({
              name: title,
              value: id,
            }));
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "roleChoice",
                  message: "Select employee's new Role?",
                  choices: roles,
                },
              ])
              .then(({ roleChoice }) => {
                const role = [roleChoice];
                criteria.push(role);
                const criteriaReverse = criteria.reverse();
                connection.query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  criteriaReverse,
                  (err, res) => {
                    if (err) throw err;
                    console.log(
                      "----------------------------------------------------------------"
                    );
                    console.table("Successfully Updated Employee's Role");
                    console.log(
                      "----------------------------------------------------------------"
                    );
                    promptUser();
                  }
                );
              });
          }
        );
      });
  });
}

// Update Manager
function updateEmployeeManager() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employeeList = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select Employee, to update their Manager?",
          name: "employeeList",
          choices: employeeList,
        },
      ])
      .then(({ employeeList }) => {
        const employee = [employeeList];
        const employeeAnswers = [];
        employeeAnswers.push(employee);
        connection.query(
          `SELECT *
                              FROM employee
                              where manager_id IS NULL`,
          (err, resp) => {
            const managerList = resp.map(({ id, first_name, last_name }) => ({
              value: `${id}`,
              name: `${first_name} ${last_name}`,
            }));
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Select Employee's new Manager?",
                  name: "managerList",
                  choices: managerList,
                },
              ])
              .then(({ managerList }) => {
                const manager = [managerList];
                const managerAnswers = [];
                managerAnswers.push(manager);

                connection.query(
                  `UPDATE employee
                                      SET manager_id = '${managerAnswers}'
                                      WHERE employee.id = '${employeeAnswers}'`,
                  [employeeAnswers, managerAnswers],
                  (err, res) => {
                    if (err) throw err;
                    console.log(
                      "----------------------------------------------------------------"
                    );
                    console.log("\nEmployee Manager has been Updated\n");
                    console.log(
                      "----------------------------------------------------------------"
                    );
                    promptUser();
                  }
                );
              });
          }
        );
      });
  });
}
// Delete employee
function deleteEmployee() {
  connection.query("SELECT * FROM employee", (err, res) => {
    const employees = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select employee to delete?",
          name: "empDelete",
          choices: employees,
        },
      ])
      .then(({ empDelete }) => {
        connection.query(
          "DELETE FROM employee WHERE employee.id = ?",
          [empDelete],
          (err, res) => {
            if (err) throw err;
            console.log(
              "----------------------------------------------------------------"
            );
            console.table("\nSuccessfully Deleted Employee\n");
            console.log(
              "----------------------------------------------------------------"
            );
            promptUser();
          }
        );
      });
  });
}

// Delete Department
function deleteDepartment() {
  connection.query("SELECT * FROM department", (err, data) => {
    const departments = data.map(({ id, department_name }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which Department would you like to delete?",
          choices: departments,
        },
      ])
      .then(({ department }) => {
        const criteria = [department];
        connection.query(
          `DELETE
                        FROM department
                        WHERE (department.id) = (?)`,
          [criteria],
          (err, result) => {
            if (err) throw err;
            console.log(`result: ${result}`);
            console.log("\nSuccessfully Deleted Department\n");
            console.log(
              "----------------------------------------------------------------"
            );
            viewDepartments();
            promptUser();
          }
        );
      });
  });
}

// Delete Role
function deleteRole() {
  connection.query("SELECT roles.id, roles.title FROM roles", (err, res) => {
    const roles = res.map(({ id, title }) => ({ name: title, value: id }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which Role would you like to delete?",
          choices: roles,
        },
      ])
      .then(({ role }) => {
        const criteria = [role];
        connection.query(
          "DELETE FROM roles WHERE roles.id = ?",
          criteria,
          (err, res) => {
            if (err) throw err;
            console.log(
              "----------------------------------------------------------------"
            );
            console.table("\nSuccessfully Deleted Role\n");
            console.log(
              "----------------------------------------------------------------"
            );
            promptUser();
          }
        );
      });
  });
}

// View Employees by Manager and Department
function viewEmployeesByManager() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nView Employees By Manager\n");
  console.log(
    "----------------------------------------------------------------"
  );
  connection.query(
    "SELECT employee.id AS 'Employee ID', employee.first_name AS 'Employee First Name', employee.last_name AS 'Employee Last Name', manager.id AS 'Manager ID', manager.first_name AS 'Manager First Name', manager.last_name AS 'Managers Last Name' FROM employee, employee manager WHERE employee.manager_id = manager.id",
    function (err, res) {
      if (err) throw err;
      console.log(
        "----------------------------------------------------------------"
      );
      console.table(res);
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("\nEmployees by Manager Table\n");
      console.log(
        "----------------------------------------------------------------"
      );
      promptUser();
    }
  );
}

// Make a department array
function viewEmployeeByDepartment() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nView Employees By Department\n");
  console.log(
    "----------------------------------------------------------------"
  );
  connection.query("SELECT * FROM department", (err, data) => {
    const departments = data.map(({ id, department_name }) => ({
      name: department_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you choose?",
          choices: departments,
        },
      ])
      .then(({ departmentId }) => {
        console.log("answer ", [departmentId]);
        connection.query(
          "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department_name AS department FROM employee e JOIN roles r ON e.role_id = r.id JOIN department d ON d.id = r.department_id WHERE d.id = ?",
          [departmentId],
          (err, res) => {
            if (err) throw err;
            console.log(
              "----------------------------------------------------------------"
            );
            console.table(res);
            console.log(
              "----------------------------------------------------------------"
            );
            promptUser();
          }
        );
      });
  });
}

const roleList = [];
function getRoles() {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      roleList.push(res[i].title);
    }
  });
  return roleList;
}

const managerArr = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name);
      }
    }
  );
  return managerArr;
}

// Add employee
function addEmployee() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nAdd Employee\n");
  console.log(
    "----------------------------------------------------------------"
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: getRoles(),
      },
      {
        type: "list",
        name: "managerId",
        message: "What is the employees manager's ID?",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      const rolesId = getRoles().indexOf(val.roleId) + 1;
      const managersId = selectManager().indexOf(val.managerId) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.first_name,
          last_name: val.last_name,
          manager_id: managersId,
          role_id: rolesId,
        },
        function (err) {
          if (err) throw err;
          console.table(val);
          console.log(
            "----------------------------------------------------------------"
          );
          console.table("\nSuccessfully Added Employee\n");
          console.log(
            "----------------------------------------------------------------"
          );
          promptUser();
        }
      );
    });
}

// View utilized budget by department
function viewTotalBudgetByDepartment() {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("\nViewing Budget by Departments\n");
  console.log(
    "----------------------------------------------------------------"
  );
  connection.query(
    "SELECT department.id, department.department_name, SUM(roles.salary) AS Utilized_Budget FROM employee JOIN roles on employee.role_id = roles.id JOIN department on roles.department_id = department.id GROUP BY department.id",
    (err, res) => {
      if (err) throw err;
      console.log(
        "----------------------------------------------------------------"
      );
      console.table(res);
      console.log(
        "----------------------------------------------------------------"
      );
      promptUser();
    }
  );
}
