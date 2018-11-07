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
                <tr>
                  <td @click="onSubmission(props.item.id)">{{ props.item.form.name }}</td>
                  <td @click="onSubmission(props.item.id)">{{ props.item.owner }}</td>
                  <td @click="onSubmission(props.item.id)">{{ props.item.user.email }}</td>
                  <td @click="onSubmission(props.item.id)">{{ props.item.created_at.date | moment }}</td>
                  <td @click="onSubmission(props.item.id)">{{ props.item.updated_at.date | moment }}</td>
                  <td @click="onSubmission(props.item.id)">{{ props.item.progress }}%</td>
                  <td @click="onSubmission(props.item.id)">{{ props.item.status }}</td>
                  <td class="justify-center layout px-0">
                    <EditSubmission :slug="slug" :submission="props.item" :formId="props.item.form.id" :btnRect="true" :key="props.item.id"></EditSubmission>
                    <v-btn icon class="mx-0" @click="onDeleteSubmission(props.item.id, props.item.form.id)">
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
                  </td>
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
    <CreateSubmission :visible="createSubmission" :slug="slug" @close="createSubmission = false" key="CreateSubmission"></CreateSubmission>
  </v-layout>
</template>

<script>
  import CreateSubmission from './CreateSubmission'
  import EditSubmission from './EditSubmission'
  import moment from 'moment'

  export default {
    name: 'Submissions',
    components: {
      CreateSubmission,
      EditSubmission
    },
    data () {
      return {
        createSubmission: false,
        search: '',
        headers: [
          { text: 'Submission', value: 'form.name', sortable: true, align: 'left' },
          { text: 'Owner', value: 'owner', sortable: true, align: 'left' },
          { text: 'Email', value: 'user.email' },
          { text: 'Created', value: 'created_at.date', sortable: true, align: 'left' },
          { text: 'Modified', value: 'updated_at.date', sortable: true, align: 'left' },
          { text: 'Progress', value: 'progress', sortable: true, align: 'left' },
          { text: 'Status', value: 'status', sortable: true, align: 'left' },
          { text: 'Action', value: 'action', sortable: true, align: 'left' }
        ],
        slug: window.location.hostname.split('.')[0]
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
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
      onDeleteSubmission: function (id, formId) {
        this.$store.dispatch('deleteSubmission',
          {
            formId: formId,
            id: id
          }
        )
      },
      onSubmission (id) {
        this.$router.push('/submissions/' + id)
      },
      status (id) {
        return this.statuses.find(e => { return e.id === id }).status
      }
    },
    created: function () {
      if (this.user) {
        this.$store.dispatch('loadUsers', this.slug)
        this.$store.dispatch('loadTeams', this.slug)
        this.$store.dispatch('loadForms', this.slug)
        this.$store.dispatch('loadAllSubmissions', this.slug)
        this.$store.dispatch('loadAllTeamUsers', this.slug)
      }
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
