import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";

//MQTT
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});
const options = {
  host: "broker.emqx.io",
  port: 8083,
  path: "/thh1206_thh1206",
  id: "id_" + parseInt(Math.random() * 100000),
};
const client = new Paho.MQTT.Client(options.host, options.port, options.path);
//------------------------------------------------------------------------
const OnOffLed = ({ navigation }) => {
  const route = useRoute();
  const roomId = route.params?.roomId;
  const [devices, setDevices] = useState([]);
  const [isLightEnabled, setLightValue] = useState([]);
  const [isDevicesLoaded, setIsDevicesLoaded] = useState(false);
  const toggleLightSwitch = (index, value, topic) => {
    let initialStatus;
    console.log("Topic toggle " + topic)
    const updatedLightValues = [...isLightEnabled];
    updatedLightValues[index] = value;
    if (value == false) {
      console.log("Switch off")
      publishTopic("0", topic)
    } else {
      console.log("Switch on")
      publishTopic("1", topic)
    }
    setLightValue(updatedLightValues);
  };
  const getDevices = async () => {
    const result = await fetch(`http://localhost:5555/getDevices/${roomId}`);
    const data = await result.json();
    console.log('data', data);
    return data;
  }
  useEffect(() => {
    console.log(roomId);
    console.log("here");
    getDevices().then((data) => {
      setDevices(data);
      const initialToggleValues = data.map((device) => device.status === 1);
      setLightValue(initialToggleValues);
      setIsDevicesLoaded(true);
    });
  }, []);
  //-------------------------------- MQTT
  const [msg, setMsg] = useState("No message");
  const [statusLed, setStatusLed] = useState("off");
  useEffect(() => {
    if (isDevicesLoaded) {
      connect();
      // step 3 handling when message arrived
      client.onMessageArrived = onMessageArrived;
    }
    //step 1 connect Mqtt broker
  }, [isDevicesLoaded]);
  const connect = () => {
    client.connect({
      onSuccess: () => {
        console.log("connect MQTT broker ok!");
        //step 2 subscribe topic
        subscribeTopic(); // ledstatus
      },
      useSSL: false,
      timeout: 5,
      onFailure: () => {
        console.log("connect fail");
        connect();
        console.log("reconnect ...");
      },
    });
  };
  const publishTopic = (deviceStatus, topic) => {
    console.log("Publish topic " + topic)
    const s = '{"status":"' + deviceStatus + '","mqtt_topic_sub":"' + topic + '"}';
    var message = new Paho.MQTT.Message(s);
    message.destinationName = topic;
    client.send(message);
  };
  const subscribeTopic = () => {
    console.log("asd");
    devices.forEach(device => {
      console.log(device.mqtt_topic_sub)

      client.subscribe(device.mqtt_topic_sub, { qos: 0 });
      console.log(device.mqtt_topic_sub)
    })
  };
  const sendData = async (topic, status) => {
    if (topic != "undefined") {
      try {
        console.log("topic :", topic);
        console.log("status :", status);
        const response = await axios.put(`http://localhost:5555/updateDevice/${topic}`, { status: status });
        console.log('PUT request successful');
        console.log(response.data);
      } catch (error) {
        console.error('Error making PUT request:', error);
      }
    }
  };
  const onMessageArrived = async (message) => {
    console.log("onMessageArrived:" + message.payloadString);
    setMsg(message.payloadString);
    const jsondata = JSON.parse(message.payloadString);
    const topic = jsondata.topic;
    const status = jsondata.status;

    sendData(topic, status);
    setStatusLed(jsondata.status);
  };

  // const handleButtonOn = async () => {
  //   //connect();
  //   console.log("turn on led...");
  //   publishTopic("on");
  // };
  // const handleButtonOff = async () => {
  //   console.log("turn off led...");
  //   publishTopic("off");
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Ionicons name = "home-outline" size = {64} color={'orange'}/>
        <Text style={styles.txtTitle}>Smart Home</Text>
      </View>
      <View style={styles.main}>

        {devices.map((item, index) => {
          return item.name === 'led' ?
            <View style={styles.itemDevice} key={item.name}>
              <Image source={{ uri: require("../assets/den.jpg") }} style={{ width: 50, height: 50 }} />
              <View style={styles.itemDevice1}>
                <Text style={styles.txtItem}>{item.name} </Text>
                <Switch style={styles.toggleBtn} value={isLightEnabled[index]} onValueChange={(value) => toggleLightSwitch(index, value, item.mqtt_topic_pub)} />
              </View>
            </View>
            :
            <View style={styles.itemDevice} key={item.name}>
              <Image source={{ uri: require("../assets/gas.jpg") }} style={{ width: 50, height: 50 }} />
              <View style={styles.itemDevice1}>
                <Text style={styles.txtItem}>{item.name} </Text>
                <Text style={styles.txtItem}>{item.status} analog</Text>
              </View>
            </View>
        }
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.txtSubTitle}> THCNTT3 </Text>
      </View>
    </View>
  )
}
export default function ListDevices() {
  return (
    <OnOffLed />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    justifyContent: 'flex-start',
  },
  txtHelloWorld: {
    fontSize: 50
  },
  header: {
    flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 30,
  },
  footer: {
    display: 'flex',
    alignItems: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20
  },
  txtTitle: {
    fontSize: 40,
  fontWeight: 'bold',
  color: 'black',
  marginLeft: 10,
  },
  txtSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
  txtItem: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
    flex: 1,
  },
  main: {
    flex: 3,
    alignItems: 'center',
    padding: 20,
  },
  itemDevice: {
    borderRadius: 5,
    height: 60,
    width: '100%',
    backgroundColor: '#FFC107',
    marginTop: 15,
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  itemDevice1: {
    height: 60,
    width: '90%',
    marginTop: 10,
    flexDirection: "row",
    alignItems: 'center',
  },

  btnText: {
    color: 'auto',
    fontWeight: 'bold'
  },

  toggleBtn: {
    width: 40,
    height: 25,
  }
});