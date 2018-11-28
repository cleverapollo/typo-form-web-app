<template>
  <v-layout row>
    <v-flex xs12>
      <v-autocomplete
        :items="addresses"
        @change="onSave($event)"
        :disabled="disabled"
        label="Address"
      ></v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'Address',
    props: ['question', 'answers', 'responses', 'disabled', 'formTemplateId', 'sectionId', 'questionId'],
    data () {
      return {
        message: '',
        addresses: []
      }
    },
    methods: {
      onSave (value) {
        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      },
      setAddresses () {
        this.addresses = []
      }
    },
    mounted () {
      if (this.responses.length) {
        this.message = this.responses[0].response
        this.setAddresses()
      }
    }
  }
</script>
