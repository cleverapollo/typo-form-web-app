<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        name="number"
        type="number"
        :value="message"
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
        rules: {
          number: value => {
            return value === Math.floor(value).toString() || 'This value must be a Integer.'
          }
        }
      }
    },
    methods: {
      onSave (value) {
        if (this.rules.number(value) !== true || this.validate(value) !== true) {
          return
        }

        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      }
    },
    computed: {
      message () {
        if (this.responses.length) {
          return this.responses[0].response
        }
        return ''
      }
    }
  }
</script>
