<template>
  <v-layout row wrap>

    <!-- //Setions -->
    <v-flex xs12 class="sm3" v-if='sections.length > 1'>
      <form-tree
        :formId="formId"
        :section="section"
        :list="list"
        :submissionId="submissionId"
        @section-clicked="sectionClicked"
      ></form-tree>
    </v-flex>

    <!-- //Questions -->
    <v-flex xs12 :class='"sm" + (sections.length > 1 ? 9 : 12)'>
      <sections
        :section="section"
        :formId="formId"
        :submissionId="submissionId"
        v-if="section"
      ></sections>
    </v-flex>

  </v-layout>
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
      sections () {
        return this.$store.getters.loadedSections(this.formId)
      },
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
              rtSection = this.getFirstChildSection(sections[0])
            }
            this.$store.dispatch('selectSection', rtSection)
          }
        } else {
          if (this.view === 'responses') {
            const children = this.$store.getters.loadedChildren(this.formId, rtSection.id)
            if (children.length > 0 && children[0].questions) {
              rtSection = this.getFirstChildSection(rtSection)
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
      getFirstChildSection (rtSection) {
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