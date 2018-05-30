<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Create Team</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-layout row>
          <v-flex xs12 d-flex>
            <v-text-field
              name="name"
              label="Name"
              id="name"
              v-model="name"
              required>
            </v-text-field>
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
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn color="primary" @click.stop="save">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['slug', 'visible'],
    data () {
      return {
        name: '',
        description: ''
      }
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      },
      validForm () {
        return this.name !== ''
      }
    },
    methods: {
      save () {
        if (!this.validForm) {
          return false
        }
        const teamData = {
          slug: this.slug,
          name: this.name,
          description: this.description
        }
        this.$store.dispatch('createTeam', teamData)
        this.reset()
      },
      close () {
        this.reset()
      },
      reset () {
        this.name = ''
        this.description = ''
        this.show = false
      }
    }
  }
</script>
