<template>
  <v-layout row wrap>

    <template v-if='submissionId !== -1 && status === "Closed"'>
      <template v-for="(element, index) in sections">
        <v-flex xs12>
          <SectionReport
            :section="element"
            :formId="formId"
            :submissionId="submissionId"
            v-if="element.questions.length"
          ></SectionReport>
        </v-flex>
      </template>
    </template>
    <template v-else>
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
    </template>

  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import sections from './Section/Sections'
  import SectionReport from './Section/SectionReport'
  import FormTree from './FormTree'
  import SectionOperation from './SectionOperation.js'

  export default {
    props: ['slug', 'formId', 'submissionId'],
    mixins: [SectionOperation],
    components: {
      SectionReport,
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
        const sections = this.list
        // If rtSection is null, then select first section
        if (!rtSection && sections.length) {
          rtSection = sections[0]
          rtSection = this.getFirstChildSection(this.formId, rtSection)
        }
        // If rtSection is triggered, then select its parent section
        // rtSection = this.getParentSection(this.formId, rtSection)
        // if view is respones, then select first section which has questions
        if (this.submissionId !== -1) {
          rtSection = this.getFirstChildSection(this.formId, rtSection)
        }
        this.$store.dispatch('selectSection', rtSection)
        return rtSection
      },
      submission () {
        return this.$store.getters.loadedApplicationSubmission(this.slug, this.submissionId)
      },
      statuses () {
        return this.$store.getters.statuses
      },
      status () {
        const status = this.statuses.find((status) => {
          return status.id === this.submission.status_id
        })
        return status ? status.status : 'undefined'
      }
    },
    methods: {
      sectionClicked: function (item) {
        this.$store.dispatch('selectSection', item)
      }
    }
  }
</script>