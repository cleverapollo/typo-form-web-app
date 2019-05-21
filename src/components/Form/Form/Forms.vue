<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class='headline primary--text py-3'>Forms</h1>
          <v-spacer></v-spacer>
          <div class="text-xs-right py-2" v-if="$_userIsApplicationAdmin()">
            <v-tooltip bottom>
              <v-btn icon @click="editMode = !editMode" slot="activator">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>Edit Page</span>
            </v-tooltip>
          </div>
        </v-flex>

        <v-flex d-flex xs12>
          <p>Select an existing form below or <a href='#' @click.stop='createForm = true'>create a new form</a>.</p>
        </v-flex>

        <v-flex>
          <CustomSlot type='formsHeader' :mode="editMode" />
        </v-flex>
        
        <v-flex d-flex xs12 v-if="!loading && items.length > 0">
          <DataTable
            title="Forms"
            item-key="id"
            v-bind:headers="headers"
            v-bind:items="items"
            v-bind:loading="loading"
            v-bind:pagination="pagination"
            @refresh="refreshItems"
            @delete="deleteItems"
            @click="selectItem"
            @create="createItem"
          ></DataTable>
        </v-flex>

        <v-flex d-flex xs12 v-if="!loading && items.length === 0">
            <Well
              title="You haven't created any forms yet!" 
              message="Let's get started, click here to create your first form"
              icon="assignment"
              @click='createForm = true'
            ></Well>
        </v-flex>

        <v-flex>
          <CustomSlot type='formsFooter' :mode="editMode" />
        </v-flex>
      </v-layout>
    </v-flex>

    <CreateForm :visible='createForm' :slug='this.$_slug' @close='createForm = false' key='CreateForm'></CreateForm>

  </v-layout>
</template>

<script>
  import CreateForm from './CreateForm'
  import CustomSlot from '../../Layout/CustomSlot'
  import DataTable from '../../DataTable/DataTable'
  import Well from '../../Shared/Well'
  import ApplicationMixin from '../../../mixins/ApplicationMixin'
  export default {
    name: 'Forms',
    mixins: [ApplicationMixin],
    components: {
      CreateForm,
      CustomSlot,
      DataTable,
      Well
    },
    data () {
      return {
        createForm: false,
        editMode: false,
        loading: false,
        pagination: { sortBy: 'updated', descending: true }
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      forms () {
        return this.$store.getters.loadedAllForms(this.$_slug)
      },
      items () {
        let items = []
        this.forms.forEach(form => {
          let item = {}
          item.id = form.id
          item.form_template_id = form.form_template.id
          item.form_template = form.form_template.name
          item.organisation = form.organisation ? form.organisation.name : ''
          item.user = form.user ? form.user.first_name + ' ' + form.user.last_name : ''
          item.email = form.user ? form.user.email : ''
          item.progress = form.progress || 0
          item.created = this.$_getDateTime(form.created_at)
          item.updated = this.$_getDateTime(form.updated_at)
          item.status = form.status
          items.push(item)
        })
        return items
      },
      headers () {
        let headers = [
          { text: 'Form ID', value: 'id' },
          { text: 'Form Template ID', value: 'form_template_id', visible: false },
          { text: 'Form Template', value: 'form_template' },
          { text: 'Organisation', value: 'organisation' },
          { text: 'User', value: 'user' },
          { text: 'Email', value: 'email' },
          { text: 'Progress', value: 'progress' },
          { text: 'Created', value: 'created', visible: false },
          { text: 'Updated', value: 'updated' },
          { text: 'Status', value: 'status' }
        ]
        return headers
      }
    },
    methods: {
      refreshItems () {
        this.loadData()
      },
      deleteItems (items) {
        items.forEach(item => {
          const formTemplateId = this.forms.find(form => form.id === item).form_template.id
          this.$store.dispatch('deleteForm', { formTemplateId: formTemplateId, id: item })
        })
        this.loadData()
      },
      selectItem (item) {
        this.$router.push('/forms/' + item)
      },
      createItem () {
        this.createForm = true
      },
      loadData () {
        this.loading = true
        Promise.all([
          this.$store.dispatch('loadUserAcl'),
          this.$store.dispatch('loadOrganisations', this.$_slug),
          this.$store.dispatch('loadFormTemplates', this.$_slug),
          this.$store.dispatch('loadAllForms', this.$_slug)
        ]).then(() => {
          this.loading = false
        })
      }
    },
    created: function () {
      this.loadData()
    }
  }
</script>
