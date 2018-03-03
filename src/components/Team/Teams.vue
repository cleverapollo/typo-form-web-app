<template>
  <v-container>
    <v-layout row wrap v-for="team in teams" :key="team.id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h5 class="white--text mb-0">{{ team.name }}</h5>
                  </div>
                </v-card-title>
                <v-card-text>
                  <div>{{ team.description }}</div>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat @click=onLoadTeam(team.id)>
                    <v-icon left light>arrow_forward</v-icon>
                    View Team
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2 text-xs-right>
        <v-btn large router to="/teams/new" class="primary">Create New Team</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      teams () {
        return this.$store.getters.loadedTeams
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadTeam (id) {
        this.$router.push('/teams/show/' + id)
      }
    }
  }
</script>
