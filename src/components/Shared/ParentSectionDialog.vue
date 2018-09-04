<template>
  <v-dialog v-model="show" persistent max-width="600px">

    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Move</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-select
          :items="sections"
          label="Sections"
          item-text="name"
          item-value="id"
          v-model="selectedSectionId"
        ></v-select>
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn color="primary" @click.stop="onMove">Select</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
      
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['visible', 'formId', 'sectionId', 'flag'],
    data () {
      return {
        selectedSectionId: this.sectionId
      }
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      },
      sections () {
        return this.$store.getters.loadedSections(this.formId).filter((section) => {
          if (this.flag === 'Question') {
            return !this.$store.getters.loadedChildrenSection(this.formId, section.id).length
          } else {
            return this.$store.getters.loadedChildrenSection(this.formId, section.id).length
          }
        })
      }
    },
    methods: {
      onMove () {
        this.$emit('move-action', this.selectedSectionId)
        this.reset()
      },
      close () {
        this.reset()
      },
      reset () {
        this.show = false
      }
    }
  }
</script>
