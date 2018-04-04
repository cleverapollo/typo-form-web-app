<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card v-if="form">
          <v-card-title>
            <h1 class="primary--text">{{ form.name }}</h1>
            <v-spacer></v-spacer>
            <v-menu offset-y bottom left>
              <v-btn icon slot='activator'>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click=''>
                  <v-list-tile-title>
                    <app-create-section :section_id='-1' :form_id='id'></app-create-section>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click=''>
                  <v-list-tile-title>
                    <app-edit-form :form='form' :application_id='application_id'></app-edit-form>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-for='(action, key) in actions' :key="`action ${key}`" @click='action.cb'>
                  <v-list-tile-title>{{ action.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <draggable v-model="list" class="dragArea parent" :options="{group:'people', draggable:'.section'}" style="min-height: 100px" :move="checkMove" @add="checkAdd" @remove="checkRemove">
              <div v-for="(element, index) in list" :key="'Section ' + element.id" class="section item pb-5">
                <sections :section='element' :form_id='id' :form_type="form_type"></sections>
              </div>
            </draggable>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import sections from '../Section/Sections.vue'

  export default {
    props: ['application_id', 'id', 'submission_id', 'form_type'],
    components: {
      draggable,
      sections
    },
    data () {
      return {
        showDialog: false,
        actions: [{
          name: 'Delete Form',
          cb: this.onDeleteForm.bind(this)
        }]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.id, null)
        },
        set (value) {
          const updateObj = {
            id: -1,
            value: value
          }
          this.$store.dispatch('updateSection', updateObj)
        }
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsnotAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.application_role !== 'Admin' && this.application.application_role !== 'Super Admin'
      },
      form () {
        return this.$store.getters.loadedForm(parseInt(this.application_id), parseInt(this.id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          applicationid: this.application_id,
          id: this.form.id
        })
        this.$router.push('/applications/' + this.application_id + '/forms')
      },
      createSection () {
        this.showDialog = true
      },
      hideDialog () {
        this.showDialog = false
      },
      checkMove: function (evt) {
        console.log('moved', evt)
        if (evt.to.className.includes('parent') && evt.dragged.className.includes('question')) {
          return false
        }
        return true
      },
      checkAdd: function (evt) {
        console.log('added', evt)
      },
      checkRemove: function (evt) {
        console.log('removed', evt)
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.application_id)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadQuestionTypes')
    }
  }
</script>
