<template>
  <v-card>
    <v-card-title>
      <h3>{{'Answer ' + (answer.order)}}</h3>
      <v-text-field
        name="name"
        label="Answer"
        id="name"
        v-model="editedName"
        required></v-text-field>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="error" @click=onDeleteQuestion>Delete Answer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    props: ['answer', 'formid', 'sectionid', 'questionid'],
    components: {
      draggable
    },
    data () {
      return {
        editedName: this.answer.question
      }
    },
    methods: {
      checkMove: function (evt) {
        console.log(evt)
      },
      onUpdateQuestion () {
        if (this.answer.trim() === '') {
          return
        }
        this.$store.dispatch('updateQuestion',
          {
            formid: this.formid,
            sectionid: this.sectionid,
            question: this.editedName,
            description: this.editedDescription,
            question_type_id: this.questionType,
            mandatory: this.mandatory,
            order: this.question.order
          })
      },
      onDeleteAnswer () {
        this.$store.dispatch('deleteAnswer', {
          formid: this.formid,
          sectionid: this.sectionid,
          questioinid: this.question.id,
          id: this.id
        })
      }
    }
  }
</script>
