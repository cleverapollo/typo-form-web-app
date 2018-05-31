<template>
  <v-layout row wrap>

    <!-- //Form Container -->
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-layout row>

            <!-- //Setions -->
            <v-flex xs12 class="sm3" v-if='list.length > 1'>
              <form-tree
                :formId="formId"
                :section="section"
                :list="list"
                :submissionId="submissionId"
                @section-clicked="sectionClicked"
              ></form-tree>
            </v-flex>

            <!-- //Questions -->
            <v-flex xs12 :class='"sm" + (list.length === 1 ? 12 : 9)'>
              <sections
                :section="section"
                :formId="formId"
                :submissionId="submissionId"
                v-if="section"
              ></sections>
            </v-flex>

          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <!-- //Next / Prev Button -->
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs2>
          <v-btn color="info" @click="prev()">Prev</v-btn>
        </v-flex>
        <v-flex xs2 offset-xs8 text-xs-right>
          <v-btn color="info" @click="next()">Next</v-btn>
        </v-flex>
      </v-layout>
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
      },
      prev () {
        let rtSection = this.$store.getters.loadSelectedSection()
        let slibings = _.sortBy(this.$store.getters.loadedChildren(this.formId, rtSection.parent_section_id), element => {
          return element.order
        })
        let index = slibings.findIndex(section => {
          return section.id === rtSection.id
        })
        if (index) {
          rtSection = slibings[index - 1]
        } else if (rtSection.parent_section_id) {
          if (this.view === 'questions') {
            rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
          } else {
            while (!index) {
              if (!rtSection.parent_section_id) {
                break
              }
              rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
              slibings = _.sortBy(this.$store.getters.loadedChildren(this.formId, rtSection.parent_section_id), element => {
                return element.order
              })
              index = slibings.findIndex(section => {
                return section.id === rtSection.id
              })
            }
            if (rtSection.parent_section_id || index) {
              rtSection = slibings[index - 1]
            } else {
              rtSection = this.getChildSection(this.list[0])
            }
          }
        }
        let repeat = true
        while (repeat) {
          let children = this.$store.getters.loadedChildren(this.formId, rtSection.id)
          if (children.length > 0) {
            if (children[0].answers) {
              repeat = false
            } else {
              rtSection = children[children.length - 1]
            }
          } else {
            repeat = false
          }
        }
        this.$store.dispatch('selectSection', rtSection)
      },
      next () {
        let rtSection = this.$store.getters.loadSelectedSection()
        let slibings = _.sortBy(this.$store.getters.loadedChildren(this.formId, rtSection.parent_section_id), element => {
          return element.order
        })
        let index = slibings.findIndex(section => {
          return section.id === rtSection.id
        })
        if (index < slibings.length - 1) {
          rtSection = slibings[index + 1]
        } else if (rtSection.parent_section_id) {
          if (this.view === 'questions') {
            rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
          } else {
            while (index === slibings.length - 1) {
              if (!rtSection.parent_section_id) {
                break
              }
              rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
              slibings = _.sortBy(this.$store.getters.loadedChildren(this.formId, rtSection.parent_section_id), element => {
                return element.order
              })
              index = slibings.findIndex(section => {
                return section.id === rtSection.id
              })
            }
            if (rtSection.parent_section_id || index !== slibings.length - 1) {
              rtSection = slibings[index + 1]
            } else {
              rtSection = this.list[this.list.length - 1]
              let repeat = true
              while (repeat) {
                let children = this.$store.getters.loadedChildren(this.formId, rtSection.id)
                if (children.length > 0) {
                  if (children[0].answers) {
                    repeat = false
                  } else {
                    rtSection = children[children.length - 1]
                  }
                } else {
                  repeat = false
                }
              }
            }
          }
        }
        rtSection = this.getChildSection(rtSection)
        this.$store.dispatch('selectSection', rtSection)
      }
    }
  }
</script>

<style scoped>
  .expansion-panel .card__text {
    padding-right: 0 !important;
  }
</style>
