<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <div class="title mb-2 mt-2">Create Application</div>
      </v-card-title>
      <v-card-text>
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              name="name"
              label="Name"
              id="name"
              v-model="name"
              required></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
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
      }
    },
    methods: {
      save () {
        let data = {
          name: this.name
        }
        let vm = this
        this.$store.dispatch('createApplication', data)
          .then(function (response) {
            vm.$emit('close')
            vm.name = ''
          })
      },
      close () {
        this.name = ''
        this.show = false
      }
    },
    props: ['visible']
  }
</script>