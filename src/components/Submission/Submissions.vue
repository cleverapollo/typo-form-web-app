<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 style="position: relative">
        <v-data-table
          :headers="headers"
          :items="submissions"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadSubmission(props.item.id)>{{ props.item.team ? props.item.team.name : props.item.user.first_name + props.item.user.last_name  }}'s Submission</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  export default {
    props: ['form_id'],
    data () {
      return {
        headers: [
          { text: 'Name', value: 'name', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      submissions () {
        return this.$store.getters.loadedSubmissions(parseInt(this.form_id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadSubmission (id) {
        this.$router.push('/applications/' + this.form_id + '/submissions/show/' + id)
      }
    },
    created: function () {
      this.$store.dispatch('loadSubmissions', this.form_id)
    }
  }
</script>
