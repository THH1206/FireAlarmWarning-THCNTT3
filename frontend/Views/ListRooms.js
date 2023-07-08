import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const ShowListRoom = () => {
  const [room, setRooms] = useState([])
  useEffect(() => {
    console.log("here")
    getRooms().then((data) => setRooms(data))
  }, [])

  const getRooms = async () => {
    const result = await fetch("http://localhost:5555/getRooms");
    const data = await result.json();
    console.log('data', data)
    return data;
  }

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home-outline" size={70} color="orange" />
        <Text style={styles.txtTitle}>Smart Home</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.row}>
        {room.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => navigation.navigate('List Devices', { roomId: item.id })} style={styles.btn}  >
            <View style={styles.item}>
              <Image source={require('../assets/kitchen.png')} style={{ width: 120, height: 120 }} />
              <View style={styles.item1}>
                <Text style={styles.txtTitle}> {item.name} </Text>
                <Text style={styles.txtSubTitle}> Lights on </Text>
                <Text style={styles.txtSubTitle}> Fans on </Text>
                <Text style={styles.txtSubTitle}> TVs on </Text>
              </View>
            </View >
          </TouchableOpacity>
        )
        )}
        </View>
      </View>
    </View>
  )
}
export default function ListRooms() {
  return (
    <ShowListRoom />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEFF1',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: "center",
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  txtTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:10,
    justifyContent: 'space-between',
  },
  btn: {
    marginVertical: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  image: {
    width: 120,
    height: 120,
  },
  item1: {
    marginLeft: 10,
  },
  txtSubTitle: {
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    marginTop: 20,
  },
});

