<template>
  <v-layout row>
    <v-flex xs12>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        :filter="customFilter"
        color="white"
        item-text="formatted_address"
        item-value="keyword"
        label="Address"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
        return-object
        @change="onSave"
      ></v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  export default {
    name: 'Address',
    props: ['question', 'answers', 'responses', 'disabled', 'formTemplateId', 'sectionId', 'questionId'],
    data () {
      return {
        message: '',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=address_string&key=${process.env.GOOGLE_API_KEY}`,
        address: {},
        isLoading: false,
        search: null,
        model: null
      }
    },
    methods: {
      customFilter (item, queryText, itemText) {
        return item.keyword === queryText
      },
      onSave (value) {
        if (!value) {
          return
        }
        _.forEach(this.responses, response => {
          this.$emit('delete-response', response.id)
        })
        for (const property in value) {
          const answer = this.answers.filter(answer => property === answer.answer)
          if (answer.length) {
            this.$emit('create-response', [answer[0].id, value[property]])
          }
        }
      }
    },
    computed: {
      items () {
        if (!this.address.formatted_address) return []
        let items = []
        items.push(this.address)
        return items
      }
    },
    watch: {
      search (val) {
        if (!val) return
        if (this.isLoading) return

        this.isLoading = true
        let addressURL = this.url.replace('address_string', val)
        const instance = axios.create()
        instance.get(addressURL)
          .then(res => {
            if (res.data.results.length) {
              const addressComponents = res.data.results[0].address_components
              this.address = {}
              _.forEach(addressComponents, addressComponent => {
                this.address[addressComponent.types[0]] = addressComponent.long_name
              })
              this.address['keyword'] = val
              this.address['formatted_address'] = res.data.results[0].formatted_address
            }
          })
          .finally(() => (this.isLoading = false))
      }
    },
    mounted () {
      if (this.responses.length) {
        this.model = {}
        _.forEach(this.responses, response => {
          const answer = this.answers.filter(answer => answer.id === response.answer_id)
          if (answer.length) {
            this.model[answer[0].answer] = response.response
          }
        })
        this.model['keyword'] = this.model['formatted_address']
        this.address = this.model
      }
    }
  }
</script>
