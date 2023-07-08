#include <SoftwareSerial.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#define TX_PIN D7 //chân D7 arduino có chức năng của TX
#define RX_PIN D6 // chân D6 arduino có chức năng của RX
#define dataPin 5 // Defines pin number to which the sensor is connected
#define DHTTYPE DHT11
StaticJsonDocument<256> doc;  
char ledstatus[32]="none";
char topic[100]="none";
String data;
int cambien = A0;
int giatri;
int led2 = D5;
int led1 = D2;
int flag = 0;
SoftwareSerial bluetooth(RX_PIN, TX_PIN); //RX_PIN Arduino nối vào chân TX của HC_06 và
void setup() {
 Serial.begin(9600);
 bluetooth.begin(9600);

 pinMode(cambien,INPUT);
 pinMode(led1, OUTPUT);
 pinMode(led2, OUTPUT);
 pinMode(RX_PIN, INPUT);
 pinMode(TX_PIN, OUTPUT);


 Serial.println("Bluetooth On please press 1 or 0 blink LED");
}
void loop() {
  StaticJsonDocument<64> jsonDoc;
StaticJsonDocument<64> jsonDocGas;
giatri = analogRead(cambien);
Serial.print("GAS : ");
Serial.println(giatri);
jsonDocGas["topic"] = "gas_room1";
jsonDocGas["status"] = String(giatri);

String jsonStringGas;
serializeJson(jsonDocGas, jsonStringGas);
bluetooth.print(jsonStringGas); // Thay đổi println thành print

// if (giatri1 > 230) {
//   digitalWrite(led1, HIGH);
//   Serial.println("LED1 On");

//   StaticJsonDocument<64> jsonDocLED;
//   jsonDocLED["topic"] = "led_room1";
//   jsonDocLED["status"] = "1";

//   String jsonStringLED;
//   serializeJson(jsonDocLED, jsonStringLED);
//   bluetooth.print(jsonStringLED); // Thay đổi println thành print
// }

 if (bluetooth.available() > 0) {
   data = bluetooth.readString();
   Serial.println(data);
   deserializeJson(doc, data);
   strlcpy(ledstatus, doc["status"] | "on", sizeof(ledstatus));
   String mystring(ledstatus);
   strlcpy(topic, doc["mqtt_topic_sub"] | "none", sizeof(topic));
   String mytopic(topic);
   Serial.println(ledstatus);
   Serial.println("-------------------------");
   Serial.println(mytopic);
   
   if(mytopic == "led1")
   {
     Serial.println("success");
     if(mystring == "1")
     {
      digitalWrite(led1, HIGH);
      Serial.println("LED1 On");
      //led1=on
     }
     else if(mystring == "0")
     {
      jsonDoc["status"] = "0";
      
      digitalWrite(led1, LOW);
      Serial.println("LED1 Off");
      //led1=on
     }
 
   }
   //----------------------------
   if(mytopic == "led2")
   {
     
     jsonDoc["topic"] = "led2";
     
     if(mystring == "1")
     {
      jsonDoc["status"] = "1";
      digitalWrite(led2, HIGH);
      Serial.println("LED2 On");
      //led1=on
     }
     else if(mystring == "off")
     {
      jsonDoc["status"] = "0";
      digitalWrite(led2, LOW);
      Serial.println("LED2 Off");
      //led1=on
     }
   }
  //  if(mytopic == "gas_room1")
  //  {
     
   }




//  char c = bluetooth.read();
//  Serial.println(c);

//  }

//  if (data.length() > 0) {
//  if(data == "on" ||data == "1")
//  {

//  data="";
//  }
//  else if(data == "off"||data == "0")
//  {
//  digitalWrite(led, LOW);
//  Serial.println("LED Off");
//  //led1=off
//  bluetooth.println("off");
//  data="";
//  }
//  else if(data == "read")
//  {
//  // float h = dht.readHumidity();
//  // // Read temperature as Celsius (the default)
//  // float t = dht.readTemperature();
//  // Serial.print("Humidity: ");
//  // Serial.print(h);
//  // Serial.println("%");
//  // Serial.print("Temperature: ");
//  // Serial.print(t);
//  // Serial.println("*C");
//  Serial.println("send data ...");
// //  bluetooth.print("Humidity=");
// //  bluetooth.print(23.7); //du lieu tinh
// //  bluetooth.print(";");
// //  bluetooth.println(";#"); //# end message

//  delay(1000);
//  }
  delay(1000);
//  }
 delay(4000);
}