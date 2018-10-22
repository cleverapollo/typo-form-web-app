<template>
  <div>
  </div>
</template>

<script>
  import validationMixin from '../QuestionValiationMixin'

  export default {
    name: 'abn-lookup',
    mixins: [
      validationMixin
    ],
    props: {
      'answers': {
        default: function () {
          return []
        }
      }
    }
  }
</script>
