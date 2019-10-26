DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id)
	REFERENCES department(id)
        ON DELETE CASCADE
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id)
	REFERENCES role(id)
        ON DELETE CASCADE
);

INSERT INTO department (name)
VALUES ("sales"),("engineering"),("finance"),("legal");

INSERT INTO role (title, salary, department_id)
VALUES ("sales lead", 100000, 1),("salesperson", 80000, 1),("Lead Engineer", 150000, 2),("Software Engineer", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 145000, 3),("accountant", 125000, 3),("Legal Team Lead", 250000, 4),("Lawyer", 190000, 4);

INSERT INTO employee(first_name, last_name, role_id)
VALUES ("Dwight", "Shrute", 1),("Jim", "Halpert", 2),("Stanley", "Hudson", 2), ("Frank", "Yi", 3), ("Jacob", "Chow", 4);

INSERT INTO employee(first_name, last_name, role_id)
VALUES ("Oscar", "Martinez", 5),("Angela", "Martin", 6),("Judy", "Sheindlin", 7),("Petri", "Byrd", 8);