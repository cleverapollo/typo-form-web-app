<template>
  <v-dialog width="350px" persistent v-model="editForm">
    <div slot="activator">Edit Form</div>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Edit Form</h2>
            </v-card-title>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-card-text>

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="editedName"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap pt-2>
            <v-flex xs12>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="startMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
              >
                <v-text-field
                  slot="activator"
                  label="Period Start"
                  v-model="periodStart"
                  prepend-icon="event"
                  readonly
                ></v-text-field>

                <v-date-picker v-model="periodStart" no-title scrollable actions>
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

          <v-layout row wrap pt-2>
            <v-flex xs12>
              <v-select
                :items="periodDurations"
                item-value="id"
                item-text="period"
                v-model="periodDuration"
                label="Period Duration"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout row wrap pt-2>
            <v-flex xs12 v-if="periodDuration === 5">
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="endMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
              >
                <v-text-field
                  slot="activator"
                  label="Period End"
                  v-model="periodEnd"
                  prepend-icon="event"
                  readonly
                ></v-text-field>

                <v-date-picker v-model="periodEnd" no-title scrollable actions>
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

          <v-layout row wrap pt-4>
            <v-flex xs12>
              <v-checkbox label="Show Progress" v-model="showProgress" light></v-checkbox>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-divider></v-divider>

        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat class="secondary" @click="onCancel">Close</v-btn>
              <v-btn
                flat
                class="primary"
                @click="onSaveChanges"
                :disabled="loading"
                :loading="loading"
              >
                Save
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['form', 'applicationName'],
    data () {
      return {
        id: this.form.id,
        editForm: false,
        editedName: this.form.name,
        periodDuration: this.form.period_end ? 5 : 1,
        startMenu: false,
        periodStart: this.form.period_start ? this.form.period_start.substring(0, 10) : null,
        endMenu: false,
        periodEnd: this.form.period_end ? this.form.period_end.substring(0, 10) : null,
        showProgress: this.form.show_progress
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }

        this.editForm = false

        this.$store.dispatch('updateForm', {
          applicationName: this.applicationName,
          id: this.id,
          name: this.editedName,
          periodStart: this.periodStart,
          periodEnd: this.periodDuration === 5 ? this.periodEnd : null,
          periodId: this.periodDuration !== 5 ? this.periodDuration : null,
          showProgress: this.showProgress
        })
      },
      onCancel () {
        this.editedName = this.form.name
        this.editForm = false
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      },
      periodTypes () {
        return [
          {id: 1, name: 'Set Period Duration'},
          {id: 2, name: 'Set Period End'}
        ]
      },
      periodDurations () {
        var options = this.$store.getters.periods
        options.push({
          id: 5,
          period: 'Custom'})
        return options
      }
    }
  }
</script>

<style>
  .input-group__details {
    min-height: unset;
  }

  .px-3 {
    padding: 0 16px;
  }
</style>
