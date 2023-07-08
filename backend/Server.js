var mysql = require('mysql');
var express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors');
var sql = require("mssql")
var mysql = require('mysql');
var app = express();
var sql1 = require("msnodesqlv8")
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/getDevices', function (req, res) {
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const query = " Select * from [thcntt3].[dbo].[Devices]";
    sql1.query(connect, query, (err, rows) => {
        res.send(rows);
    })
});

app.put('/updateDevice/:id', function (req, res) {
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const deviceId = req.params.id; // Lấy giá trị id từ URL params
    const { status } = req.body; // Lấy dữ liệu cập nhật từ body request
    console.log(status);
    // Câu truy vấn UPDATE cơ sở dữ liệu
    const query = `UPDATE [thcntt3].[dbo].[Devices] SET status='${status}' WHERE mqtt_topic_sub='${deviceId}'`;
    sql1.query(connect, query, (err, result) => {
        if (err) {
            console.error("Error updating device:", err);
            res.status(500).send("Error updating device");
        } else {
            console.log("Device updated successfully");
            res.send("Device updated successfully");
        }
    });
});

app.get('/getDevices/:id', function (req, res) {
    const roomId = req.params.id;
    // Kiểm tra nếu roomId không hợp lệ (ví dụ: không phải số nguyên dương)
    if (!Number.isInteger(+roomId) || +roomId <= 0) {
        res.status(400).send('Invalid roomId');
        return;
    }
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const query = `SELECT * FROM [thcntt3].[dbo].[Devices] WHERE Room_id = ${roomId}`;
    sql1.query(connect, query, (err, rows) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(rows);
    });
});

app.get('/getRooms', function (req, res) {
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const query = " Select * from [thcntt3].[dbo].[Rooms]";
    sql1.query(connect, query, (err, rows) => {
        res.send(rows);
    })
});

// Add a new room
app.post('/addRooms', function (req, res) {
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const name = req.body.name; // Get room name from request body
    
    // SQL query to add room
    const query = `INSERT INTO [thcntt3].[dbo].[Rooms] (name) VALUES ('${name}')`;
  
    sql1.query(connect, query, (err, result) => {
        if (err) {
            console.error("Error adding room:", err);
            res.status(500).send("Error adding room");
        } else {
            console.log("Room added successfully");
            res.send("Room added successfully");
        }
    });
});

// Update room by ID
app.put('/updateRooms/:id', function (req, res) {
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const id = req.params.id;
    const name = req.body.name;// Get updated room name from request body
    console.log(name);
    
    // SQL query to update room
    const query = `UPDATE [thcntt3].[dbo].[Rooms] SET name='${name}' WHERE id='${id}'`;
  
    sql1.query(connect, query, (err, result) => {
        if (err) {
            console.error("Error updating room:", err);
            res.status(500).send("Error updating room");
        } else {
            console.log("Room updated successfully");
            res.send("Room updated successfully");
        }
    });
});

// Delete room by ID
app.delete('/deleteRooms/:id', function (req, res) {
    const connect = "server=.;Database=thcntt3;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const id = req.params.id; // Get room ID from URL params
    
    // SQL query to delete room
    const query = `DELETE FROM [thcntt3].[dbo].[Rooms] WHERE id='${id}'`;
  
    sql1.query(connect, query, (err, result) => {
        if (err) {
            console.error("Error deleting room:", err);
            res.status(500).json({ success: false, message: "Error deleting room" });
        } else {
            console.log("Room deleted successfully");
            res.json({ success: true, message: "Room deleted successfully" });
        }
    });
});
var server = app.listen(5555, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})