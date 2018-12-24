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
        query_url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=address_string&key=${process.env.GOOGLE_API_KEY}&sessiontoken=1234567890`,
        details_url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJVS8PwyuAkGsR5LUlBeZ4pXY&key=${process.env.GOOGLE_API_KEY}&sessiontoken=1234567890`,
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
        console.log(value)
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
        let addressURL = this.query_url.replace('address_string', val)
        const instance = axios.create()
        instance.get(addressURL)
          .then(res => {
            console.log(res.data)
          })
          .finally(() => (this.isLoading = false))
      }
    },
    mounted () {}
  }
</script>
