<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        name="decimal"
        type="number"
        :value="message"
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
        rules: {
          float: value => {
            return value === parseFloat(value).toString() || 'This value must be a Float.'
          }
        }
      }
    },
    methods: {
      onSave (value) {
        if (this.rules.float(value) !== true || this.validate(value) !== true) {
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
