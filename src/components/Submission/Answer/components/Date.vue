<template>
  <v-layout row>
    <v-flex xs4>
      <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          label="MM/DD/YYYY"
          v-model="dateFormatted"
          prepend-icon="event"
          @blur="date = parseDate(dateFormatted)"
        ></v-text-field>
        <v-date-picker v-model="date" @input="dateFormatted = formatDate($event)" no-title scrollable actions>
          <template slot-scope="{ save, cancel }">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
              <v-btn flat color="primary" @click="save">OK</v-btn>
            </v-card-actions>
          </template>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'date-component',
    data: () => ({
      date: null,
      dateFormatted: false,
      modal: false
    }),
    methods: {
    }
  }
</script>

<style scoped>

</style>
