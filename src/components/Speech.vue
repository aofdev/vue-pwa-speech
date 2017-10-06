<template>
  <v-layout row wrap>
    <v-flex xs4>
    </v-flex>
    <v-flex xs4>
      <v-btn v-show="btn" @click.native="startRecording" block round color="primary" dark>
        <v-icon left>mic</v-icon> Recording</v-btn>
      <v-btn v-show="btnStop" @click.native="stopRecording" block round color="error" dark>
        <v-icon left>stop</v-icon> Stop</v-btn>
      </br>
    </v-flex>
    <v-flex xs4>
    </v-flex>
    <v-flex xs12>
      <div v-show="loader" class="text-xs-center">
        <v-progress-circular indeterminate v-bind:size="100" v-bind:width="3" class="orange--text"></v-progress-circular>
      </div>
      <transition name="slide">
        <div v-show="result" class="text-xs-center">

          <v-layout row wrap>
            <v-flex xs4>
            </v-flex>
            <v-flex xs4>
              <v-card class="darken-2 orange--text">
                <h4 class="text-xs-center">{{textResult}}</h4>
              </v-card>
            </v-flex>
            <v-flex xs4>
            </v-flex>
          </v-layout>
        </div>
      </transition>
      <transition name="slide">
        <div v-show="resultError" class="text-xs-center">

          <v-layout row wrap>
            <v-flex xs4>
            </v-flex>
            <v-flex xs4>
              <v-card class="red darken-3 white--text">
                <v-card-title primary-title>
                  <div class="headline">An Unexpected Error Occurred</div>
                </v-card-title>
                <v-card-actions>
                  <v-btn @click.native="redirectError" flat dark>Try Again</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs4>
            </v-flex>
          </v-layout>
        </div>
      </transition>

    </v-flex>
  </v-layout>
</template>

<script>
  var audio_context;
  var recorder;
  import axios from 'axios';

  export default {
    data() {
      return {
        btn: true,
        btnStop: false,
        loader: false,
        result: false,
        resultError: false,
        textResult: "",
        apiKey: "", //api key
        data: {
          "audio": {
            "content": null
          },
          "config": {
            "encoding": "LINEAR16",
            "sampleRateHertz": 44100,
            "languageCode": "en-US"
          }
        }
      }
    },
    methods: {
      startUserMedia(stream) {
        const input = audio_context.createMediaStreamSource(stream);
        // Media stream created
        recorder = new Recorder(input);
        // Recorder initialised
      },
      startRecording() {
        recorder && recorder.record();
        this.result = false;
        this.btn = false;
        this.btnStop = true;

        // Start Recording
      },
      stopRecording() {
        recorder && recorder.stop();

        this.btnStop = false;
        this.loader = true;
        // Stopped Recording

        // create WAV download link using audio data blob
        this.processRecording();

        recorder.clear();
      },
      processRecording() {
        const vm = this;

        recorder && recorder.exportWAV(function(blob) {
          var reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const baseData = reader.result;
            const base64Data = baseData.replace("data:audio/wav;base64,", "");
            vm.data.audio.content = base64Data;

            axios.post(
              `https://speech.googleapis.com/v1/speech:recognize?key=${vm.apiKey}`,
              vm.data).then(response => {
              const result = response.data.results[0].alternatives[0];
              vm.textResult = result.transcript
              vm.btn = true;
              vm.loader = false;
              vm.result = true;
            }).catch(error => {
              vm.loader = false;
              vm.resultError = true;
              console.log("ERROR:" + error);
            })
          }
        });
      },
      redirectError() {
        window.location.href = "http://localhost:8080/"
      }
    },
    created() {
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      } catch (e) {
        alert('No web audio support in this browser!');
      }
      const that = this;
      navigator.getUserMedia({
        audio: true
      }, function(stream) {
        that.startUserMedia(stream)
      }, function(e) {
        console.log('No live audio input: ' + e);
      });
    }
  }
</script>


<style>
  .slide-enter {
    opacity: 0;
  }

  .slide-enter-active {
    animation: slide-in 1s ease-out forwards;
    transition: opacity .5s;
  }

  .slide-move {
    transition: transform 1s;
  }

  @keyframes slide-in {
    from {
      transform: translateY(20px);
    }
    to {
      transform: translateY(0);
    }
  }
</style>
