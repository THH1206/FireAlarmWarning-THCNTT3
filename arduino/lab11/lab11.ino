#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#define ssid "SAMSUNG"
#define password "redminote11"
// Thông tin về MQTT Broker
#define mqtt_server "broker.emqx.io"
const uint16_t mqtt_port = 1883; //Port của MQTT broker
#define mqtt_topic_pub_led1 "led1"
#define mqtt_topic_sub_led1 "led1"
#define mqtt_topic_pub_gas1 "gas_room1"
#define mqtt_topic_sub_gas1 "gas_room1"
#define mqtt_topic_pub_led2 "led2"
#define mqtt_topic_sub_led2 "led2"
#define mqtt_topic_pub_gas2 "gas_room2"
#define mqtt_topic_sub_gas2 "gas_room2"
int cambien = A0;
int giatri;
WiFiClient espClient;
PubSubClient client(espClient);
StaticJsonDocument<256> doc; //PubSubClient limits the message size to 256 bytes (including
char ledstatus[32]="on";
char topicmqtt[32]="none";
void setup() {
 pinMode(cambien,INPUT);
 pinMode(D5, OUTPUT);
 digitalWrite(D5, HIGH);
 Serial.begin(115200);
 // hàm thực hiện chức năng kết nối Wifi và in ra địa chỉ IP của ESP8266
 setup_wifi();
 // cài đặt server eclispe mosquitto / mqttx và lắng nghe client ở port 1883
 client.setServer(mqtt_server, mqtt_port);
 // gọi hàm callback để thực hiện các chức năng publish/subcribe
 client.setCallback(callback);
 // gọi hàm reconnect() để thực hiện kết nối lại với server khi bị mất kết nối
 reconnect();
}
void setup_wifi() {
 delay(10);
 Serial.println();
 Serial.print("Connecting to ");
 Serial.println(ssid);
 // kết nối đến mạng Wifi
 WiFi.begin(ssid, password);
 // in ra dấu . nếu chưa kết nối được đến mạng Wifi
 while (WiFi.status() != WL_CONNECTED) {
 delay(500);
 Serial.print(".");
 }
 // in ra thông báo đã kết nối và địa chỉ IP của ESP8266
 Serial.println("");
 Serial.println("WiFi connected");
 Serial.println("IP address: ");
 Serial.println(WiFi.localIP());
}
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println("callback");
 //chuyen doi *byte sang json
 deserializeJson(doc, payload, length);
 //doc thong tin status tu chuỗi json trả về
 strlcpy(ledstatus, doc["status"] | "on", sizeof(ledstatus));
 String mystring(ledstatus);
  strlcpy(topicmqtt, doc["mqtt_topic_sub"] | "on", sizeof(topicmqtt));
 String mytopic(topicmqtt);
 //in ra tên của topic và nội dung nhận được từ kênh MQTT lens đã publish
 Serial.print("Message arrived [");
 Serial.print(topic);
 Serial.print("] ");
 // in trang thai cua led
 Serial.println(ledstatus);

  if(mytopic == "led1")
  {
    StaticJsonDocument<256> doc2;
    char buffer[256];
    doc2["topic"] = "led1";
    if(mystring == "1")
    { //on
    Serial.print("turn on");
    doc2["status"] = "1";
    digitalWrite(D5, HIGH);
    }else if(mystring == "0")
    {
    doc2["status"] = "0";
    Serial.print("turn off");
    digitalWrite(D5, LOW);
    }
    size_t n = serializeJson(doc2, buffer);
    client.publish(mqtt_topic_pub_led1, buffer, n);
  }
  
  if(mytopic == "led2")
  {
    StaticJsonDocument<256> doc1;
    char buffer[256];
    doc1["topic"] = "led2";
    if(mystring == "1")
    { //on
    doc1["status"] = "1";
    Serial.print("turn on");
    digitalWrite(D2, HIGH);
    }else if(mystring == "0")
    {
    doc1["status"] = "0";
    Serial.print("turn off");
    digitalWrite(D2, LOW);
    }
    size_t n = serializeJson(doc1, buffer);
    client.publish(mqtt_topic_pub_led2, buffer, n);
  }
    StaticJsonDocument<256> doc3;
     giatri = analogRead(cambien);
      Serial.println("GAS : ");
      Serial.print(giatri);
      char buffer[256];
      doc3["status"] = String(giatri);
      doc3["topic"] = "gas_room1";
      size_t n = serializeJson(doc3, buffer);
      client.publish(mqtt_topic_pub_gas1, buffer, n);
      delay(2000);
 Serial.println();
}
void reconnect() {
  Serial.println("reconnect");
 // lặp cho đến khi được kết nối trở lại
 while (!client.connected()) {
 Serial.print("Attempting MQTT connection...");
 // hàm connect có đối số thứ 1 là id đại diện cho mqtt client, đối số thứ 2 là username và đối
 if (client.connect("thh1206_thh1206")) {
 Serial.println("connected");
 // publish gói tin "Hello esp8266!" đến topic mqtt_topic_pub_test

 char buffer[256];
 doc["message"] = "Hello esp8266!";
 size_t n = serializeJson(doc, buffer);
 client.publish(mqtt_topic_pub_led1, buffer, n);
 // publish gói tin "{"message":"turn on led","name":"led","status":"on"}" đến topicmqtt_topic_pub_led
 doc["name"] = "led";
 doc["status"] = "on";
 doc["message"] = "turn on led";
 n=serializeJson(doc, buffer);
 // đăng kí nhận gói tin tại topic wemos/ledstatus
 client.subscribe(mqtt_topic_sub_led1);
 client.subscribe(mqtt_topic_sub_led2);
 client.subscribe(mqtt_topic_sub_gas1);
 client.subscribe(mqtt_topic_sub_gas2);
 
 } else {
 // in ra màn hình trạng thái của client khi không kết nối được với MQTT broker
 Serial.print("failed, rc=");
 Serial.print(client.state());
 Serial.println(" try again in 5 seconds");
 // delay 5s trước khi thử lại
 delay(5000);
 }
 }
}
void loop() {
 // kiểm tra nếu ESP8266 chưa kết nối được thì sẽ thực hiện kết nối lại
 if (!client.connected()) {
 reconnect();
 }
 client.loop();

}