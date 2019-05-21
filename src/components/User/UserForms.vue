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
    @create="createForm"
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
    headers () {},
    items () {}
  },
  methods: {
    refreshForms () {},
    deleteForms () {},
    selectForm () {},
    createForm () {}
  },
  created () {}
}
</script>
