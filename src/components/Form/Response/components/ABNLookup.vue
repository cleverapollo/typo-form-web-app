<template>
  <v-layout row wrap>
    <v-flex sm5>
      <v-text-field
        label="ABN"
        name="short-answer"
        :value="message"
        @change="onSave($event)"
        :rules="[validate]"
        :disabled="disabled"
      ></v-text-field>
    </v-flex>
    <v-flex sm5 offset-sm2>
      <v-text-field
        label="Business Name"
        name="business-name"
        :value="value.businessName"
        readonly
      ></v-text-field>
    </v-flex>
    <v-flex sm5>
      <v-text-field
        label="Entity Name"
        name="entity-name"
        :value="value.entityName"
        readonly
      ></v-text-field>
    </v-flex>
    <v-flex sm5 offset-sm2>
      <v-text-field
        label="Entity Type"
        name="entity-type"
        :value="value.entityType"
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
          businessName: '',
          entityName: '',
          entityType: ''
        }

        if (this.responses.length) {
          /* const instance = window.axios.create()
          delete instance.defaults.headers.common['API-Token']
          instance.get('https://abr.business.gov.au/json/AbnDetails.aspx?abn=' + this.responses[0].response + '&callback=callback&guid=9c1fe65f-650b-4ea8-838c-aa03d946db12')
            .then((response) => {
              console.log(response)
            }) */
        }
        return value
      }
    }
  }
</script>
