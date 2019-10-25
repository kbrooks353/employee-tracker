var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "wO7k5%HuAQvz",
  database: "employees_db"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });

function runSearch() {
inquirer
    .prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
        "View all employees",
        "View all employees by Department",
        "Add employee",
        "Remove employee",
        "Update employee role"
    ]
    })
    .then(function(answer) {
    switch (answer.action) {
    case "View all employees":
        viewEmployees();
        break;

    case "View all employees by Department":
        departmentSearch();
        break;

    case "Add employee":
        addEmployees();
        break;

    case "Remove employee":
        removeEmployee();
        break;

    case "Update employee role":
        updateRole();
        break;
    }
    });
}

// display all employees

function viewEmployees(){
    connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id", function(err, results){
        if (err) throw err;
        console.table(results);
        runSearch();
    });
}

function departmentSearch(){
    connection.query("SELECT * FROM department", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function(){
                        var choicesArr = [];
                        for (let i = 0; i < results.length; i++){
                            choicesArr.push(results[i].name);
                        }
                        return choicesArr;
                    }
                }
            ]).then(function(answer){
                switch(answer.choice){
                    case "sales":
                        return connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE department_id = 1", function(err, results){
                            if (err) throw err;
                            console.table(results);
                            runSearch();
                                                       
                    })
                    case "engineering":
                        return connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE department_id = 2", function(err, results){
                            if (err) throw err;
                            console.table(results);
                            runSearch();
                    })
                    case "finance":
                        return connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE department_id = 3", function(err, results){
                            if (err) throw err;
                            console.table(results);
                            runSearch();
                    })
                    case "legal":
                        return connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE department_id = 4", function(err, results){
                            if (err) throw err;
                            console.table(results);
                            runSearch();
                    })
                }
            });

    });
}

function addEmployees(){
    connection.query("SELECT * FROM role", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first-name",
                    type: "input",
                    message: "Enter employees first name: "
                },
                {
                    name: "last-name",
                    type: "input",
                    message: "Enter employees last name: "
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function(){
                        var choicesArr = [];
                        for (let i = 0; i < results.length; i++){
                            choicesArr.push(results[i].name);
                        }
                        return choicesArr;
                    }
                }
            ]).then(function(answer){
                console.log(answer);
            }).catch (function (err){
                console.log(err);
            })
    });
    
}