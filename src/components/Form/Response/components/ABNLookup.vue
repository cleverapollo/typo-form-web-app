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
  import _ from 'lodash'
  export default {
    name: 'abn-lookup',
    props: ['question', 'answers', 'responses', 'disabled'],
    methods: {
      onSave (value) {
        if (!value) {
          return
        }
        this.$emit('create-response', [null, value])
      }
    },
    computed: {
      value () {
        const value = {
          Abn: '',
          BusinessName: '',
          EntityName: '',
          EntityTypeName: '',
          Message: ''
        }
        _.forEach(this.responses, response => {
          const answer = this.answers.filter(answer => answer.id === response.answer_id)
          if (answer.length) {
            value[answer[0].answer] = response.response
          }
        })
        return value
      }
    }
  }
</script>