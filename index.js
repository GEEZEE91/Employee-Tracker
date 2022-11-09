const mysql = require("mysql2");
const inquirer = require('inquirer');
const chalk = require('chalk');
const consoleTable = require('console.table');
const util = require("util");

// boilerplate code
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'ems_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log(' ');
  start();
});

// promisifys the connection query and allows for async/await to be used throughout
const queryAsync = util.promisify(connection.query).bind(connection);

// prompts the user a list of choices and switches through the functions based on their answers
async function start() {
	const answer = await inquirer.prompt({
		name: 'selectOption',
		type: 'list',
		message: 'What would you like to do?',
		choices: [
			'View All Departments',
			'View All Roles',
			'View All Employees',
			'Add A Department',
			'Add A Role',
			'Add An Employee',
			'Delete A Department',
			'Delete A Role',
			'Delete An Employee',
			'Update A Role\'s Salary',
			'Update An Employee\'s Role',
			'Update An Employee\'s Manager',
			'Exit'
		]
	});
	switch (answer.selectOption) {
		case 'View All Departments':
			viewDepartments();
			break;
		case 'View All Roles':
			viewRoles();
			break;
		case 'View All Employees':
			viewEmployees();
			break;
		case 'Add A Department':
			addDepartment();
			break;
		case 'Add A Role':
			addRole();
			break;
		case 'Add An Employee':
			addEmployee();
			break;
		case 'Delete A Department':
			deleteDepartment();
			break;
		case 'Delete A Role':
			deleteRole();
			break;
		case 'Delete An Employee':
			deleteEmployee();
			break;
		case 'Update A Role\'s Salary':
			updateSalary();
			break;
		case 'Update An Employee\'s Role':
			updateRole();
			break;
		case 'Update An Employee\'s Manager':
			updateManager();
			break;
		case 'Exit':
			console.log(' ');
			connection.end();
			break;
	}
};

// console.table everything in the department table
async function viewDepartments() {
	const res = await queryAsync('SELECT * FROM department');
	const allDepartments = [];
	console.log(' ');
    for (let i of res) {
	    allDepartments.push({ ID: i.id, NAME: i.department_name });
    }
    console.table(allDepartments);
    start();
};

// console.table everything in the role table
async function viewRoles() {
	const res = await queryAsync('SELECT role.id, role.title, role.salary, department.department_name FROM role INNER JOIN department ON role.department_id  = department.id');
	const allRoles = [];
    console.log(' ');
    for (let i of res) {
	    allRoles.push({ ID: i.id, TITLE: i.title, SALARY: i.salary, DEPARTMENT: i.department_name });
    }
    console.table(allRoles);
    start();
};

// console.table everything in the employee table
async function viewEmployees() {	
	const res = await queryAsync('SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employeeName, role.title, role.salary, CONCAT(m.first_name, " ", m.last_name) AS managerName FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role ON e.role_id = role.id');
	const allEmployees = [];
	console.log(' ');
    for (let i of res) {   
	    allEmployees.push({ ID: i.id, NAME: i.employeeName, ROLE: i.title, SALARY: i.salary, MANAGER: i.managerName });
    }
	console.table(allEmployees);
    start();
};

// add the department in the department table
async function addDepartment() {
	const answer = await inquirer.prompt({
		name: 'departmentName',
		type: 'input',
		message: 'Department Name:'
	});	
	await queryAsync('INSERT INTO department SET ?', { department_name: answer.departmentName });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Department was added.');
	viewDepartments();
};

// add the role in the role table
async function addRole() {
	const res = await queryAsync('SELECT * FROM department');	
	const answer = await inquirer.prompt([
		{
			name: 'role',
			type: 'input',
			message: 'Role Name:'
		},
		{
			name: 'salary',
			type: 'input',
			message: 'Salary:',
			validate: value => {
			  if (isNaN(value) === false) return true;
			  return false;
			}
		},
		{
			name: 'department',
			type: 'list',
			message: 'Department:',
			choices: () => {
				const departments = [];
				for (let i of res) {
					departments.push(i.department_name);
				}
				return departments;
			}
		}
	]);
	let department_id ;
	for (let i of res) {
		if (i.department_name === answer.department) {
			department_id  = i.id;
  		}
	}  	      	
	await queryAsync('INSERT INTO role SET ?', { title: answer.role, salary: answer.salary, department_id : department_id  });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Role was added.');
	viewRoles();
};

// add the employee in the employee table
async function addEmployee() {
	const resR = await queryAsync('SELECT * FROM role');
	const answerR = await inquirer.prompt([
		{
			name: 'first_name',
			type: 'input',
			message: 'First Name:'
		},
		{
			name: 'last_name',
			type: 'input',
			message: 'Last Name:'
		},	
		{
			name: 'role',
			type: 'list',
			message: 'Role:',
			choices: () => {
				const roles = [];
				for (let i of resR) {
					roles.push(i.title);
				}
				return roles;
			}
		}
	]);	
	const resE = await queryAsync('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employeeName, employee.role_id, employee.manager_id FROM employee');
	const answerE = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Manager:',
		choices: () => {
			const names = ['None'];
			for (let i of resE) {
				names.push(i.employeeName);
			}
			return names;
		}
	});	
	let role_id;
	for (let i of resR) {
		if (i.title === answerR.role) {
			role_id = i.id;
  		}
	}	
	let manager_id;
	for (let i of resE) {
		if (i.employeeName === answerE.employee) {
			manager_id = i.id;
		}
	}	
	await queryAsync('INSERT INTO employee SET ?', { first_name: answerR.first_name, last_name: answerR.last_name, role_id: role_id, manager_id: manager_id});
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Employee was added.');
	viewEmployees();
};

// delete the department in the department table
async function deleteDepartment() {
	const res = await queryAsync('SELECT * FROM department');
	const answer = await inquirer.prompt({
		name: 'department',
		type: 'list',
		message: 'Department to Delete:',
		choices: () => {
			const departments = [];
			for (let i of res) {
				departments.push(i.department_name);
			}
			return departments;
		}
	});
	await queryAsync('DELETE FROM department WHERE ?', { department_name: answer.department });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Department was deleted.');
	viewDepartments();
};

// delete the role in the role table
async function deleteRole() {
	const res = await queryAsync('SELECT * FROM role');
	const answer = await inquirer.prompt({
		name: 'role',
		type: 'list',
		message: 'Role to Delete:',
		choices: () => {
			const roles = [];
			for (let i of res) {
				roles.push(i.title);
			}
			return roles;
		}
	});		
	await queryAsync('DELETE FROM role WHERE ?', { title: answer.role });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Role was deleted.');
	viewRoles();
};

// delete the employee in the employee table
async function deleteEmployee() {
	const res = await queryAsync('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employeeName, employee.role_id, employee.manager_id FROM employee');	
	const answer = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Employee to Delete:',
		choices: () => {
			const names = [];
			for (let i of res) {
				names.push(i.employeeName);
			}
			return names;
		}
	});		
	let deleteId;	
	for (let i of res) {
		if (i.employeeName === answer.employee) {
			deleteId = i.id;
		}
	}		
	await queryAsync('DELETE FROM employee WHERE ?', { id: deleteId });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Employee was deleted.');
	viewEmployees();
};

// update the salary in the role table
async function updateSalary() {
	const res = await queryAsync('SELECT * FROM role');	
	const answer = await inquirer.prompt([
		{
			name: 'title',
			type: 'list',
			message: 'Role:',
			choices: () => {
				const roles = [];
				for (let i of res) {
					roles.push(i.title);
				}
				return roles;
			}
		},
		{
			name: 'salary',
			type: 'input',
			message: 'New Salary:',
			validate: value => {
			  if (isNaN(value) === false) return true;
			  return false;
			}
		}
	]);				
	await queryAsync('UPDATE role SET salary = ? WHERE title = ?', [answer.salary, answer.title]);	
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Salary was updated.');
	viewRoles();
};

// update the role id in the employee table
async function updateRole() {
	const resE = await queryAsync('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employeeName, employee.role_id, employee.manager_id FROM employee');	
	const answerE = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Employee to Update:',
		choices: () => {
			const names = [];
			for (let i of resE) {
				names.push(i.employeeName);
			}
			return names;
		}
	});
	const resR = await queryAsync('SELECT * FROM role');	
	const answerR = await inquirer.prompt({
		name: 'role',
		type: 'list',
		message: 'New Role:',
		choices: () => {
			const roles = [];
			for (let i of resR) {
				roles.push(i.title);
			}
			return roles;
		}
	});	
	const select = await queryAsync('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employeeName, employee.role_id, role.title FROM employee INNER JOIN role ON employee.role_id = role.id');	
	let employeeId;	
	for (let i of select) {
		if (i.employeeName === answerE.employee) {
			employeeId = i.id;
		}
	}	
	let newrole_id;
	for (let i of resR) {
		if (i.title === answerR.role) {
			newrole_id = i.id;
		}
	}
	await queryAsync('UPDATE employee SET role_id = ? WHERE id = ?', [newrole_id, employeeId]);	
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Role was updated.');
	viewEmployees();
};

// update the manager id in the employee table
async function updateManager() {
	const res = await queryAsync('SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employeeName, e.manager_id, CONCAT(m.first_name, " ", m.last_name) AS managerName FROM employee e LEFT JOIN employee m ON m.id = e.manager_id');	
	const answer = await inquirer.prompt([
		{
			name: 'employee',
			type: 'list',
			message: 'Employee to Update:',
			choices: () => {
				const names = [];
				for (let i of res) {
					names.push(i.employeeName);
				}
				return names;
			}
		},
		{
			name: 'manager',
			type: 'list',
			message: 'New Manager:',
			choices: () => {
				const names = ['None'];
				for (let i of res) {
					names.push(i.employeeName);
				}
				return names;
			}
		}
	]);	
	let employeeId;
	let newmanager_id;
	for (let i of res) {
		if (i.employeeName === answer.employee) {
			employeeId = i.id;
		}
		if (i.employeeName === answer.manager) {
			newmanager_id = i.id;
		}
	}	
	await queryAsync('UPDATE employee SET manager_id = ? WHERE id = ?', [newmanager_id, employeeId]);	
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Manager was updated.');
	viewEmployees();
};