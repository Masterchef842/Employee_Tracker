const inquirer = require("inquirer");
require('dotenv').config();
const cTable = require('console.table');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});
//const { default: Choice } = require("inquirer/lib/objects/choice");






function getPrompt() {


    inquirer.prompt([
        {
            type: "list",
            text: "What would you like to do",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an Employee Role", "Fire an employee"],
            name: "toDo"
        }

    ]).then((response) => {
        switch (response.toDo) {
            case "View all departments":
                connection.execute(
                    'SELECT * FROM departments',
                    function (err, results) {
                        console.table(results);
                    }
                )
                break;
            case "View all roles":
                connection.execute(
                    'SELECT * FROM roles INNER JOIN departments ON departments.id=roles.dept_id',
                    function (err, results) {
                        console.table(results);
                    }
                )
                break;
            case "View all employees":
                connection.execute(
                    'SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, roles.job_title, roles.salary,roles.dept_id, departments.dept_name, employee.manager_id, manager.first_name as manager_first, manager.last_name as manager_last FROM employees employee JOIN employees manager ON employee.manager_id = manager.id INNER JOIN roles ON roles.id=employee.role_id INNER JOIN departments ON departments.id=roles.dept_id',
                    function (err, results) {
                        if (err)
                            console.error(err);
                        console.table(results);
                    }
                )
                break;
            case "Add a department":
                inquirer.prompt([
                    {
                        type: 'input',
                        text: "Please enter the department name",
                        name: "department_name"
                    }]).then((response) => {
                        connection.execute(
                            'INSERT INTO employee_db.departments (dept_name) VALUES (?)',
                            [response.department_name],
                            function (err, results) {
                                if (err)
                                    console.error(err);
                                console.table(results);
                            }
                        )
                    })
                

                break;

        }


    })//.then(()=>{
    //     inquirer.prompt([
    //         {
    //             type: "list",
    //             text: "What would you like to perform another operation?",
    //             choices: ["Y","N"],
    //             name: "continue"
    //         }
    //     ]).then((response)=>{
    //         if(response.continue==='Y')
    //             getPrompt()
    //         return;
    //     })
    // });

}
getPrompt()
// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
