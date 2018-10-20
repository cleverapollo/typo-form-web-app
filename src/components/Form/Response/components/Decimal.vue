<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        name="decimal"
        v-model="message"
        @change="onSave($event)"
        :rules="[rules.float, validate]"
        :disabled="disabled"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'Decimal',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses', 'disabled'],
    data () {
      return {
        message: null,
        rules: {
          float: value => {
            return value === parseFloat(value).toString() || 'This value should be a decimal.'
          }
        }
      }
    },
    methods: {
      onSave (value) {
        if (this.validate(value) !== true) {
          return
        }

        if (this.rules.float(value) !== true) {
          value = parseFloat(value)
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
