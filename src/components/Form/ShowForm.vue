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
          </v-card-title>
          <v-card-text>
            <draggable v-model="list" class="dragArea parent" :options="{group:'people', draggable:'.section'}" style="min-height: 100px" :move="checkMove" @add="checkAdd" @remove="checkRemove">
              <div v-for="(element, index) in list" :key="'Section ' + element.id" class="section item">
                <sections :section='element' :formid='id'></sections>
              </div>
            </draggable>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <app-create-section :order="list.length === 0 ? 1 : list[list.length-1].order + 1" :section_id=-1 :form_id="id"></app-create-section>
            <app-edit-form :form="form" :application_id="application_id"></app-edit-form>
            <v-btn class="error" @click=onDeleteForm>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import sections from '../Section/Sections.vue'
  export default {
    props: ['application_id', 'id'],
    components: {
      draggable,
      sections
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
        return this.application.role !== 'Admin' && this.application.role !== 'Super Admin'
      },
      form () {
        return this.$store.getters.loadedForm(parseInt(this.application_id), parseInt(this.id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      userIsnotAdmin (value) {
        if (value) {
          this.$router.push('/applications/' + this.application_id + '/forms/show/' + this.id + '/submission')
        }
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
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadForms', this.application_id)
      this.$store.dispatch('loadSections', this.id)
    }
  }
</script>
