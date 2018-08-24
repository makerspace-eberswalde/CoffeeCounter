#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

int blue_led = 13;     // LED pin
int red_led = 15;     // LED pin
int green_led = 12;     // LED pin
int button = 2; // push button is connected
int temp = 0;    // temporary variable for reading the button pin status
HTTPClient http;  //Declare an object of class HTTPClient
boolean request_running = false;
int counter = 0;

void setup() {
  Serial.begin(9600);
  pinMode(blue_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(green_led, OUTPUT);
  pinMode(button, INPUT_PULLUP);

  WiFi.begin("Hebewerk-e-V", "93506530615146776711");   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }
}

void loop() {
  temp = digitalRead(button);

  if(WiFi.status() == WL_CONNECTED){   //Check WiFi connection status

    if ((temp == HIGH) && (request_running != true)) {
      digitalWrite(green_led, HIGH);
      digitalWrite(blue_led, LOW);
      Serial.println("Green LED Turned ON");
      // delay(1000);
    } else {
      counter++;
      digitalWrite(green_led, LOW);
      digitalWrite(blue_led, HIGH);
      Serial.println("Red LED Turned ON");
      ///ab hier wir der POST abgesetzt

      http.begin("http://178.254.26.23:4001/button/1/click");  //Specify request destination
      int httpCode = http.GET();  //Send the request
      request_running = true;
      if (httpCode > 0) { //Check the returning code
        Serial.println("in httpCode > 0");
        Serial.println(counter + " in if");
        counter = 0;
        String payload = http.getString(); //Get the request response payload
        Serial.println(payload); //Print the response payload

      }

      Serial.println(counter + " outside if");
      Serial.println(httpCode);   //Print HTTP return code

      http.end();  //Close connection
      request_running = false;
      delay(1000);
    }
  } else{
    Serial.println("Error in WiFi connection");
  }
}
