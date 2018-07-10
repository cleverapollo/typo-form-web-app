<template>
  <v-dialog width="600px" persistent v-model="createQuestion">
    <div slot="activator">
      Create Question
    </div>

    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Create Question</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-layout row>
          <v-flex xs12>
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
          </v-flex>
        </v-layout>
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click="onCancel">Close</v-btn>
            <v-btn class="primary" @click="onSaveChanges" :disabled="loading" :loading="loading">Save
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
      
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
        return this.$store.getters.questionTypes.filter(e => { return e.type !== 'Content Block' })
      }
    }
  }
</script>
