<template>
  <v-dialog v-model="createTeam" persistent max-width="600">
    <v-btn slot="activator" fixed dark bottom right fab router class="error">
      <v-icon>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex>
              <h1 class="mb-4">Create Team</h1>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="name"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                v-model="description"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn color="primary" @click.stop="save" :disabled="!formIsValid">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['slug'],
    data () {
      return {
        name: '',
        description: '',
        createTeam: false
      }
    },
    computed: {
      formIsValid () {
        return this.name !== ''
      }
    },
    methods: {
      save () {
        if (!this.formIsValid) {
          return
        }
        const teamData = {
          slug: this.slug,
          name: this.name,
          description: this.description
        }
        this.$store.dispatch('createTeam', teamData)
        this.close()
      },
      close () {
        this.name = ''
        this.description = ''
        this.createTeam = false
      }
    }
  }
</script>
