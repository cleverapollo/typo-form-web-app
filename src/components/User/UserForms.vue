<template>
  <DataTable
    title="Forms"
    item-key="id"
    v-bind:headers="headers"
    v-bind:items="items"
    v-bind:loading="loading"
    @refresh="refreshForms"
    @delete="deleteForms"
    @click="selectForm"
  ></DataTable>
</template>

<script>
import DataTable from '../DataTable/DataTable'
export default {
  name: 'UserForms',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  components: {
    DataTable
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
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
    },
    user () {
      return this.$store.getters.user
    },
    forms () {
      return this.$store.getters.formsByUserId(this.userId)
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
    }
  },
  methods: {
    refreshForms () {
      this.loadData()
    },
    deleteForms (items) {
      items.forEach(item => {
        const formTemplateId = this.forms.find(form => form.id === item).form_template.id
        this.$store.dispatch('deleteForm', { formTemplateId: formTemplateId, id: item })
      })
      this.loadData()
    },
    selectForm (item) {
      this.$router.push('/forms/' + item)
    },
    createForm () {},
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
  created () {
    this.loadData()
  }
}
</script>
