<template>
  <v-card>
    <v-card-title>
      <div>
        <h3>{{'Question ' + (question.order)}}</h3>
        <v-text-field
          name="name"
          label="Question"
          id="name"
          v-model="editedName"
          required></v-text-field>
        <v-text-field
          name="description"
          label="Description"
          id="description"
          v-model="editedDescription"
          required></v-text-field>
        <v-select
          :items="questionTypes"
          item-text="type"
          item-value="id"
          v-model="questionType"
          label="Question Type"
          single-line
        ></v-select>
        <v-switch
          :label="`Required`"
          v-model="mandatory"
        ></v-switch>
      </div>
    </v-card-title>
    <v-card-text>
      <draggable v-model="answers" class="dragArea" :options="{group:'people', draggable:'.item' + this.question.id}" style="min-height: 100px">
        <div v-for="(element, index) in answers" :key="'Answer ' + element.id" class="item" + this.question.id>
          <answers :answer='element' :formid='formid' :sectionid='sectionid' :questionid ='this.id'></answers>
        </div>
        <div slot="footer" v-if="isQuestionEmpty">
          <v-card>
            <v-card-title>
              <h3>There is no answers</h3>
            </v-card-title>
          </v-card>
        </div>
      </draggable>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="success" @click=onDuplicateQuestion>Duplicate Question</v-btn>
      <v-btn class="error" @click=onDeleteQuestion>Delete Question</v-btn>
      <app-create-answer :order="answers.length === 0 ? 1 : answers[answers.length-1].order + 1" :formid="formid" :sectionid="sectionid" :questionid="question.id"></app-create-answer>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import answers from '../Answer/Answers.vue'
  export default {
    props: ['question', 'formid', 'sectionid'],
    components: {
      draggable,
      answers
    },
    data () {
      return {
        editedName: this.question.question,
        editedDescription: this.question.description,
        questionType: 1,
        mandatory: false,
        answers: this.question.answers
      }
    },
    computed: {
      questionTypes () {
        return this.$store.getters.loadedQuestionTypes
      },
      isQuestionEmpty () {
        return !this.answers.length
      }
    },
    methods: {
      checkMove: function (evt) {
        console.log(evt)
      },
      onUpdateQuestion () {
        if (this.question.trim() === '') {
          return
        }
        this.$store.dispatch('updateQuestion',
          {
            formid: this.formid,
            sectionid: this.sectionid,
            id: this.question.id,
            question: this.editedName,
            description: this.editedDescription,
            question_type_id: this.questionType,
            mandatory: this.mandatory,
            order: this.question.order
          })
      },
      onDuplicateQuestion () {
        this.$store.dispatch('duplicateQuestion', {
          formid: this.formid,
          sectionid: this.sectionid,
          id: this.question.id
        })
      },
      onDeleteQuestion () {
        this.$store.dispatch('deleteQuestion', {
          formid: this.formid,
          sectionid: this.sectionid,
          id: this.question.id
        })
      }
    }
  }
</script>
