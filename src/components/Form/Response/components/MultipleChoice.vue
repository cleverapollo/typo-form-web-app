<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-radio-group v-model="optionModel" :row="hasValidation">
        <template v-for='(answer, index) in answers'>
          <v-radio
            color="info"
            :disabled="disabled"
            :key='"Option " + index'
            :label="answer.answer"
            :value="answer.id"
            @change="onSave(answer.id)"
            v-if="answer.parameter"
          >
          </v-radio>
          <v-layout row wrap v-else>
            <v-radio
              color="info"
              :disabled="disabled"
              :value="answer.id"
              @change="onSave(answer.id)"
              class="shrink mr-1"
            >
            </v-radio>
            <v-text-field
              :label="answer.answer"
              :disabled="!enabled"
              v-model="responseValue"
              @change="onUpdate(answer.id)"
            >
            </v-text-field>
          </v-layout>
        </template>
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
        optionModel: this.responses.length ? this.responses[0].answer_id : '',
        responseValue: null
      }
    },
    mounted () {
      if (this.responses.length) {
        this.responseValue = this.responses[0].response
      }
    },
    computed: {
      other () {
        return this.answers.find((answer) => !answer.parameter)
      },
      enabled () {
        return this.responses.length && this.responses[0].answer_id === this.other.id
      }
    },
    methods: {
      onSave (answerId) {
        if (this.responses.length) {
          let updateResponse = null
          if (answerId === this.other.id) {
            updateResponse = this.responseValue
          } else {
            this.responseValue = null
          }
          this.$emit('update-response', [answerId, updateResponse, this.responses[0].id])
        } else {
          this.$emit('create-response', [answerId, null])
        }
      },
      onUpdate (answerId) {
        if (this.responses.length) {
          this.$emit('update-response', [answerId, this.responseValue, this.responses[0].id])
        }
      }
    }
  }
</script>

<style scoped>
  .input-group.radio-group {
    padding-top:0;
  }
</style>
