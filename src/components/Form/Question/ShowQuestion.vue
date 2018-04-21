<template>
  <form-view :applicationName="applicationName" :formId="id" :submissionId="-1"></form-view>
</template>

<script>
  import formView from '../FormView'

  export default {
    props: ['applicationName', 'id'],
    components: {
      formView
    }
  }
</script>
