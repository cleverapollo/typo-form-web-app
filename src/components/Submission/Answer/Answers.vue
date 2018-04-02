<template>
  <v-card>
    <v-card-title>
      <div>
        <h3>{{'Answer ' + (answer.order)}}</h3>
        <v-text-field
          name="name"
          label="Answer"
          id="name"
          v-model="editedName"
          required></v-text-field>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click=onUpdateAnswer>Update Answer</v-btn>
      <v-btn class="error" @click=onDeleteAnswer>Delete Answer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    props: ['answer', 'form_id', 'section_id', 'question_id'],
    components: {
      draggable
    },
    data () {
      return {
        editedName: this.answer.answer
      }
    },
    methods: {
      checkMove: function (evt) {
        console.log(evt)
      },
      onUpdateAnswer () {
        if (this.editedName.trim() === '') {
          return
        }
        this.$store.dispatch('updateAnswer',
          {
            formid: this.form_id,
            sectionid: this.section_id,
            questionid: this.question_id,
            id: this.answer.id,
            answer: this.editedName,
            order: this.answer.order
          })
      },
      onDeleteAnswer () {
        this.$store.dispatch('deleteAnswer', {
          formid: this.form_id,
          sectionid: this.section_id,
          questionid: this.question_id,
          id: this.answer.id
        })
      }
    }
  }
</script>
