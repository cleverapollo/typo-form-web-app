<template>
  <v-layout row>
    <v-flex xs12>

      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" scrollable :readonly="disabled">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
        </v-date-picker>
      </v-dialog>

    </v-flex>


  </v-layout>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'date-component',
    props: ['question', 'answers', 'responses', 'disabled'],
    data () {
      return {
        date: this.responses.length ? this.formatDate(this.responses[0].response) : null,
        modal: false
      }
    },
    methods: {
      formatDate (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    watch: {
      date (value) {
        if (value) {
          if (this.responses.length) {
            this.$emit('update-response', [null, value, this.responses[0].id])
          } else {
            this.$emit('create-response', [null, value])
          }
        }
      }
    }
  }
</script>
