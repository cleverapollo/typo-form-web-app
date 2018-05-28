<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <form-tree
          :formId="formId"
          :section="section"
          :list="list"
          :submissionId="submissionId"
          @section-clicked="sectionClicked"
        ></form-tree>
      </v-flex>

      <v-flex xs12 sm9>
        <sections
          :section="section"
          :formId="formId"
          :submissionId="submissionId"
          v-if="section"
        ></sections>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import * as _ from 'lodash'
  import sections from './Section/Sections'
  import FormTree from './FormTree'

  export default {
    props: ['slug', 'formId', 'submissionId'],
    components: {
      sections,
      FormTree
    },
    computed: {
      list: {
        get () {
          return _.sortBy(this.$store.getters.loadedChildren(this.formId, null), element => {
            return element.order
          })
        },
        set (value) {
          // TODO: draggable
        }
      },
      section () {
        let rtSection = this.$store.getters.loadSelectedSection()
        if (!rtSection) {
          const sections = this.list
          if (sections.length) {
            if (this.view === 'questions') {
              rtSection = sections[0]
            } else {
              rtSection = this.getChildSection(sections[0])
            }
            this.$store.dispatch('selectSection', rtSection)
          }
        } else {
          if (this.view === 'responses') {
            const children = this.$store.getters.loadedChildren(this.formId, rtSection.id)
            if (children.length > 0 && children[0].questions) {
              rtSection = this.getChildSection(rtSection)
              this.$store.dispatch('selectSection', rtSection)
            }
          }
        }
        return rtSection
      }
    },
    methods: {
      sectionClicked: function (item) {
        this.$store.dispatch('selectSection', item)
      },
      getChildSection (rtSection) {
        let repeat = true
        let ptSection = rtSection

        while (repeat) {
          let children = this.$store.getters.loadedChildren(this.formId, ptSection.id)
          if (children.length > 0) {
            if (children[0].answers) {
              repeat = false
            } else {
              ptSection = children[0]
            }
          } else {
            repeat = false
          }
        }

        return ptSection
      }
    }
  }
</script>

<style scoped>
  .expansion-panel .card__text {
    padding-right: 0 !important;
  }
</style>
