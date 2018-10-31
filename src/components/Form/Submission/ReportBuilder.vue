<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Report Builder</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Add filters below to start building your custom report.</p>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <!-- // Search -->
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <!-- // Data -->
            <v-data-table
              :headers="headers"
              :items="data"
              :search="search"
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <!--
                <tr @click="onSubmission(props.item.id)">
                  <td>{{ props.item.form.name }}</td>
                  <td>{{ props.item.owner }}</td>
                  <td>{{ props.item.created_at.date | moment }}</td>
                  <td>{{ props.item.updated_at.date | moment }}</td>
                  <td>{{ props.item.status }}</td>
                </tr>
                -->
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your filters returned no results. Try changing your filters.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>

export default {
  name: 'ReportBuilder',
  data () {
    return {
      search: '',
      headers: [],
      data: []
    }
  }
}
</script>