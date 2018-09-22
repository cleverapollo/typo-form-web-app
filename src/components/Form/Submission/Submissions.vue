<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Submissions</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing submission below or <a href="#" @click.stop="createSubmission = true">create a new submission</a>.</p>
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
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <tr @click="onSubmission(props.item.id)">
                  <td>{{ props.item.form.name }}</td>
                  <td>{{ props.item.owner }}</td>
                  <td>{{ props.item.created_at.date | moment }}</td>
                  <td>{{ props.item.updated_at.date | moment }}</td>
                  <td>{{ props.item.status }}</td>
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
    name: 'Submissions',
    components: {
      CreateSubmission
    },
    data () {
      return {
        createSubmission: false,
        search: '',
        headers: [
          { text: 'Submission', value: 'form.name', sortable: true, align: 'left' },
          { text: 'Owner', value: 'owner', sortable: true, align: 'left' },
          { text: 'Created', value: 'created_at.date', sortable: true, align: 'left' },
          { text: 'Modified', value: 'updated_at.date', sortable: true, align: 'left' },
          { text: 'Status', value: 'status', sortable: true, align: 'left' }
        ],
        slug: window.location.hostname.split[0]
      }
    },
    computed: {
      submissions () {
        let submissions = this.$store.getters.loadedAllSubmissions(this.slug)
        submissions.forEach((submission) => {
          submission.owner = submission.team ? submission.team.name : submission.user.first_name + ' ' + submission.user.last_name
          submission.status = this.status(submission.status_id)
        })
        return submissions
      },
      statuses () {
        return this.$store.getters.statuses
      }
    },
    methods: {
      onSubmission (id) {
        this.$router.push('/submissions/' + id)
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
