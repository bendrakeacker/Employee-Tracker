const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "drake21300",
    database: "employees_db"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    console.log(`
    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝
    
    ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░
    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗
    ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝
    ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
    ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║
    ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝ \n\n`);
    main();
});

const employees = [];
const dept = [];
const roles = [];

const mainQ = [
    {
        type: "list",
        message: "What task would you like to do?",
        name: "action",
        choices: ["ADD dept", "VIEW all dept", "ADD role", "VIEW roles", "ADD employee", "VIEW employees", "UPDATE role", "EXIT"]
    }
];

const employeeQset = [
    {
        type: "input",
        message: "Employee's first name:",
        name: "first_name"
    },
    {
        type: "input",
        message: "Employee's last name: ",
        name: "last_name"
    }
];

const roleQset = [
    {
        type: "input",
        message: "Role title:",
        name: "role_title"
    },
    {
        type: "input",
        message: "Role salary: ",
        name: "role_salary"
    },
    {
        type: "list",
        message: "What department is this role in?",
        name: "role_dept",
        choices: dept
    }
];

const deptQset = [
    {
        type: "input",
        message: "Dept name: ",
        name: "dept_name"
    }
];

const main = () => {
    inquirer.prompt(mainQ).then(choice => {
        switch (choice.action) {
            case "ADD dept":
                addDept();
                break;
            case "VIEW all dept":
                viewDept();
                break;
            case "ADD role":
                addRole();
                break;
            case "VIEW roles":
                viewRole();
                break;
            case "ADD employee":
                addEmployee();
                break;
            case "VIEW employees":
                viewEmployee();
                break;
            case "UPDATE role":
                updateEmployee();
                break;
            case "EXIT":
                connection.end();
        }
    });
}

const addDept = () => {
    inquirer.prompt(deptQset).then(dept_res => {
        console.log(dept_res);
        connection.query("SELECT name FROM employees_db.dept WHERE name = ?", [dept_res.dept_name], function (err, res) {
            if (err) throw err;

            if (res.length === 0) {
                connection.query("INSERT INTO dept SET ?",
                    {
                        name: dept_res.dept_name
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affected_rows + " dept added");

                        main();
                    });
            } else {
                console.log("dept already established.")
                main();
            }
        });
    });
}

const viewDept = () => {
    connection.query("SELECT * FROM employees_db.dept", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    });
}

const addRole = () => {
    connection.query("SELECT * FROM employees_db.dept", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            dept.push(res[i].name);
        }
        inquirer.prompt(roleQset).then(role_res => {
            connection.query("SELECT id FROM employees_db.dept WHERE name = ?", [role_res.role_dept], function (err, res) {
                if (err) throw err;
                connection.query("INSERT INTO role SET ?",
                    {
                        title: role_res.role_title,
                        salary: role_res.role_salary,
                        dept_id: res[0].id

                    }, function (err, res) {
                        if (err) throw err;
                        console.log(res.affected_rows + " role created!");
                        main();
                    });
            });
        });
    });
}

const viewRole = () => {
    connection.query("SELECT * FROM employees_db.role", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    });
}

const addEmployee = () => {
    inquirer.prompt(employeeQset).then(employee_res => {
        connection.query("SELECT * FROM employees_db.role", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                roles.push(res[i].title);
            }
            inquirer.prompt([
                {
                    type: "list",
                    message: "What is this employee's role?",
                    name: "employee_role",
                    choices: roles
                }
            ]).then(employee_role => {
                connection.query("SELECT id FROM employees_db.role WHERE title = ?", [employee_role.employee_role], function (err, res) {
                    if (err) throw err;
                    console.log(employee_res);
                    console.log(res);
                    let roleID = res[0].id;
                    connection.query("SELECT * FROM employees_db.employee", function (err, res) {
                        if (err) throw err;
                        for (let i = 0; i < res.length; i++) {
                            let full_name = `${res[i].first_name} ${res[i].last_name}`;
                            employees.push(full_name);
                        }
                        inquirer.prompt([
                            {
                                type: "list",
                                message: "Who is this employee's manager?",
                                name: "employee_mgmt",
                                choices: employees
                            }
                        ]).then(mgmt_name => {
                            let name_arr = mgmt_name.employee_mgmt.split(" ");
                            let first = name_arr[0];
                            let last = name_arr[1];
                            connection.query("SELECT id FROM employees_db.employee WHERE first_name = ? AND last_name = ?", [first, last], function (err, res) {
                                if (err) throw err;
                                connection.query("INSERT INTO employee SET ?",
                                    {
                                        first_name: employee_res.first_name,
                                        last_name: employee_res.last_name,
                                        role_id: roleID,
                                        mgmt_id: res[0].id
                                    }, function (err, res) {
                                        if (err) throw err;
                                        console.log(res.affected_rows + " employee created!");
                                        main();
                                    });
                            });
                        });
                    });
                });
            });

        });
    });
}

const viewEmployee = () => {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name FROM employees_db.employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    });
}

const updateEmployee = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Select an employee to update",
            name: "full_name",
            choices: employees
        },
        {
            type: "input",
            message: "Select a new role for this employee",
            name: "new_role",
            choices: roles
        }
    ]).then(new_data => {
        console.log(new_data);
        main();
    });
}