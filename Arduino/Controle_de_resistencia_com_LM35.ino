#include <LiquidCrystal.h>
#include <SoftwareSerial.h>

int pin = 0;      //Pino analogico para ligacao do LM35
int res = 7;      //Pino que acionara a resistencia
float ref = 21;   //Valor de temperatura desejado
float tol = 0.5;  //Tolerancia de temperatura em relação a ref
float temp = 0;   //Variavel que armazena a temperatura em graus Celsius
String msg = "";  //Variável que armazena a mensagem recebida por Bluetooth
bool ativo = true;

//Define os pinos que serão ligados ao LCD
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
SoftwareSerial bluetooth(8,9);

void executarAcao();
void enviarTemperatura();
void ativarFuncionamento();
void cortarFuncionamento();

//Array que desenha o simbolo de grau
byte a[8]= {B00110,B01001,B00110,B00000,B00000,B00000,B00000,B00000,}; 

void setup()
{
  Serial.begin(9600); //Inicializa comunicação serial
  bluetooth.begin(9600);
  
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(res, OUTPUT); 
  
  lcd.begin(16, 2); //Inicializa 
  lcd.print("Temperatura: ");
  //Atribui a "1" o valor do array "A", que desenha o simbolo de grau
  lcd.createChar(1, a); 
  //Escreve o simbolo de grau
  lcd.setCursor(15,0);
  lcd.write(1);
  lcd.setCursor(0,1);
  lcd.print("Carga: ");
}
void loop()
{  
  if (bluetooth.available()){
     char c = bluetooth.read();
     if (c == '|') {
      executarAcao(msg);
      msg = "";
     }else msg+=c;
  }
  if (ativo) {
    int tempAux = 0;
    for(int i = 0;i<=3;i++)  //Loop que faz a leitura da temperatura 4 vezes
    {
      tempAux = tempAux + ( 5.0 * analogRead(pin) * 100.0) / 1024.0;; 
      delay(100);
    }
    temp = tempAux / 4; //Média
  
  //  Serial.print( temp );
  //  Serial.println(" °C, ");
      
    delay(100); 
    
    lcd.setCursor(13, 0);
    lcd.print( int(temp) ); 
    
    if (temp > (ref + tol)) { 
      Serial.print("DESLIGA - ");
      Serial.print(temp);
      Serial.print(" - ");
      Serial.println(ref);
      digitalWrite(res, LOW); 
      lcd.setCursor(7,1);
      lcd.print("Desligada");
    } 
    else if (temp < (ref - tol)) { 
      Serial.print("LIGA - ");
      Serial.print(temp);
      Serial.print(" - ");
      Serial.println(ref);
      digitalWrite(res, HIGH); 
      lcd.setCursor(7,1);
      lcd.print("Ligada"); 
    } else {
      Serial.print("TA DE BOA - ");
      Serial.print(temp);
      Serial.print(" - ");
      Serial.println(ref);
    } 
  }else {
    Serial.println("INATIVO");
    delay(100);
  }
 }

 void executarAcao(String s) {
  int index = s.indexOf("&");
  String cmd = "";
  String param = "";
  if (index > -1) {
    cmd = s.substring(0, index);
    param = s.substring(index+1);
  } else {
    cmd = s;
  }
  cmd.toLowerCase();
  if (cmd == "set" && param.startsWith("T")) {
    int temperatura = param.substring(1).toInt();
    if (temperatura < 0) temperatura == 0;
    else if (temperatura > 100) temperatura == 100;
    ref = temperatura;
    ativarFuncionamento();
  }else if (cmd == "set" && param.startsWith("t")) {
    int tempo = param.substring(1).toInt();
    if (tempo < 0) tempo == 0;
    else if (tempo > 1440) tempo == 1440;
  }else if (cmd == "set" && param.startsWith("P")) {
    int index = param.indexOf("-");
    int temperatura = param.substring(1, index).toInt();
    int tempo = param.substring(index+1).toInt();
    if (tempo < 0) tempo == 0;
    else if (tempo > 1440) tempo == 1440;
    if (temperatura < 0) temperatura == 0;
    else if (temperatura > 100) temperatura == 100;
    ref = temperatura;
    ativarFuncionamento();
  }else if (cmd == "get") {
    enviarTemperatura();
  }else if (cmd == "stop") {
    cortarFuncionamento();
  }
  if (cmd != "get") {
    Serial.print("TEMPERATURA REF: ");
    Serial.println(ref);
    Serial.print("\n");
  }
 }
void enviarTemperatura() {
  String s = String(temp);
  s = "T"+s;
  s += "\n";
  bluetooth.print(s);
}
void cortarFuncionamento() {
  digitalWrite(res, LOW);
  ativo = false;
}
void ativarFuncionamento() {
  ativo = true;
}
