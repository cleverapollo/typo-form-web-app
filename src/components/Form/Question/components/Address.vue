<template>
  <div />
</template>
<script>
  import * as _ from 'lodash'
  export default {
    name: 'Address',
    props: ['answers'],
    mounted () {
      _.forEach(this.answers, (answer, index) => {
        if (answer.answer !== 'City' &&
          answer.answer !== 'State' &&
          answer.answer !== 'Postcode' &&
          answer.answer !== 'Country'
        ) {
          this.$emit('delete-answer', this.answers[index].id)
        }
      })
      const addresses = [
        'City',
        'State',
        'Postcode',
        'Country'
      ]
      _.forEach(addresses, (address, index) => {
        const city = this.answers.filter(answer => answer.answer === address)
        if (!city.length) {
          this.$emit('create-answer', [address, false])
        }
      })
    }
  }
</script>
