<template>
  <div>
    <v-layout row>
      <v-flex xs10>
        <v-text-field
          name="paragraph"
          value="Long answer text"
          multiple
          disabled
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout v-if="hasValidation" row>
      <v-flex xs4>
        <v-select
          label='Validation type'
          :items="validationTypes"
          v-model="activeValidationType"
        ></v-select>
      </v-flex>
      <v-flex v-if='"Text" === activeValidationType' xs3 offset-xs1>
        <v-text-field
          name='min-char-count'
          label='Minimum character count'
          v-model='minCharCount'
          mask='###'
        ></v-text-field>
      </v-flex>
      <v-flex v-if='"Text" === activeValidationType' xs3 offset-xs1>
        <v-text-field
          name='max-char-count'
          label='Maximum character count'
          v-model='maxCharCount'
          mask='###'
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'paragraph',
    props: {
      'answers': {
        default: function () {
          return []
        }
      },
      hasValidation: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        activeValidationType: 'Number',
        validationTypes: [
          'Number', 'Text', 'Email'
        ],
        minCharCount: 0,
        maxCharCount: 0
      }
    },
    mounted () {
      if (this.answers.length) {
        this.$emit('delete-answers')
      }
    }
  }
</script>
