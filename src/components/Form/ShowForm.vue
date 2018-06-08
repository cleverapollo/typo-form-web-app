<template>
  <v-layout row wrap v-if='form'>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Edit Form</div>
        </v-flex>

        <!-- //Form Layout -->
        <v-flex xs12>
          <v-card>

            <!-- //Header -->
            <v-card-title class="info white--text">
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title pt-3">{{ form.name }}</div>

                  <!-- //Menu -->
                  <v-menu offset-y bottom left class="text-xs-right">
                    <v-btn icon slot="activator">
                      <v-icon class="white--text">more_vert</v-icon>
                    </v-btn>

                    <v-list>
                      <v-list-tile @click="">
                        <v-list-tile-title>
                          <CreateSection
                            :parentSectionId="-1"
                            :formId="id"
                          ></CreateSection>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile @click="">
                        <v-list-tile-title>
                          <EditForm :form="form" :slug="slug"></EditForm>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile @click=onDeleteForm>
                        <v-list-tile-title>Delete Form</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-layout row wrap>

                <v-flex d-flex xs12>
                  <form-view
                    :slug="slug"
                    :formId="id"
                    :submissionId="-1"
                  ></form-view>
                </v-flex>

              </v-layout>
            </v-card-text>

            <!-- //Footer -->
            <v-divider></v-divider>
            <v-card-actions>

              <formNavigation
                :slug="slug"
                :formId="id"
                :submissionId="-1"
              ></formNavigation>

            </v-card-actions>

          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import FormView from './FormView'
  import EditForm from './EditForm'
  import CreateSection from './Section/CreateSection'
  import FormNavigation from './FormNavigation'

  export default {
    components: {
      FormView,
      EditForm,
      CreateSection,
      FormNavigation
    },
    props: ['slug', 'id'],
    computed: {
      form () {
        return this.$store.getters.loadedForm(this.slug, parseInt(this.id))
      }
    },
    methods: {
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          slug: this.slug,
          id: this.form.id
        })
        this.$router.push('/' + this.slug + '/forms')
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadValidations', this.id)
      this.$store.dispatch('loadTriggers', this.id)
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
