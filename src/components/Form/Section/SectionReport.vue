<template>
  <v-card flat active-class="active-section" v-if="!isSectionTrigger(section) || formId === -1">

    <v-card-title class="pb-1">
      <div class="subheading font-weight-medium">{{ getSectionName(section) }}</div>
    </v-card-title>

    <v-card-text>
      <!-- //Form -->
      <!-- //Standard -->
      <v-layout row wrap v-if="!section.repeatable">
        <template>
          <v-data-table
            :headers="headers"
            :items="list"
            hide-actions
            class="question-answers"
          >
            <template slot="items" slot-scope="props" v-if="!isTrigger(props.item , 1) && showQuestion(props.item)">
              <td>{{ props.item.question }}</td>
              <td>
                <SectionReportComponent :formTemplateId="formTemplateId" :formId="formId" :question="props.item" :order="1" />
              </td>
            </template>
          </v-data-table>
        </template>
      </v-layout>

      <!-- //Repeatable -->
      <template v-else>
        <v-layout
          row
          wrap
          v-for="order in section.repeatable"
          :key="'repeat' + order"
        >
          <v-data-table
            :headers="headers"
            :items="list"
            hide-actions
            class="question-answers"
          >
            <template slot="items" slot-scope="props" v-if="!isTrigger(props.item , order) && showQuestion(props.item)">
              <td>{{ props.item.question }}</td>
              <td>
                <SectionReportComponent :formTemplateId="formTemplateId" :formId="formId" :question="props.item" :order="order" />
              </td>
            </template>
          </v-data-table>
        </v-layout>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
  import * as _ from 'lodash'
  import SectionReportMixin from '../SectionReportMixin.js'
  import SectionReportComponent from './SectionReportComponent'

  export default {
    name: 'SectionReport',
    props: ['section', 'formTemplateId', 'formId'],
    mixins: [SectionReportMixin],
    data () {
      return {
        headers: [
          {
            text: 'Question',
            align: 'left',
            sortable: false,
            width: '40%'
          },
          {
            text: 'Answer',
            align: 'left',
            sortable: false,
            width: '60%'
          }
        ]
      }
    },
    components: {
      SectionReportComponent
    },
    computed: {
      form () {
        if (!this.formId) {
          return null
        }
        return this.$store.getters.loadedForm(parseInt(this.formTemplateId), parseInt(this.formId))
      },
      statuses () {
        return this.$store.getters.statuses
      },
      status () {
        if (!this.form) {
          return null
        }
        return this.getStatus(this.form.status_id)
      },
      list: {
        get () {
          return _.sortBy(this.$store.getters.loadedChildren(this.formTemplateId, this.section.id), element => {
            return element.order
          })
        },
        set (value) {
          // TODO: Drggable components
        }
      },
      isSectionEmpty () {
        return !this.list.length
      }
    },
    methods: {
      showQuestion (question) {
        let show = false
        switch (question.question_type_id) {
          case 12:
            show = false
            break
          default:
            show = true
        }
        return show
      },
      getStatus (statusId) {
        const status = this.statuses.find((status) => {
          return status.id === statusId
        })
        return status ? status.status : 'undefined'
      }
    }
  }
</script>

<style scoped>
  .v-card__title {
    flex-wrap: unset !important;
  }
  .v-expansion-panel__header div:first-child {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .question-answers >>> th {
    font-weight:500;
    font-size:14px;
    background: #eee;
    color: #000 !important;
  }
  .question-answers {
    width:100%;
  }
</style>
