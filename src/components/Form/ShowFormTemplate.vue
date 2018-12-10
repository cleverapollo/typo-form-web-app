<template>
  <v-layout row wrap v-if='formTemplate'>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Edit Form Template</h1>
        </v-flex>

        <!-- //Form Template Layout -->
        <v-flex xs12>
          <v-card>

            <!-- //Header -->
            <v-card-title class="info white--text">
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title pt-3">{{ formTemplate.name }}</div>
                  <v-spacer></v-spacer>

                  <!-- //Menu -->
                  <div class="text-xs-right">

                    <v-menu offset-y left>
                      <v-btn icon slot="activator">
                        <v-icon class="white--text">more_vert</v-icon>
                      </v-btn>

                      <v-list>

                        <v-list-tile @click="">
                          <v-list-tile-avatar>
                            <v-icon>create_new_folder</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <CreateSection :parentSectionId="-1" :formTemplateId="id"></CreateSection>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click="">
                          <v-list-tile-avatar>
                            <v-icon>edit</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <EditFormTemplate :formTemplate="formTemplate" :slug="slug"></EditFormTemplate>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="deleteFormTemplate = true">
                          <v-list-tile-avatar>
                            <v-icon>delete</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            Delete Form Template
                          </v-list-tile-content>
                        </v-list-tile>

                      </v-list>
                    </v-menu>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-layout row wrap>

                <v-flex d-flex xs12>
                  <form-view
                    :slug="slug"
                    :formTemplateId="id"
                    :formId="-1"
                  ></form-view>
                </v-flex>

              </v-layout>
            </v-card-text>

            <!-- //Footer -->
            <v-divider></v-divider>
            <v-card-actions>

              <formNavigation
                :slug="slug"
                :formTemplateId="id"
                :formId="-1"
              ></formNavigation>

            </v-card-actions>

          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Delete Form Template -->
    <DeleteConfirmDialog @delete-action="onDeleteFormTemplate" :visible="deleteFormTemplate" @close="deleteFormTemplate = false"></DeleteConfirmDialog>
  </v-layout>
</template>

<script>
  import FormView from './FormView'
  import EditFormTemplate from './EditFormTemplate'
  import CreateSection from './Section/CreateSection'
  import FormNavigation from './FormNavigation'

  export default {
    props: ['id'],
    components: {
      FormView,
      EditFormTemplate,
      CreateSection,
      FormNavigation
    },
    data () {
      return {
        deleteFormTemplate: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    computed: {
      formTemplate () {
        return this.$store.getters.loadedFormTemplate(this.slug, parseInt(this.id))
      }
    },
    methods: {
      onDeleteFormTemplate () {
        this.$store.dispatch('deleteFormTemplate', {
          slug: this.slug,
          id: this.formTemplate.id
        })
        this.$router.push('/form-templates')
      }
    },
    created: function () {
      this.$store.dispatch('loadFormTemplates', this.slug)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadValidations', this.id)
      this.$store.dispatch('loadTriggers', this.id)
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
