<template>
  <draggable v-model='list' class='dragArea' :options='{draggable:".answer"}' style='min-height: 100px' @end='checkEnd'>
    <v-layout row v-for='(answer, index) in list' :key='"Option " + index' class='answer' :class='"answer" + answer.id'>
      <v-flex style='max-width: 30px; min-width: 30px' class='mt-4'>
        {{index+1}}.
      </v-flex>
      <v-flex xs10 style='min-width: 60px'>
        <v-text-field
          :disabled='!answer.parameter'
          :value='answer.answer'
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
      },
      checkEnd: function (evt) {
        if (evt.newIndex === evt.oldIndex) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }

        let order = 1
        if (this.answers.length === newIndex) {
          order = this.answers[newIndex - 1].order + 1
        } else {
          order = this.answers[newIndex].order
        }

        const elementId = parseInt(evt.item.className.substr(24))
        this.$emit('move-answer', [elementId, order])
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
    },
    computed: {
      list: {
        get () {
          return this.answers
        },
        set (value) {
          // TODO: Drggable components
        }
      }
    }
  }
</script>
