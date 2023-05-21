INSERT INTO departments (dept_name)
VALUES  ("Corporate Leadership"),
        ("Branch Management"),
        ("Accounting"),
        ("Sales"),
        ("Human Resources"),
        ("Quality Control"),
        ("Supplier Relations"),
        ("Warehouse"),
        ("office staff"),
        ("Customer Service");

INSERT INTO roles (job_title,salary,dept_id)
VALUES  ("CEO",500000,1),
        ("Regional Manager for Scranton",60000,2),
        ("Head of Accounting", 45000,3),
        ("Accountant", 40000,3),
        ("Salesperson", 30000,4),
        ("Head of HR", 55000,5),
        ("Head of QC",45000,6),
        ("Head of SR",45000,7),
        ("Warehouse Foreman", 50000,8),
        ("Receptionist",25000,9),
        ("Temp",20000, 9),
        ("CS Representative", 35000,10);

INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES  ("David","Wallace",1,NULL),
        ("Michael", "Scott", 2, 1),
        ("Angela", "Martin", 3, 2),
        ("Kevin","Malone",4,3),
        ("Oscar","Martinez",4,3),
        ("James","Halpert",5,2),
        ("Dwight","Schrute",5,2),
        ("Stanley","Hudson",5,2),
        ("Phyllis","Vance",5,2),
        ("Toby", "Flenderson",6,1),
        ("Creed","Bratton",7,2),
        ("Meredith","Palmer",8,2),
        ("Darryl","Philbin",9,2),
        ("Pamela","Beesly",10,2),
        ("Ryan","Howard",11,2),
        ("Kelly","Kapoor",12,2);



