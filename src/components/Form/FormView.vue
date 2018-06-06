<template>
  <v-layout row wrap>

    <!-- //Form/Submission Layout -->
    <v-flex xs12>
      <v-card>

        <!-- //Header -->
        <v-card-title>

        </v-card-title>

        <v-card-text>
          <v-layout row wrap>

            <!-- //Setions -->
            <v-flex xs12 class="sm3" v-if='sections.length'>
              <form-tree
                :formId="formId"
                :section="section"
                :list="list"
                :submissionId="submissionId"
                @section-clicked="sectionClicked"
              ></form-tree>
            </v-flex>

            <!-- //Questions -->
            <v-flex xs12 :class='"sm" + (sections.length ? 9 : 12)'>
              <sections
                :section="section"
                :formId="formId"
                :submissionId="submissionId"
                v-if="section"
              ></sections>
            </v-flex>

          </v-layout>
        </v-card-text>

        <!-- //Footer -->
        <v-divider></v-divider>
        <v-card-actions>

          <!-- //Navigation Controls -->
          <v-flex xs12 v-if="section">
            <v-layout row wrap>
              <v-flex xs12 md3 pa-2>
                <v-btn class="ma-0" block color="info" @click="prev()" :disabled="prevAble">Prev</v-btn>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 md3 pa-2 ma-0>
                <v-btn class="ma-0" block color="info" @click="next()" :disabled="nextAble">Next</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>

        </v-card-actions>

      </v-card>
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
      prevAble () {
        if (!this.list.length || !this.section) {
          return false
        }
        return this.section === this.getFirstChildSection(this.list[0])
      },
      nextAble () {
        if (!this.list.length || !this.section) {
          return false
        }
        return this.section === this.getLastChildSection(this.list[this.list.length - 1])
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
      },
      getLastChildSection (rtSection) {
        let repeat = true
        let ptSection = rtSection

        while (repeat) {
          let children = this.$store.getters.loadedChildren(this.formId, ptSection.id)
          if (children.length > 0) {
            if (children[children.length - 1].answers) {
              repeat = false
            } else {
              ptSection = children[children.length - 1]
            }
          } else {
            repeat = false
          }
        }

        return ptSection
      },
      prev () {
        let rtSection = this.$store.getters.loadSelectedSection()
        if (!rtSection) {
          return
        }
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
              rtSection = this.getFirstChildSection(this.list[0])
            }
          }
        }
        rtSection = this.getLastChildSection(rtSection)
        this.$store.dispatch('selectSection', rtSection)
      },
      next () {
        let rtSection = this.$store.getters.loadSelectedSection()
        if (!rtSection) {
          return
        }
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
              rtSection = this.getLastChildSection(rtSection)
            }
          }
        }
        rtSection = this.getFirstChildSection(rtSection)
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
