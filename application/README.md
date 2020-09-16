## Web Application Structure

The OpenGrow web application can be divided into 3 parts which are each found within the 'src' folder:

1. MQTT Broker
1. Web-app front-end
1. Web-app back-end

### MQTT Broker

The MQTT Broker is built with the [aedes library](https://github.com/moscajs/aedes).

All the code for this barebone MQTT broker can be found in the src>mqtt-broker folder.

### Web-App Front-End

Front-end is built with React Js and bootstrapped with [Material UI](https://material-ui.com/).

All code for front-end is in src>client>src folder.

### Web-APP Back-End

Excluding contents of the afore-mentioned folders, all remaining code within the src folder is for the back-end. 

## Available Scripts

From this project directory, you can run:

### `npm run dev`

Runs the full OpenGrow application in your development environment. This means the full-stack web-application and MQTT broker will be up.

You are able to login, register new users, add/remove plants from your account, rename plants and view plant data. The ESP will also be continuously sending data through the broker to the web-application back-end. You can update control settings from the web-application the changes will immediately be received by the ESP.

### `npm run build`

Compile all the typescript code within the source folder into javascript which is placed in a folder titled 'dist'.

You should run this command when you first clone this repository before running any of the other scripts (as they rely on the compiled javascript).

### `npm run mqtt`

Runs only the MQTT broker. If your ESP module has been connected, it will subscribe to topics and send data messages to the broker. However, the web-application is not running so it will receive any data and record in the database. You will also not be able to publish any data from the web-application to the ESP.

### `npm run web-app`

The web-application front-end and back-end will be running. You will be able to login to your account, add/remove plants, rename plants and view data.

Since the MQTT broker is not connected, you will not be able to send control setting data from web application to the plant. Also, none of the data being recorded by the plant will be relayed to the web-application or recorded in the database.
