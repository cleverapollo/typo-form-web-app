<template>
  <draggable v-model='answers' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
    <v-layout row v-for='(answer, index) in answers' :key='"Option " + index' :class='"item" + index'>
      <v-flex style='max-width: 20px; min-width: 20px' class='mt-4'>
        {{index+1}}.
      </v-flex>
      <v-flex xs10 style='min-width: 60px'>
        <v-text-field
          :disabled='!answer.parameter'
          :value='answer.answer'
          autofocus
          @change='updateAnswer(answer.id, $event)'
        ></v-text-field>
      </v-flex>
      <v-flex style='width: 30px'  v-show='answers.length > 1'>
        <v-btn flat icon @click='deleteAnswer(index)' class='mt-4'>
          <v-icon>close</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row d-inline-flex>
      <v-flex style='min-width: 20px' class='mt-4'>
        {{answers.length+1}}.
      </v-flex>
      <v-flex xs10 style='max-width: 80px'>
        <v-text-field
          value='Add option'
          @click='createAnswer'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </draggable>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'dropdown',
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    components: {
      draggable
    },
    methods: {
      createAnswer () {
        let str = `Option ${this.answers.length + 1}`
        if (this.computedHasOther) {
          str = `Option ${this.answers.length}`
        }
        this.$emit('create-answer', [str, true])
      },
      deleteAnswer (index) {
        this.$emit('delete-answer', this.answers[index].id)
      },
      setHasOther () {
        this.$emit('create-answer', ['Other...', false])
      },
      updateAnswer (index, value) {
        this.$emit('update-answer', [index, value])
      }
    },
    mounted () {
      if (this.answers.length === 0) {
        this.$emit('create-answer', ['Option 1', true])
      } else {
        if (this.answers.length === 2 && this.answers[0].answer.substr(0, 11) === 'LinearScale' && this.answers[1].answer.substr(0, 11) === 'LinearScale') {
          this.$emit('delete-answers')
        } else {
          const lastAnswer = this.answers[this.answers.length - 1]
          if (!lastAnswer.parameter) {
            this.$emit('change-answer')
          }
        }
      }
    }
  }
</script>
