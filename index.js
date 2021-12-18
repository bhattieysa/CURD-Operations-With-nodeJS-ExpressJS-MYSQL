const mysql = require('mysql')
const express = require('express')
const app = express();
const bodyparser = require('body-parser')
const port = process.env.PORT || 5000
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())



const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'EmployeeDB'

})

//Select all data from database
app.get('/select', function (req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as id ${connection.threadId}`)
        connection.query('SELECT * FROM employee', (err, rows, fields) => {
            connection.release // return the connect to pool
            if (!err)
                res.send(rows)
            else
                console.log(err)
        })
    })
})
//select particular data using where
app.get('/select:id', function (req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as id ${connection.threadId}`)
        connection.query('SELECT * FROM employee WHERE empID= ?', [req.params.id], (err, rows, fields) => {
            connection.release // return the connect to pool
            if (!err)
                res.send(rows)
            else
                console.log(err)
        })
    })
})
// delete particular data
app.delete('/delete:id', function (req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as id ${connection.threadId}`)
        connection.query('DELETE  FROM employee WHERE empID= ?', [req.params.id], (err, rows, fields) => {
            connection.release // return the connect to pool
            if (!err)
                res.send(`Employee with employee id:${req.params.id}has been removed`)
            else
                console.log(err)
        })
    })
})
// Add  data
app.post('/add', function (req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as id ${connection.threadId}`)
        const params = req.body


        connection.query('INSERT INTO employee SET ?', params, (err, rows, fields) => {
            connection.release // return the connect to pool
            if (!err)
                res.send(`Employee with employee name:${params.Name}has been added`)
            else
                console.log(err)
        })
    })

    console.log(req.body)

})
//Update The Data
app.put('/update', function (req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as id ${connection.threadId}`)

        const { empID, Name, EmpCode, Salary } = req.body


        connection.query('UPDATE employee SET name=? WHERE empID = ?', [Name, empID], (err, rows, fields) => {
            connection.release // return the connect to pool
            if (!err)
                res.send(`Employee with employee name:${Name}has been added`)
            else
                console.log(err)
        })
    })

    console.log(req.body)

})
app.listen(port, () => console.log(`Express Server is running at port no ${port}`))