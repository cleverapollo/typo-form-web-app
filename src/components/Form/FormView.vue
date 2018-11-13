<template>
  <v-layout row wrap>

    <template v-if='formId !== -1 && status === "Closed"'>
      <template v-for="(element, index) in sortedSections">
        <v-flex xs12>
          <SectionReport
            :section="element"
            :formTemplateId="formTemplateId"
            :formId="formId"
            v-if="element.questions.length"
          ></SectionReport>
        </v-flex>
      </template>
    </template>
    <template v-else>
      <!-- //Setions -->
      <v-flex xs12 class="sm3" v-if='sections.length > 1'>
        <form-tree
          :formTemplateId="formTemplateId"
          :section="section"
          :list="list"
          :formId="formId"
          @section-clicked="sectionClicked"
        ></form-tree>
      </v-flex>

      <!-- //Questions -->
      <v-flex xs12 :class='"sm" + (sections.length > 1 ? 9 : 12)'>
        <sections
          :section="section"
          :formTemplateId="formTemplateId"
          :formId="formId"
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
    props: ['slug', 'formTemplateId', 'formId'],
    mixins: [SectionOperation],
    components: {
      SectionReport,
      sections,
      FormTree
    },
    computed: {
      sections () {
        return this.$store.getters.loadedSections(this.formTemplateId)
      },
      sortedSections () {
        return _.sortBy(this.sections, ['order'])
      },
      list: {
        get () {
          return _.sortBy(this.$store.getters.loadedChildren(this.formTemplateId, null), element => {
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
          rtSection = this.getFirstChildSection(this.formTemplateId, rtSection)
        }
        // If rtSection is triggered, then select its parent section
        // rtSection = this.getParentSection(this.formTemplateId, rtSection)
        // if view is responses, then select first section which has questions
        if (this.formId !== -1) {
          rtSection = this.getFirstChildSection(this.formTemplateId, rtSection)
        }
        this.$store.dispatch('selectSection', rtSection)
        return rtSection
      },
      form () {
        return this.$store.getters.loadedApplicationForm(this.slug, this.formId)
      },
      statuses () {
        return this.$store.getters.statuses
      },
      status () {
        const status = this.statuses.find((status) => {
          return status.id === this.form.status_id
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
