<template>
  <v-layout row wrap>
    <v-flex sm5>
      <v-text-field
        label="ABN"
        name="short-answer"
        :value="value.Abn"
        @change="onSave($event)"
        :rules="[validate]"
        :disabled="disabled"
      ></v-text-field>
    </v-flex>
    <v-flex sm5 offset-sm2>
      <v-text-field
        label="Business Name"
        name="business-name"
        :value="value.BusinessName"
        readonly
      ></v-text-field>
    </v-flex>
    <v-flex sm5>
      <v-text-field
        label="Entity Name"
        name="entity-name"
        :value="value.EntityName"
        readonly
      ></v-text-field>
    </v-flex>
    <v-flex sm5 offset-sm2>
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
  import validationMixin from '../ResponseValidationMixin'

  export default {
    name: 'short-answer',
    mixins: [validationMixin],
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
      message () {
        if (!this.responses.length) {
          return ''
        }
        return this.responses[0].response
      },
      value () {
        let value = {
          Abn: '',
          BusinessName: '',
          EntityName: '',
          EntityTypeName: ''
        }

        if (this.responses.length && this.responses[0].response !== '') {
          value = JSON.parse(this.responses[0].response)
        }
        return value
      }
    }
  }
</script>
