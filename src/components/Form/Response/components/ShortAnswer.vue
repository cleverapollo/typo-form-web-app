<template>
  <v-text-field
    name="short-answer"
    :label="question"
    :value="message"
    @change="onSave($event)"
    :rules="[validate]"
  ></v-text-field>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'short-answer',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses'],
    methods: {
      onSave (value) {
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
