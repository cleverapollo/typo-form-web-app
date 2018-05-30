<template>
  <div>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
          name='content-block'
          multiple
          :value='message'
          @change='updateAnswer(answers[0].id, $event)'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    methods: {
      updateAnswer (index, value) {
        this.$emit('update-answer', [index, value])
      }
    },
    mounted () {
      if (this.answers.length > 1) {
        this.$emit('delete-answers')
      } else if (!this.answers.length) {
        this.$emit('create-answer', ['', true])
      }
    },
    computed: {
      message () {
        if (this.answers.length) {
          return this.answers[0].answer
        }
        return ''
      }
    }
  }
</script>
