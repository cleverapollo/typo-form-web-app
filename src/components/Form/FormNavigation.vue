<template>
  <v-layout row wrap>
    <v-flex xs12 v-if="sections.length > 1">
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
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  export default {
    name: 'formNavigation',
    props: ['slug', 'formId', 'submissionId'],
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
        if (this.submissionId === -1) {
          return this.section === this.sections[0]
        } else {
          return this.section === this.getFirstChildSection(this.list[0])
        }
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
            if (this.submissionId === -1) {
              rtSection = sections[0]
            } else {
              rtSection = this.getFirstChildSection(sections[0])
            }
            this.$store.dispatch('selectSection', rtSection)
          }
        } else {
          if (this.submissionId !== -1) {
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
        let slibings = _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, rtSection.parent_section_id), element => {
          return element.order
        })
        let index = slibings.findIndex(section => {
          return section.id === rtSection.id
        })
        if (this.submissionId === -1) {
          if (index) {
            rtSection = slibings[index - 1]
            rtSection = this.getLastChildSection(rtSection)
          } else if (rtSection.parent_section_id) {
            rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
          }
        } else {
          if (index) {
            rtSection = slibings[index - 1]
          } else if (rtSection.parent_section_id) {
            while (!index) {
              if (!rtSection.parent_section_id) {
                break
              }
              rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
              slibings = _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, rtSection.parent_section_id), element => {
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
            rtSection = this.getLastChildSection(rtSection)
          }
        }
        this.$store.dispatch('selectSection', rtSection)
      },
      next () {
        let rtSection = this.$store.getters.loadSelectedSection()
        if (!rtSection) {
          return
        }
        let slibings = _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, rtSection.parent_section_id), element => {
          return element.order
        })
        let index = slibings.findIndex(section => {
          return section.id === rtSection.id
        })
        if (this.submissionId === -1) {
          let children = _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, rtSection.id), element => {
            return element.order
          })
          if (children.length) {
            rtSection = children[0]
          } else if (index < slibings.length - 1) {
            rtSection = slibings[index + 1]
          } else if (rtSection.parent_section_id) {
            while (index === slibings.length - 1) {
              if (!rtSection.parent_section_id) {
                break
              }
              rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
              slibings = _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, rtSection.parent_section_id), element => {
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
        } else {
          if (index < slibings.length - 1) {
            rtSection = slibings[index + 1]
          } else if (rtSection.parent_section_id) {
            while (index === slibings.length - 1) {
              if (!rtSection.parent_section_id) {
                break
              }
              rtSection = this.$store.getters.loadedSection(this.formId, rtSection.parent_section_id)
              slibings = _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, rtSection.parent_section_id), element => {
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
          rtSection = this.getFirstChildSection(rtSection)
        }
        this.$store.dispatch('selectSection', rtSection)
      }
    }
  }
</script>