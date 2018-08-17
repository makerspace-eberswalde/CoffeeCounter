#include "secrets.h"

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>




int blue_led = 13;     // LED pin
int red_led = 15;     // LED pin
int green_led = 12;     // LED pin
int button = 2; // push button is connected
int temp = 0;    // temporary variable for reading the button pin status



void setup() {
  Serial.begin(9600);
  pinMode(blue_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(green_led, OUTPUT);
  pinMode(button, INPUT_PULLUP);

  WiFi.begin(wifi_ssid, wifi_password);   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }

  
}

void loop() {
  temp = digitalRead(button);
     
     

     if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status

        if (temp == HIGH) {
        digitalWrite(green_led, HIGH);
        digitalWrite(red_led, LOW);
        Serial.println("Blue LED Turned ON");
        delay(1000);
       }
     else {
        digitalWrite(green_led, LOW);
        digitalWrite(red_led, HIGH);
        Serial.println("Red LED Turned ON");
       
        ///ab hier wir der POST abgesetzt
        HTTPClient http;    //Declare object of class HTTPClient
     
       http.begin("http://192.168.1.88:8085/hello");      //Specify request destination
       http.addHeader("Content-Type", "text/plain");  //Specify content-type header
     
       int httpCode = http.POST("Message from ESP8266");   //Send the request
       String payload = http.getString();                  //Get the response payload
     
       Serial.println(httpCode);   //Print HTTP return code
       Serial.println(payload);    //Print request response payload
     
       http.end();  //Close connection        
       delay(1000);
       }


        
       
     
     }else{
     
        Serial.println("Error in WiFi connection");   
     
     }
}


