<template>
  <v-card>
    <v-card-title>
      <div>
        <h3>{{'Section ' + section.order}}</h3>
        <h1>{{section.name}}</h1>
      </div>
    </v-card-title>
    <v-card-text>
      <draggable v-model="list" class="dragArea" :options="{group:'people', draggable:'.item'}" style="min-height: 100px" :move="checkMove" @add="checkAdd" @remove="checkRemove">
        <div v-for="(element, index) in list" :key="(isSection(element)  ? 'Section ' : 'Question ') + element.id" class="item" v-bind:class="{ question: !isSection(element) }">
          <sections :section='element' v-if="isSection(element)"></sections>
          <questions :element='element' v-else></questions>
        </div>
        <div slot="footer" v-if="isSectionEmpty">
          <v-card>
            <v-card-title>
              <h3>There is no questions</h3>
            </v-card-title>
          </v-card>
        </div>
      </draggable>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="success" @click=onDuplicateSection>Duplicate Section</v-btn>
      <v-btn class="error" @click=onDeleteSection>Delete Section</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
  export default {
    name: 'sections',
    props: ['section'],
    components: {
      draggable,
      questions
    },
    data () {
      return {
        editedName: this.section.name
      }
    },
    computed: {
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.section.id)
        },
        set (value) {
          const updateObj = {
            id: this.section.id,
            value: value
          }
          this.$store.dispatch('updateSection', updateObj)
        }
      },
      isSectionEmpty () {
        return !this.list.length
      }
    },
    methods: {
      isSection (element) {
        return element.questions !== undefined
      },
      onUpdateSection () {
        if (this.editedName.trim() === '') {
          return
        }
        this.$store.dispatch('updateSection',
          {
            formid: this.section.form_id,
            section_id: this.section.section_id,
            order: this.section.order,
            name: this.editedName
          })
      },
      onDuplicateSection () {
        this.$store.dispatch('duplicateSection', {
          formid: this.section.form_id,
          id: this.section.id
        })
      },
      onDeleteSection () {
        this.$store.dispatch('deleteSection', {
          formid: this.section.form_id,
          id: this.section.id
        })
      },
      checkMove: function (evt) {
        console.log('moved', evt)
        if (evt.to.className.includes('parent') && evt.dragged.className.includes('question')) {
          return false
        }
        return true
      },
      checkAdd: function (evt) {
        console.log('added', evt)
      },
      checkRemove: function (evt) {
        console.log('removed', evt)
      }
    }
  }
</script>
