<template>
  <v-layout row wrap>

    <template v-if='showTable'>
      <FormReport
        :formTemplateId="formTemplateId"
        :formId="formId"
      ></FormReport>
    </template>
    <template v-else>
      <!-- //Setions -->
      <v-flex 
        xs12 
        :class="getFormTreeWidth(sections.length)" 
        v-if='sections.length > 1'>
        <form-tree
          :formTemplateId="formTemplateId"
          :section="section"
          :list="list"
          :formId="formId"
          @section-clicked="sectionClicked"
        ></form-tree>
      </v-flex>

      <!-- //Questions -->
      <v-flex 
        xs12 
        :class="getSectionWidth(sections.length)">
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
  import moment from 'moment'
  import sections from './Section/Sections'
  import FormReport from './FormReport'
  import FormTree from './FormTree'
  import SectionOperation from './SectionOperation.js'
  import SectionReportMixin from './SectionReportMixin.js'
  import JSPDF from 'jspdf'

  export default {
    props: ['slug', 'formTemplateId', 'formId', 'showTable'],
    mixins: [SectionOperation, SectionReportMixin],
    components: {
      FormReport,
      sections,
      FormTree
    },
    computed: {
      fileName () {
        return this.formTemplate.name + ' Form ' + moment().format('YYYY-MM-DD [at] LTS')
      },
      data () {
        const data = []
        _.forEach(this.sortedSections, section => {
          if (!this.isSectionTrigger(section)) {
            const list = _.sortBy(section.questions, element => {
              return element.order
            })
            if (!section.repeatable) {
              _.forEach(list, item => {
                if (!this.isTrigger(item, 1)) {
                  data.push({
                    'Section': section.name,
                    'Question': item.question,
                    'Answer': this.answer(item, 1)
                  })
                }
              })
            } else {
              for (let order = 1; order <= section.repeatable; order++) {
                _.forEach(list, item => {
                  if (!this.isTrigger(item, order)) {
                    data.push({
                      'Section': section.name,
                      'Question': item.question,
                      'Answer': this.answer(item, order)
                    })
                  }
                })
              }
            }
          }
        })
        return data
      },
      formTemplate () {
        return this.$store.getters.loadedFormTemplate(this.slug, this.formTemplateId)
      },
      sortedSections () {
        return _.sortBy(this.sections, [section => {
          if (!section.parent_section_id) {
            return section.order * 100
          }
          const parentSection = this.sections.find(sec => sec.id === section.parent_section_id)
          return parentSection.order * 100 + section.order
        }])
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
        if (!this.form) {
          return 'undefined'
        }
        const status = this.statuses.find((status) => {
          return status.id === this.form.status_id
        })
        return status ? status.status : 'undefined'
      }
    },
    methods: {
      getFormTreeWidth (numberOfSections) {
        return 'xs12 sm5 md4 xl3'
      },
      getSectionWidth (numberOfSections) {
        return numberOfSections > 1 ? 'xs12 sm7 md8 xl9' : 'xs12'
      },
      sectionClicked: function (item) {
        this.$store.dispatch('selectSection', item)
      },
      downloadPDF () {
        const doc = new JSPDF('p', 'pt', 'a4')
        const headers = [
          'Section',
          'Question',
          'Answer'
        ]
        let source = '<table><thead><tr>'
        _.forEach(headers, header => {
          source += '<th>' + header + '</th>'
        })
        source += '</tr></thead><tbody>'
        _.forEach(this.data, data => {
          source += '<tr>'
          _.forEach(headers, header => {
            source += '<td>' + data[header] + '</td>'
          })
          source += '</tr>'
        })
        source += '</tbody></table>'

        const margins = {
          top: 10,
          bottom: 10,
          left: 10,
          width: 595
        }

        doc.fromHTML(
          source, // HTML string or DOM elem ref.
          margins.left,
          margins.top, {
            'width': margins.width,
            'elementHandlers': {
              '.no-export': () => {
                return true
              }
            }
          },
          () => {
            doc.save(this.fileName + '.pdf')
          },
          margins
        )
      }
    }
  }
</script>
