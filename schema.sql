DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE dept (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT NOT NULL
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    mgmt_id INT
);

INSERT INTO dept (name) VALUES ("test dept");

INSERT INTO role (title, salary, dept_id) VALUES ("manager", 2000000, 1), ("intern", 40000, 1);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Ben", "Test1", 1);

INSERT INTO employee (first_name, last_name, role_id, mgmt_id) VALUES ("Jen", "Test2", 2, 1);