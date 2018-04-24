<template>
  <submissions :applicationName="applicationName" :formId="id"></submissions>
</template>

<script>
  import submissions from '../Submission/Submissions'

  export default {
    props: ['applicationName', 'id'],
    components: {
      submissions
    }
  }
</script>
