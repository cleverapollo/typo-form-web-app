<template>
  <v-layout row wrap>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Submissions</div>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <!-- //Search -->
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <!-- //Submissions -->
            <v-data-table
              :headers="headers"
              :items="submissions"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <tr @click="onSubmission(props.item.id)">
                  <td>{{ props.item.form.name }}</td>
                  <td>{{ props.item.team ? props.item.team.name : props.item.user.first_name + ' ' + props.item.user.last_name }}</td>
                  <td>{{ props.item.created_at.date | moment }}</td>
                  <td>{{ props.item.updated_at.date | moment }}</td>
                  <td>{{ status(props.item.status_id) }}</td>
                </tr>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="red" @click.stop="createSubmission = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Submission</span>
    </v-tooltip>

    <!-- //Create Submission -->
    <CreateSubmission :visible="createSubmission" :slug="slug" @close="createSubmission = false"></CreateSubmission>
  </v-layout>
</template>

<script>
  import CreateSubmission from './CreateSubmission'
  import moment from 'moment'

  export default {
    props: ['slug'],
    components: {
      CreateSubmission
    },
    data () {
      return {
        createSubmission: false,
        search: '',
        headers: [
          { text: 'Submission', value: 'name', sortable: true, align: 'left' },
          { text: 'Owner', value: 'owner', sortable: true, align: 'left' },
          { text: 'Created', value: 'created_at', sortable: true, align: 'left' },
          { text: 'Modified', value: 'updated_at', sortable: true, align: 'left' },
          { text: 'Status', value: 'status', sortable: true, align: 'left' }
        ]
      }
    },
    computed: {
      submissions () {
        return this.$store.getters.loadedAllSubmissions(this.slug)
      },
      statuses () {
        return this.$store.getters.statuses
      }
    },
    methods: {
      onSubmission (id) {
        this.$router.push('/' + this.slug + '/submissions/' + id)
      },
      status (id) {
        return this.statuses.find(e => { return e.id === id }).status
      },
      onDeleteSubmission: function (formId, id) {
        this.$store.dispatch('deleteSubmission',
          {
            formId: formId,
            id: id
          }
        )
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadAllSubmissions', this.slug)
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>