<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        name="number"
        v-model="message"
        @change="onSave($event)"
        :rules="[rules.number, validate]"
        :disabled="disabled"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'Number',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses', 'disabled'],
    data () {
      return {
        message: null,
        rules: {
          number: value => {
            return value === Math.floor(value).toString() || 'This value should be a whole number.'
          }
        }
      }
    },
    methods: {
      onSave (value) {
        if (this.validate(value) !== true) {
          return
        }

        if (this.rules.number(value) !== true) {
          value = parseInt(value)
          this.message = value
        }

        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      }
    },
    mounted () {
      if (this.responses.length) {
        this.message = this.responses[0].response
      }
    }
  }
</script>
