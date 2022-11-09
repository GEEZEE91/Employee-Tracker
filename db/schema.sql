-- Drops the ems_db if it exists currently --
DROP DATABASE IF EXISTS ems_db;
-- Creates the ems_db database --
CREATE DATABASE ems_db;

-- use ems_db database --
USE ems_db;

CREATE TABLE department (
    id int AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    emp_id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id)
);


