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
        if (answer.answer !== 'street_number' &&
          answer.answer !== 'route' &&
          answer.answer !== 'locality' &&
          answer.answer !== 'administrative_area_level_3' &&
          answer.answer !== 'administrative_area_level_2' &&
          answer.answer !== 'administrative_area_level_1' &&
          answer.answer !== 'country' &&
          answer.answer !== 'postal_code' &&
          answer.answer !== 'formatted_address'
        ) {
          this.$emit('delete-answer', this.answers[index].id)
        }
      })
      const addresses = [
        'street_number',
        'route',
        'locality',
        'administrative_area_level_3',
        'administrative_area_level_2',
        'administrative_area_level_1',
        'country',
        'postal_code',
        'formatted_address'
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
