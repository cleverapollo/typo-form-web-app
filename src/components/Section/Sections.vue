<template>
  <draggable v-model="list" class="dragArea" :options="{group:'people', draggable:'.item'}" style="min-height: 100px">
    <div v-for="(element, index) in list" :key="(isSection(element)  ? 'Section ' : 'Question ') + element.id" class="item" v-bind:class="{ question: !isSection(element) }">
      <v-card>
        <v-card-title>
          <div>
            <h3>{{(index + 1) + ' of ' + list.length}}</h3>
            <h1>{{element.name}}</h1>
          </div>
        </v-card-title>
        <v-card-text v-if="isSection(element)">
          <sections :id='element.id'></sections>
        </v-card-text>
      </v-card>
    </div>
    <div slot="footer" v-if="isSectionEmpty">
      <v-card>
        <v-card-title>
          <h3>There is no questions</h3>
        </v-card-title>
      </v-card>
    </div>
  </draggable>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
  export default {
    name: 'sections',
    props: ['id'],
    components: {
      draggable,
      questions
    },
    computed: {
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.id)
        },
        set (value) {
          const updateObj = {
            id: this.id,
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
      }
    }
  }
</script>
