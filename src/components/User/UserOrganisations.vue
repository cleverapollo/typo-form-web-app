<template>
  <DataTable
    title="Organisations"
    item-key="id"
    v-bind:headers="headers"
    v-bind:items="items"
    v-bind:loading="loading"
    @refresh="refreshOrganisations"
    @delete="deleteOrganisations"
    @click="selectOrganisation"
    @create="createOrganisation"
  ></DataTable>
</template>

<script>
import DataTable from '../DataTable/DataTable'
export default {
  name: 'UserOrganisations',
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
    headers () {},
    items () {}
  },
  methods: {
    refreshOrganisations () {},
    deleteOrganisations () {},
    selectOrganisation () {},
    createOrganisation () {}
  },
  created () {}
}
</script>
