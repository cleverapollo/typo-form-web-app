<template>
  <div>
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
                    <app-create-section :parent_section_id='-1' :form_id='id'></app-create-section>
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
            <draggable v-model="list" class="parent" :options="{group:'parent', draggable:'.item', handle:'.handle'}" style="min-height: 100px" @end="checkEnd">
              <div v-for="(element, index) in list" :key="'Section ' + element.id" :class="'section' + element.id" class="item pb-5">
                <sections :section='element' :form_id='id'></sections>
              </div>
            </draggable>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
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
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.id, null)
        },
        set (value) {
          // TODO: update
        }
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsnotAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'User'
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
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
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
      checkEnd: function (evt) {
        if (evt.to.className === evt.from.className && evt.newIndex === evt.oldIndex) {
          return
        }
        if (evt.item.className.includes('question') && evt.to.className.includes('parent')) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.to.className === evt.from.className && evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }

        const elementClass = evt.item.className
        const parentClass = evt.to.className
        let parentSectionId = parentClass.substr(7)
        if (parentSectionId === '') {
          parentSectionId = null
        } else {
          parentSectionId = parseInt(parentSectionId)
        }

        const children = this.$store.getters.loadedChildren(this.id, parentSectionId)
        let order = 0
        if (children.length === 0) {
          order = 1
        } else if (children.length === newIndex) {
          order = children[newIndex - 1].order + 1
        } else {
          order = children[newIndex].order
        }

        if (elementClass.includes('section')) {
          const elementId = parseInt(elementClass.substr(17))
          this.$store.dispatch('moveSection',
            {
              formid: this.id,
              sectionid: elementId,
              parent_section_id: parentSectionId,
              order: order
            })
        } else {
          const oldparentClass = evt.from.className
          const oldparentSectionId = parseInt(oldparentClass.substr(7))
          const elementId = parseInt(elementClass.substr(18))
          this.$store.dispatch('moveQuestion',
            {
              formid: this.id,
              questionid: elementId,
              oldparent_section_id: oldparentSectionId,
              parent_section_id: parentSectionId,
              order: order
            })
        }
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadForms', this.application_id)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadQuestionTypes')
    }
  }
</script>
