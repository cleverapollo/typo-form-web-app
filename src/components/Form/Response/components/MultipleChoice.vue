<template>
  <v-radio-group v-model="optionModel" column>
    <v-radio class="pt-2 pb-2" v-for='(answer, index) in answers' :key='"Option " + index' :label="answer.answer"
             :value="checked(answer.id)" @change="onSave(answer.id)"></v-radio>
  </v-radio-group>
</template>

<script>
  export default {
    name: 'multiple-choice',
    props: ['answers', 'responses'],
    data () {
      return {
        optionModel: 'checked'
      }
    },
    methods: {
      checked (answerId) {
        if (this.responses.length) {
          if (this.responses[0].answer_id === answerId) {
            return 'checked'
          }
        }
        return 'unchecked'
      },
      onSave (answerId) {
        if (this.responses.length) {
          this.$emit('update-response', [answerId, null, this.responses[0].id])
        } else {
          this.$emit('create-response', [answerId, null])
        }
      }
    },
    computed: {
      computedOptions: {
        get: function () {
          return this.options
        },
        set: function (options) {
          this.$emit('update-options', options)
        }
      }
    }
  }
</script>
