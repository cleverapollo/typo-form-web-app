<template>
  <v-layout row wrap>
    <v-flex xs12>
      <draggable v-model="list" class="parent" :options="{group:'parent', draggable:'.item', handle:'.handle'}" style="min-height: 100px" @end="checkEnd">
        <div v-for="(element, index) in list" :key="'Section ' + element.id" :class="'section' + element.id" class="item pb-5">
          <sections :section='element' :form_id='form_id' :submission_id='submission_id' :index='index + 1'></sections>
        </div>
      </draggable>
    </v-flex>
    <v-flex xs12 text-xs-center v-if='submission_id === -1'>
      <app-create-section :parent_section_id='-1' :form_id='form_id'></app-create-section>
    </v-flex>
  </v-layout>
</template>

<script>
  import draggable from 'vuedraggable'
  import sections from './Section/Sections'

  export default {
    props: ['form_id', 'submission_id'],
    components: {
      draggable,
      sections
    },
    computed: {
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.form_id, null)
        },
        set (value) {
          // TODO: draggable
        }
      }
    },
    methods: {
      checkEnd: function (evt) {
        if (evt.to.className === evt.from.className && evt.newIndex === evt.oldIndex) {
          return
        }
        if (evt.item.className.includes('question') && evt.to.className.includes('parent')) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.to.className === evt.from.className && evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }

        const elementClass = evt.item.className
        const parentClass = evt.to.className
        let parentSectionId = parentClass.substr(7)
        if (parentSectionId === '') {
          parentSectionId = null
        } else {
          parentSectionId = parseInt(parentSectionId)
        }

        const children = this.$store.getters.loadedChildren(this.form_id, parentSectionId)
        let order = 0
        if (children.length === 0) {
          order = 1
        } else if (children.length === newIndex) {
          order = children[newIndex - 1].order + 1
        } else {
          order = children[newIndex].order
        }

        if (elementClass.includes('section')) {
          const elementId = parseInt(elementClass.substr(17))
          this.$store.dispatch('moveSection',
            {
              formid: this.form_id,
              sectionid: elementId,
              parent_section_id: parentSectionId,
              order: order
            })
        } else {
          const oldparentClass = evt.from.className
          const oldparentSectionId = parseInt(oldparentClass.substr(7))
          const elementId = parseInt(elementClass.substr(18))
          this.$store.dispatch('moveQuestion',
            {
              formid: this.form_id,
              questionid: elementId,
              oldparent_section_id: oldparentSectionId,
              parent_section_id: parentSectionId,
              order: order
            })
        }
      }
    }
  }
</script>
