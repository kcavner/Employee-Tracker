const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

function start() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'employee database options:',
      name: "startChoice",
      choices: [
        "view departments",
        "view roles",
        "view employees",
        "add department",
        "add role",
        "add employee",
        "update employee role",
        "exit"
      ]

    }
  ]).then(choice => {
    switch (choice.startChoice) {
      case "view departments": departmentsFn()
        break;
      case "view roles": rolesFn()
        break;
      case "view employees": employeesFn()
        break;
      case "add department": addDepartmentsFn()
        break;
      case "add role": addRolesFn()
        break;
      case "add employee": addEmployeesFn()
        break;
      case "update employee role": updateFn()
        break;
      case "exit": exitFn()
        break;
    }
  })
}
start();

function departmentsFn() {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(cTable.getTable(results));
      start();
    }
  });
}

function rolesFn() {
  db.query(`SELECT * FROM roles`, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(cTable.getTable(results));
      start();
    }
  });
}

function employeesFn() {
  db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(cTable.getTable(results));
      start();
    }
  });
}

const addDepartmentsFn = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "Enter the name of the department to add.",
        name: "addDept"
      }
    ]);

    await db.promise().query("INSERT INTO department(name) VALUES(?)", answers.addDept);

    const [rows] = await db.promise().query("SELECT * FROM department");

    console.log(cTable.getTable(rows));
    start();
  } catch (err) {
    console.log(err);
  }
};

const addRolesFn = async () => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM department");
    const deptNames = rows.map(obj => obj.name);

    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "Enter the title of the role to add.",
        name: "roleTitle"
      },
      {
        type: "input",
        message: "Enter the salary for this role.",
        name: "roleSalary"
      },
      {
        type: "list",
        message: "Enter the department this role in.",
        name: "deptName",
        choices: deptNames
      }
    ]);

    const [deptIdRows] = await db.promise().query("SELECT id FROM department WHERE name = ?", answers.deptName);
    const deptId = deptIdRows[0].id;

    await db.promise().query("INSERT INTO roles(title, salary, department_id) VALUES(?, ?, ?)", [
      answers.roleTitle,
      answers.roleSalary,
      deptId
    ]);

    start();
  } catch (err) {
    console.log(err);
  }
};

const addEmployeesFn = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "Enter the employee's first name.",
        name: "firstName"
      },
      {
        type: "input",
        message: "Enter the employee's last name.",
        name: "lastName"
      }
    ]);

    await db.promise().query("INSERT INTO employee(first_name, last_name) VALUES(?, ?)", [
      answers.firstName,
      answers.lastName
    ]);

    const [rows] = await db.promise().query("SELECT * FROM employee");

    console.log(cTable.getTable(rows));
    start();
  } catch (err) {
    console.log(err);
  }
};

const updateFn = () => {
  // Prompt the user for the employee ID, new role ID, and new manager ID
  inquirer
    .prompt([
      {
        type: 'input',
        message: "Enter the employee's ID.",
        name: 'employeeId',
      },
      {
        type: 'input',
        message: "Enter the employee's new role ID.",
        name: 'newRoleId',
      },
      {
        type: 'input',
        message: "Enter the employee's new manager ID.",
        name: 'newManagerId',
      },
    ])
    .then((answers) => {
      const { employeeId, newRoleId, newManagerId } = answers;

      db.query(
        'UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?',
        [newRoleId, newManagerId, employeeId],
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`${employeeId} has been updated.`);
          }
          start()
        }
      );
    });
};

function exitFn() {
  console.log('exiting')
  process.exit();
}
