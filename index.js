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





function getRolesArray() {
    let roles = [];

    connection.execute(
        'SELECT * FROM roles',
        function (err, results) {

            if (err)
                console.error(err);
            else {
                for (let i = 0; i < results.length; i++) {
                    roles.push(results[i].id + " " + results[i].job_title)
                }
            }


        }
    )
    return roles;
}
function getEmployeesArray() {

    let employees = []

    connection.execute(
        'SELECT * FROM employees',
        function (err, results) {

            if (err)
                console.error(err);
            else {
                for (let i = 0; i < results.length; i++) {
                    employees.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name)
                }
            }


        }
    )
    return employees;
}
function getDepartmentsArray(){
    let departments = [];
    connection.execute(
        'SELECT * FROM departments',
        function (err, results) {

            if (err)
                console.error(err);
            else {
                for (let i = 0; i < results.length; i++) {
                    departments.push(results[i].id+" "+results[i].dept_name)
                }
                
            }


        }
    )
    return departments
}

const getPrompt = async () => {

    const employeesArray=getEmployeesArray()
    const rolesArray=getRolesArray()
    const departmentsArray=getDepartmentsArray()
    await inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do",
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
                        message: "Please enter the department name",
                        name: "department_name"
                    }]).then((response) => {
                        connection.execute(
                            'INSERT INTO employee_db.departments (dept_name) VALUES (?)',
                            [response.department_name],
                            function (err, results) {
                                if (err)
                                    console.error(err);
                                else
                                    connection.execute(
                                        'SELECT * FROM departments',
                                        function (err, results) {
                                            if (err)
                                                console.error(err);
                                            else
                                                console.table(results);
                                        }
                                    )

                            }
                        )
                    })


                break;
            case "Add a role":
               
                inquirer.prompt([
                    {
                        type: 'input',
                        message: "Please enter the role name",
                        name: "role_name"
                    },
                    {
                        type: 'input',
                        message: "Please enter the salary",
                        name: "role_salary"
                    },
                    {
                        type: 'list',
                        message: "Please choose a department",
                        choices: departmentsArray,
                        name: "role_dept"
                    }

                ]).then((response) => {
                    connection.execute(
                        'INSERT INTO employee_db.roles (job_title, salary, dept_id) VALUES (?,?,?)',
                        [response.role_name, response.role_salary, (response.role_dept.split(" ")[0])],
                        function (err, results) {
                            if (err)
                                console.error(err);
                            else
                                connection.execute(
                                    'SELECT * FROM roles',
                                    function (err, results) {
                                        if (err)
                                            console.error(err);
                                        else
                                            console.table(results);
                                    }
                                )

                        }
                    )
                })


                break;
            case "Add an employee":
                
                inquirer.prompt([
                    {
                        type: 'input',
                        message: "Please enter the employee first name",
                        name: "first_name"
                    },
                    {
                        type: 'input',
                        message: "Please enter the employee last name",
                        name: "last_name"
                    },
                    {
                        type: 'list',
                        message: "Please choose a role",
                        choices: rolesArray,
                        name: "employee_role"
                    },
                    {
                        type: 'list',
                        message: "Please choose a manager",
                        choices: employeesArray,
                        name: "employee_manager"
                    }

                ]).then((response) => {
                    connection.execute(
                        'INSERT INTO employee_db.employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                        [response.first_name, response.last_name, response.employee_role.split(" ")[0], +(response.employee_manager.split(" ")[0])],
                        function (err, results) {
                            if (err)
                                console.error(err);
                            else
                                connection.execute(
                                    'SELECT * FROM employees',
                                    function (err, results) {
                                        if (err)
                                            console.error(err);
                                        else
                                            console.table(results);
                                    }
                                )

                        }
                    )
                })
                break;
            case "Update an Employee Role":
                inquirer.prompt([
                    {
                        type: 'list',
                        message: "Please choose an employee",
                        choices: employeesArray,
                        name: "employee"
                    },

                    {
                        type: 'list',
                        message: "Please choose a role",
                        choices: rolesArray,
                        name: "employee_role"
                    },

                ]).then((response)=>{
                    connection.execute(
                        'UPDATE employee_db.employees SET role_id=? WHERE id=?',
                        [(response.employee_role.split(" ")[0]),(response.employee.split(" ")[0])],
                        function (err, results) {
                            if (err)
                                console.error(err);
                            else
                                connection.execute(
                                    'SELECT * FROM employees JOIN roles ON roles.id=employees.role_id',
                                    function (err, results) {
                                        if (err)
                                            console.error(err);
                                        else
                                            console.table(results);
                                    }
                                )

                        }
                    )
                })
                break;
            default:
                break;

        }


    })

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
