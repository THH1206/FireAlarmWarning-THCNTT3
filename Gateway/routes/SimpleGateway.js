var express = require('express');
var router = express.Router();
const { SerialPort } = require("serialport");
var mqtt = require('mqtt');
const axios = require('axios');
var message = "2"; // Thiet lap mode doc du lieu
var result = "";
var str = "";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const getDevicesFromAPI = async () => {
    try {
        const response = await axios.get('http://localhost:5555/getDevices');
        return response.data;
    } catch (error) {
        throw error;
    }
};
async function updateDevice(deviceId, updatedData) {

    try {
        await axios.put(`http://localhost:5555/updateDevice/${deviceId}`, JSON.parse(updatedData));
        console.log(`Device ${deviceId} updated successfully`);
    } catch (error) {
        console.error(`Error updating device ${deviceId}:`, error);
    }
}
// Thay broker.example.com bằng URL broker thực tế của bạn
//step 1: open connection to COM port
const serialPort = new SerialPort({
    path: 'COM6',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
}, function (err) {
    if (err)
        console.log("Error", err.message);
    else
        console.log("OK");
});

mqttClient = mqtt.connect('mqtt://broker.emqx.io:1883', {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
}); // Thay broker.example.com bằng URL broker thực tế của bạn
mqttClient.on('connect', function () {
    // 
    console.log('Subscribed to topic: done');
});
mqttClient.on("error", (error) => {
    console.error("connection failed", error)
})
//step 2 register to listen open the port
// router.get('/connect', function(req, res, next) {
//Khang
serialPort.on("open", async function () {
    console.log("-- Connection opened --");
    //step 3 test send message to HC05

    try {
        const devices = await getDevicesFromAPI();
        console.log(devices)
        const requestData = JSON.stringify(devices);
        devices.forEach(item => {
            const mqtt_topic_pub = item.mqtt_topic_pub;
            const mqtt_topic_sub = item.mqtt_topic_sub;
            console.log(mqtt_topic_pub)
            console.log(mqtt_topic_sub)
            mqttClient.subscribe(mqtt_topic_sub);
            // Khởi tạo MQTT client với broker và các topic tương ứng



        });

        mqttClient.on('message', async function (topic, message) {
            console.log("123");

            mess = message
            console.log('Received MQTT message:', message.toString());
            // Xử lý dữ liệu nhận được
            result = message.toString();
            const parsedMessage = JSON.parse(message.toString());
            const status = parsedMessage.status;
            deviceId = topic;

            // Gửi dữ liệu nhận được xuống cổng COM
            if (topic.startsWith('led')) {
                serialPort.write(result, function (err) {
                    if (err) {
                        console.log("Error on write: ", err.message);
                        return serialPort.close();
                    }
                    console.log("Data sent to COM port");
                });
            }

            try {
                await updateDevice(deviceId, result);
                console.log("Device updated successfully");
            } catch (error) {
                console.error("Error updating device:", error);
            }


        });
        console.log('-----------------')
    } catch (error) {
        console.error('Error:', error.message);
    }
    serialPort.on("data", function (data) {
        str += data;
        result = data;
        console.log('data' + data);
        const JsonData = JSON.parse(data);
        const pubData = JsonData.topic;
        console.log("pubdata ", pubData);
        mqttClient.publish(pubData, data);
        console.log('Published MQTT message:', 'Hello MQTT');

    });
});


// serialPort.on("open", function () {
//     console.log("-- Connection opened --");
//     //step 3 test send message to HC05
//     serialPort.write(message, function (err) {
//         if (err) {
//             console.log("Error on write: ", err.message);
//             return serialPort.close();
//         }
//         console.log("Message sent successfully");
//     });
//     //step 4 register listen data on the open port and process receiced
//     message
//     serialPort.on("data", function (data) {
//         str += data;
//         result = data;
//         console.log('data' + data);
//     });
// });

// Đăng ký lắng nghe dữ liệu từ MQTT
// mqttClient.on('connect', function () {
//     console.log("connect");
//     mqttClient.subscribe('topic'); // Thay 'topic' bằng chủ đề MQTT thích hợp
// });

// mqttClient.on('message', function (topic, message) {
//     console.log('Received MQTT message:', message.toString());

//     // Xử lý dữ liệu nhận được
//     result = message.toString();

//     // Gửi dữ liệu nhận được xuống cổng COM
//     serialPort.write(result, function (err) {
//         if (err) {
//             console.log("Error on write: ", err.message);
//             return serialPort.close();
//         }
//         console.log("Data sent to COM port");
//     });
// });
router.get('/', async function (req, res, next) {
    res.render('SimpleGateway', { data: result });
});
router.get('/on', function (req, res, next) {
    serialPort.write("1", function (err) {
        if (err) {
            return console.log("Error on write: ", err.message);
        }
    });
    res.render('SimpleGateway', { data: result });
});

router.get('/connect', function (req, res, next) {
    console.log("connect123")
    var mess = ""
    var t = "gas_room1"

    // serialPort.write(mess, function (err) {
    //     if (err) {
    //         return console.log("Error on write: ", err.message);
    //     }
    // });

});
router.get('/off', function (req, res, next) {
    serialPort.write("0", function (err) {
        if (err) {
            return console.log("Error on write: ", err.message);
        }
    });
    res.render('SimpleGateway', { data: result });
});
module.exports = router;
