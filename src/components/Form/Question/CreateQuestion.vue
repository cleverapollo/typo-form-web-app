<template>
  <v-dialog width="350px" persistent v-model="createQuestion">
    <div slot="activator">
      Create Question
    </div>
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
                :rules="[(value) => value.length > 0 || 'Please input name.']"
                required></v-text-field>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                v-model="editedDescription"
              ></v-text-field>
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
              <v-spacer></v-spacer>
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
              <v-btn
                flat
                class="secondary"
                @click="onCancel"
              >
                Close
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
    props: ['sectionId', 'formId'],
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
        if (this.editedName.trim() === '') {
          return
        }
        this.createQuestion = false
        this.$store.dispatch('createQuestion',
          {
            formId: this.formId,
            sectionId: this.sectionId,
            question: this.editedName,
            description: this.editedDescription,
            questionTypeId: this.questionType,
            mandatory: this.mandatory
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
      loading () {
        return this.$store.getters.loading
      },
      questionTypes () {
        return this.$store.getters.questionTypes
      }
    }
  }
</script>
