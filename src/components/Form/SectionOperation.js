import TriggerMixin from './TriggerMixin.js'
export default {
  mixins: [TriggerMixin],
  methods: {
    getParentSection (formId, rtSection) {
      let repeat = true
      let ptSection = rtSection

      while (repeat) {
        if (this.isSectionTrigger(ptSection)) {
          ptSection = this.$store.getters.loadedSection(formId, ptSection.parent_section_id)
        } else {
          repeat = false
        }
      }

      return ptSection
    },
    getLastChildSection (formId, rtSection) {
      let repeat = true
      let ptSection = rtSection

      while (repeat) {
        const parentId = (ptSection ? ptSection.id : null)
        let children = this.$store.getters.loadedChildren(formId, parentId)
        if (children.length > 0) {
          if (children[children.length - 1].answers) {
            repeat = false
          } else {
            let index = children.length - 1
            while (index > -1) {
              if (!this.isSectionTrigger(children[index])) {
                ptSection = children[index]
                break
              }
              index--
            }
          }
        } else {
          repeat = false
        }
      }

      return ptSection
    },
    getFirstChildSection (formId, rtSection) {
      let repeat = true
      let ptSection = rtSection

      while (repeat) {
        const parentId = (ptSection ? ptSection.id : null)
        let children = this.$store.getters.loadedChildren(formId, parentId)
        if (children.length > 0) {
          if (children[0].answers) {
            repeat = false
          } else {
            let index = 0
            while (index < children.length) {
              if (!this.isSectionTrigger(children[index])) {
                ptSection = children[index]
                break
              }
              index++
            }
          }
        } else {
          repeat = false
        }
      }

      return ptSection
    }
  }
}
