<template>
  <v-dialog width="600px" persistent v-model="editFormTemplate">
    <div slot="activator">
      Edit Form Template
    </div>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex>
            <h2>Edit Form Template</h2>
          </v-flex>
          <v-flex class="text-xs-right">
            <v-spacer></v-spacer>
            <v-btn
              flat
              icon
              class="my-0"
              href='/static/Form Template.xlsx'>
              <v-icon>cloud_download</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <!-- //Types -->
            <v-flex xs12>
              <v-autocomplete
                      :items="types"
                      item-value="id"
                      item-text="type"
                      v-model="typeId"
                      label="Audience"
              ></v-autocomplete>
            </v-flex>
          </v-layout>

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

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="content"
                label="Completed Form Template Content"
                id="content"
                v-model="content"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="help"
                label="Help Modal Content"
                id="help"
                v-model="help"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap pt-4>
            <v-flex xs12>
              <v-checkbox label="Show Progress" v-model="showProgress" light></v-checkbox>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex>
              <label for="upload"><span>{{ csvFileName }}</span></label>
              <input id="upload" type="file" class="hide inputfile" accept=".csv, .xls, .xlsx" @change="onFileChange"
                     data-multiple-caption="{count} files selected" multiple/>
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
    props: ['formTemplate', 'slug'],
    data () {
      return {
        id: this.formTemplate.id,
        editFormTemplate: false,
        editedName: this.formTemplate.name,
        showProgress: parseInt(this.formTemplate.show_progress),
        csv: this.formTemplate.csv,
        csvFileName: 'Please Upload CSV.',
        content: this.formTemplate.metas.length ? JSON.parse(this.formTemplate.metas[0].metadata).content : '',
        help: this.formTemplate.metas.length ? JSON.parse(this.formTemplate.metas[0].metadata).help : '',
        typeId: this.formTemplate.type_id
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '') {
          return
        }

        this.editFormTemplate = false

        this.$store.dispatch('updateFormTemplate', {
          slug: this.slug,
          id: this.id,
          typeId: this.typeId,
          name: this.editedName,
          showProgress: this.showProgress,
          csv: this.csv
        })
          .then((response) => {
            if (this.formTemplate.metas.length) {
              this.updateMeta()
            } else {
              this.createMeta()
            }
          })
      },
      onCancel () {
        this.editedName = this.formTemplate.name
        this.editFormTemplate = false
        this.typeId = this.formTemplate.type_id
      },
      onFileChange (e) {
        const files = e.target.files || e.dataTransfer.files

        if (files.length) {
          this.csv = files[0]
          this.csvFileName = this.csv.name
        }
      },
      createMeta () {
        this.$store.dispatch('createMeta', {
          metadata: JSON.stringify({content: this.content, help: this.help}),
          metableId: this.formTemplate.id,
          metableType: 'form_templates'
        })
      },
      updateMeta () {
        this.$store.dispatch('updateMeta', {
          id: this.formTemplate.metas[0].id,
          metadata: JSON.stringify({content: this.content, help: this.help}),
          metableId: this.formTemplate.id,
          metableType: 'form_templates'
        })
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      types () {
        let types = this.$store.getters.types
        types.forEach((type) => {
          type.type = type.name === 'application' ? 'User' : 'Organisation'
        })
        return types
      }
    }
  }
</script>

<style scoped>
  .hide {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  label[for="upload"] {
    display: inline-block;
    cursor: pointer;
    padding: 10px 30px;
    background-color: #2196f3;
    color: #ffffff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25), 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    transition: all 0.3s;
  }

  label[for="upload"]:hover {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25), 0 5px 18px 0 rgba(0, 0, 0, 0.2);
  }
</style>
