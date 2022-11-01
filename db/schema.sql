-- Drops the ems_db if it exists currently --
DROP DATABASE IF EXISTS ems_db;
-- Creates the ems_db database --
CREATE DATABASE ems_db;


-- use ems_db database --
USE ems_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL,
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
        FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
    manager_id, 
        FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT DATABASE();
