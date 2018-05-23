<template>
  <v-container>
    <v-layout wrap>
      <v-flex d-flex>
		<v-card>
			<v-card-title>
			<div class="title">
				Applications
			</div>
			<v-spacer></v-spacer>
			<v-text-field
				v-model="search"
				append-icon="search"
				label="Search"
				single-line
				hide-details
			></v-text-field>
			<v-btn
			fixed
			bottom
			right
			dark
			fab
			router
			to="/applications/new"
			class="primary"
			v-if=userIsSuper
			>
			<v-icon>add</v-icon>
			</v-btn>
			</v-card-title>
			<v-data-table
				:headers="headers"
				:items="applications"
				:search="search"
				hide-actions
				class="elevation-1"
			>
				<template slot="items" slot-scope="props">
				<td @click=onLoadApplication(props.item)>
					<div class="application-icon d-inline-block" v-if="props.item.icon">
					<img :src="api_url + 'uploads/' + props.item.icon"/>
					</div>
				</td>
				<td @click=onLoadApplication(props.item)>{{ props.item.name }}</td>
				<td @click=onLoadApplication(props.item)>{{ props.item.forms }}</td>
				<td @click=onLoadApplication(props.item)>{{ props.item.submissions }}</td>
				<td @click=onLoadApplication(props.item)>{{ props.item.users }}</td>
				<td @click=onLoadApplication(props.item)>{{ props.item.teams }}</td>
				</template>
				<v-alert slot="no-results" :value="true" color="error" icon="warning">
				Your search for "{{ search }}" found no results.
				</v-alert>
			</v-data-table>
		</v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      api_url: process.env.API_ORIGIN_URL,
      search: '',
      headers: [
        { text: 'Icon', value: 'icon', sortable: false, align: 'left' },
        { text: 'Name', value: 'name', sortable: true, align: 'left' },
        { text: 'Forms', value: 'forms', sortable: true, align: 'left' },
        { text: 'Submissions', value: 'submissions', sortable: true, align: 'left' },
        { text: 'Users', value: 'users', sortable: true, align: 'left' },
        { text: 'Teams', value: 'teams', sortable: true, align: 'left' }
      ]
    }
  },
  computed: {
    roles () {
      return this.$store.getters.roles
    },
    applications () {
      return this.$store.getters.loadedApplications
    },
    loading () {
      return this.$store.getters.loading
    },
    userIsSuper () {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined &&
        this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      )
    }
  },
  methods: {
    getRole (roleId) {
      const role = this.roles.find(role => {
        return role.id === roleId
      })
      return role ? role.name : 'undefined'
    },
    onLoadApplication (application) {
      this.$router.push('/' + application.slug)
    }
  }
}
</script>
