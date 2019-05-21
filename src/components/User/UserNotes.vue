<template>
  <DataTable
    title="Notes"
    item-key="id"
    v-bind:headers="headers"
    v-bind:items="items"
    v-bind:loading="loading"
    @refresh="refreshNotes"
    @delete="deleteNotes"
    @click="selectNote"
    @create="createNote"
  ></DataTable>
</template>

<script>
import DataTable from '../DataTable/DataTable'
export default {
  name: 'UserNotes',
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
    refreshNotes () {},
    deleteNotes () {},
    selectNote () {},
    createNote () {}
  },
  created () {}
}
</script>
