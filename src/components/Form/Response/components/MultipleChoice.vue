<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-radio-group v-model="optionModel" :row="hasValidation">
        <v-radio 
          color="info"
          :disabled="disabled"
          v-for='(answer, index) in answers' 
          :key='"Option " + index' 
          :label="answer.answer"
          :value="answer.id" @change="onSave(answer.id)">
        </v-radio>
      </v-radio-group>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'multiple-choice',
    props: ['question', 'answers', 'responses', 'disabled', 'hasValidation'],
    data () {
      return {
        optionModel: this.responses.length ? this.responses[0].answer_id : ''
      }
    },
    methods: {
      onSave (answerId) {
        if (this.responses.length) {
          this.$emit('update-response', [answerId, null, this.responses[0].id])
        } else {
          this.$emit('create-response', [answerId, null])
        }
      }
    }
  }
</script>

<style scoped>
  .input-group.radio-group {
    padding-top:0px;
  }
</style>
