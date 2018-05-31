<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Create Form</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
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
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn flat class="primary" @click.stop="save">Save</v-btn>
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
        name: ''
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
      formIsValid () {
        return this.name !== ''
      }
    },
    methods: {
      save () {
        if (!this.formIsValid) {
          return
        }

        const formData = {
          slug: this.slug,
          name: this.name
        }
        this.$store.dispatch('createForm', formData)
        this.close()
      },
      close () {
        this.name = ''
        this.show = false
      }
    }
  }
</script>
