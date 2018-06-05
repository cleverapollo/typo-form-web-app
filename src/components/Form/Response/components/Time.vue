<template>
  <v-layout row>
    <v-flex xs12>
      <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="time"
          prepend-icon="access_time"
          readonly
        ></v-text-field>
        <v-time-picker v-model="time" autosave></v-time-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'time-component',
    props: ['question', 'answers', 'responses'],
    data () {
      return {
        timeCnt: 0,
        menu: false,
        time: this.responses.length ? this.responses[0].response : null
      }
    },
    methods: {
      onSave (value) {
        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      }
    },
    watch: {
      time (value) {
        if (this.timeCnt === 1) {
          this.timeCnt = 0
          if (this.responses.length) {
            this.$emit('update-response', [null, this.time, this.responses[0].id])
          } else {
            this.$emit('create-response', [null, this.time])
          }
        } else {
          this.timeCnt++
        }
      }
    }
  }
</script>
