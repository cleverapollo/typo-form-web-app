<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Team</h1>
              <form @submit.prevent="onCreateTeam">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="title"
                      label="Title"
                      id="title"
                      v-model="title"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="description"
                      label="Description"
                      id="description"
                      v-model="description"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      class="primary"
                      :disabled="!formIsValid"
                      type="submit">Create Team</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        description: ''
      }
    },
    computed: {
      formIsValid () {
        return this.title !== ''
      }
    },
    methods: {
      onCreateTeam () {
        if (!this.formIsValid) {
          return
        }
        const teamData = {
          title: this.title,
          description: this.description
        }
        this.$store.dispatch('createTeam', teamData)
        this.$router.push('/teams')
      }
    }
  }
</script>
