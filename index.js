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
                            choicesArr.push(results[i].title);
                        }
                        return choicesArr;
                    }
                    
                }
            ]).then(function(answer){
                
                let firstname = answer["first-name"];
                let lastname = answer["last-name"];

                let titleChoice = answer.choice;
               
                connection.query("SELECT id FROM role WHERE title = ?", titleChoice, function(err,results){
                    if (err) throw err;
                    
                    let roleId = results[0].id;
                    connection.query("INSERT INTO employee SET ?", 
                    {
                        first_name: firstname,
                        last_name: lastname,
                        role_id: roleId
                    },
                    function(err){
                        if (err) throw err;
                        runSearch();
                    }
                    )
                   
                });
                

            }).catch (function (err){
                console.log(err);
            })
    });
    
}

function removeEmployee(){
    connection.query("SELECT * FROM employee", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    message: "Choose an employee to remove",
                    type: "rawlist",
                    choices: function(){
                        var choicesArr = [];
                        for (let i = 0; i < results.length; i++){
                            choicesArr.push({name: results[i].first_name + " " + results[i].last_name, value: results[i]} );
                        }
                        return choicesArr;
                    }
                    
                }
            ]).then(function(answer){
                console.log(answer);
                let employeeId = answer.choice.id;
                console.log(employeeId);
                connection.query("DELETE FROM employee WHERE id = ?", employeeId, function (err,results){
                    if (err) throw err;
                    runSearch();
                })
            })
        
    });
}
function updateRole(){
    connection.query("SELECT * FROM employee", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    message: "Choose an employee to update",
                    type: "rawlist",
                    choices: function(){
                        var choicesArr = [];
                        for (let i = 0; i < results.length; i++){
                            choicesArr.push({name: results[i].first_name + " " + results[i].last_name, value: results[i]} );
                        }
                        return choicesArr;
                    }
                    
                }
            ]).then(function(answer){
                console.log(answer);
                let employeeId = answer.choice.id;
                console.log(employeeId);
                connection.query("SELECT * FROM role", function(err, results){
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "choice",
                                type: "rawlist",
                                message: "Choose a role to update to: ",
                                choices: function(){
                                    var choicesArr = [];
                                    for (let i = 0; i < results.length; i++){
                                     choicesArr.push({name: results[i].title, value: results[i]})
                                    }
                                return choicesArr;
                                }
                            }
                        ]).then(function(answer){
                            console.log(answer);
                            let roleChoice = answer.choice.id;
                            console.log(roleChoice);
                            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleChoice, employeeId], function(err,results){
                                if (err) throw err;
                                runSearch();
                            })
                        })
                })
                
            })
        
    });

}