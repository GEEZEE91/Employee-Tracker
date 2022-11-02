use ems_db;

-- departments other dept's legal, marketing, customer service ect --

INSERT INTO department (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('HR'),
    ('Finance');

-- roles --
INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Manager', 120000.00, 1),
    ('Salesperson', 85000.00, 1),
    ('Lead Engineer Manager', 150000.00, 2),
    ('Software Engineer', 120000.00, 2),
    ('Graduate Engineer', 70000.00, 2),
    ('HR Manager', 80000.00, 3),
    ('Accounts Assistant', 65000.00, 4),
    ('Accountant', 125000.00, 4);


-- employees --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Frank', 'Mitchell', 1, NULL), -- Sales Manager --
    ('Tim', 'Anderson', 3, NULL), -- Lead Engineer Manager --
    ('Fiona', 'Smith', 8, NULL), -- Accountant--
    ('Jim', 'James', 2, 1),
    ('Marco', 'Jones', 4, 2),
    ('Kevin', 'Patterson', 5, 2),
    ('Jemma', 'Kerr', 7 , 3) ;

-- Selects all columns from each table in database --
SELECT * FROM employee;
SELECT * FROM roles;
SELECT * FROM department;

