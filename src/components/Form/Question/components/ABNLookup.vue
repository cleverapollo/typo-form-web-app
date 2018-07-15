<template>
  <div>
  </div>
</template>

<script>
  import validationMixin from '../QuestionValiationMixin'

  export default {
    name: 'short-answer',
    mixins: [
      validationMixin
    ],
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    },
    mounted () {
    }
  }
</script>
