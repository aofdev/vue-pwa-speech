# vue-speech
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=C9L4PNA5WH3LW)
> A Vue2 Performs synchronous speech recognition with Google Cloud Speech on Progressive Web App

![alt tag](https://i.imgur.com/atntNle.png)


## Config
### Step 1
Enable the Cloud Speech API for that project.  [Cloud Platform Console](https://console.cloud.google.com) 

### Step 2
Initialize Firebase At ``Speech.vue`` [Google Cloud API Browser Key](https://console.cloud.google.com/apis/dashboard)
``` bash
apiKey: ""
```


## Installation

``` bash
# Git Clone Project
git clone git@github.com:aofdev/vue-pwa-speech.git

# Cd project
cd vue-pwa-speech

# install dependencies
npm install || yarn install

# serve with hot reload at localhost:8080
npm run dev || yarn dev

# build for production with minification and to build Progressive Web Apps
npm run build || yarn build

```
## Other related projects
### Streaming Recognition
> Returns recognition results while the user is still speaking  [vue-speech-streaming](https://github.com/aofdev/vue-speech-streaming) 

