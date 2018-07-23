<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-text-field
        label="ABN"
        name="short-answer"
        :value="value.Abn"
        @change="onSave($event)"
        type="number"
        :error-messages="value.Message"
        :disabled="disabled"
      ></v-text-field>
    </v-flex>
    <v-flex sm3>
      <v-text-field
        label="Business Name"
        name="business-name"
        :value="value.BusinessName"
        readonly
      ></v-text-field>
    </v-flex>
    <v-flex sm4 offset-sm1>
      <v-text-field
        label="Entity Name"
        name="entity-name"
        :value="value.EntityName"
        readonly
      ></v-text-field>
    </v-flex>
    <v-flex sm3 offset-sm1>
      <v-text-field
        label="Entity Type"
        name="entity-type"
        :value="value.EntityTypeName"
        readonly
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'abn-lookup',
    props: ['question', 'answers', 'responses', 'disabled'],
    methods: {
      onSave (value) {
        if (this.responses.length) {
          this.$emit('update-response', [null, value, this.responses[0].id])
        } else {
          this.$emit('create-response', [null, value])
        }
      }
    },
    computed: {
      value () {
        let value = {
          Abn: '',
          BusinessName: '',
          EntityName: '',
          EntityTypeName: '',
          Message: ''
        }

        if (this.responses.length && this.responses[0].response !== '') {
          value = JSON.parse(this.responses[0].response)
        }
        return value
      }
    }
  }
</script>