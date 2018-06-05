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
          v-model="dateFormatted"
          prepend-icon="event"
          @blur="date = parseDate(dateFormatted)"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" @input="dateFormatted = formatDate($event)" no-title scrollable>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'date-component',
    props: ['question', 'answers', 'responses'],
    data () {
      return {
        menu: false,
        date: this.responses.length ? this.parseDate(this.responses[0].response) : '',
        dateFormatted: this.responses.length ? this.responses[0].response : '',
        modal: false
      }
    },
    methods: {
      formatDate (date) {
        if (!date) {
          return null
        }

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) {
          return null
        }

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    },
    watch: {
      dateFormatted (value) {
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
