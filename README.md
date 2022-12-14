# Employee-Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Description
Command-line application that acts as a employee managment system enabliong the user to view, add and update a company's employee database. The application is built  using Node.js, Inquirer, and MySQL.

The application has employeee database consists of 3 tables, departments, roles and employess on which a number of sql query's are performed based on the users responce to the command line inquirer prompts.

![image](https://user-images.githubusercontent.com/3950562/208742025-618c2553-3c0f-4e7f-bf7e-33b4e39ac235.png)

![image](https://user-images.githubusercontent.com/3950562/208741942-a03f8e1a-b4e0-4e1a-b701-b0cf4f6599c1.png)

## Usage
The application has the below functionality that can be accessed by runing npm start

 - View departments, roles and employees

 - Add departments, roles and employees (both employee's and managers)

 - View Total Budget by Department

 - Update employee role & managers.

 - View employees by manager.

 - View employees by department.
 
 - Delete departments, roles, and employees.

 - View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

![image](https://user-images.githubusercontent.com/3950562/208742143-a88516fd-4934-4f1a-8b70-e0165eaef8d0.png)

## Video Link 

The below link is a walkthrough guide on the applications functionality
https://drive.google.com/file/d/1w22h6YEMt8WDB2Y5wj1hPnS5XgvWtKD_/view

## Installation
The user should clone the repository from GitHub. 

     git clone https://github.com/GEEZEE91/Employee-Tracker.git

To connect to the database run and enter password. 

    mysql -u root -p 

Source the schema.sql.

    source db/schema.sql
    
To seed the file run source seeds.sql

    source db/seeds.sql
  
Exit mysql

Install dependencies

    npm i
  
After installations is completed, run the app with below in terminal

    npm start
    
## License
Licensed under the MIT license.

## Authors 
Gina Zivkovic

GitHub Username: @geezee91
