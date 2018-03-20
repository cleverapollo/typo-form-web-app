<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <draggable v-model="list" class="dragArea" :options="{group:'people'}">
          <div v-for="(element, index) in list" :key="index">
            <v-card>
              <v-card-title>
                <h3 v-if='false'>{{'Section ' + (index + 1) + ' of ' + list.length}}</h3>
                <h1>{{element.name}}</h1>
              </v-card-title>
              <v-card-text>
                <questions :questions='element.questions'></questions>
              </v-card-text>
            </v-card>
          </div>
        </draggable>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import questions from '../Question/Questions.vue'
  export default {
    props: ['sections'],
    components: {
      draggable,
      questions
    },
    data () {
      return {
        list: this.sections
      }
    }
  }
</script>
