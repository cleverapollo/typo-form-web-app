<template>
  <v-dialog width="350px" persistent v-model="createQuestion">
    <v-btn
      dark
      class="primary"
      slot="activator"
    >
      Create Question
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Create Question</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="name"
                label="Name"
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
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn
                flat
                class="secondary"
                @click="onCancel"
              >
                Close
              </v-btn>
              <v-btn 
                flat 
                class="primary" 
                @click="onSaveChanges"
                :disabled="loading"
                :loading="loading"
              >
                Save
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['order', 'section_id', 'form_id'],
    data () {
      return {
        createQuestion: false,
        editedName: '',
        editedDescription: '',
        questionType: 1,
        mandatory: false
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '' || this.editedDescription.trim() === '') {
          return
        }
        this.createQuestion = false
        this.$store.dispatch('createQuestion',
          {
            formid: this.form_id,
            sectionid: this.section_id,
            question: this.editedName,
            description: this.editedDescription,
            question_type_id: this.questionType,
            mandatory: this.mandatory,
            order: this.order
          })
        this.editedName = ''
        this.editedDescription = ''
        this.mandatory = false
        this.questionType = 1
      },
      onCancel () {
        this.editedName = ''
        this.editedDescription = ''
        this.mandatory = false
        this.questionType = 1
        this.createQuestion = false
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      },
      questionTypes () {
        return this.$store.getters.loadedQuestionTypes
      }
    },
    created: function () {
      this.$store.dispatch('loadQuestionTypes')
    }
  }
</script>
