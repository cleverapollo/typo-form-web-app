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

        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="editedName"
                required
              ></v-text-field>
            </v-card-text>
          </v-flex>

          <v-flex xs12>
            <v-card-text>
              <v-select
                :items="periodTypes"
                item-value="id"
                item-text="name"
                v-model="periodType"
                label="Period Type"
              ></v-select>
            </v-card-text>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex xs12>
            <v-menu
              class="px-3"
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

          <v-spacer></v-spacer>

          <v-flex xs12>
            <v-menu
              class="px-3"
              lazy
              :close-on-content-click="false"
              v-model="endMenu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              v-if="periodType === 2"
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

            <v-card-text v-if="periodType === 1">
              <v-select
                :items="periodDurations"
                item-value="id"
                item-text="period"
                v-model="periodDuration"
                label="Period Duration"
              ></v-select>
            </v-card-text>
          </v-flex>
        </v-layout>

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
    props: ['form', 'application_id'],
    data () {
      return {
        id: this.form.id,
        editForm: false,
        editedName: this.form.name,
        periodType: this.period_end ? 2 : 1,
        startMenu: false,
        periodStart: this.form.period_start ? this.form.period_start.substring(0, 10) : null,
        endMenu: false,
        periodEnd: this.form.period_end ? this.form.period_end.substring(0, 10) : null,
        periodDuration: this.form.period_id || 1
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }

        this.editForm = false

        this.$store.dispatch('updateForm', {
          applicationId: this.application_id,
          id: this.id,
          name: this.editedName,
          periodStart: this.periodStart,
          periodEnd: this.periodType === 2 ? this.periodEnd : null,
          periodId: this.periodType === 1 ? this.periodDuration : null
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
        return this.$store.getters.periods
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
