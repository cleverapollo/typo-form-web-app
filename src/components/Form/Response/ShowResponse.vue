<template>
  <responses :applicationName="applicationName" :formId="id"></responses>
</template>

<script>
  import responses from '../Submission/Submissions'

  export default {
    props: ['applicationName', 'id'],
    components: {
      responses
    }
  }
</script>
