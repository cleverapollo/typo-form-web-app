<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <draggable v-model="list" class="dragArea" :options="{group:'people'}">
          <div v-for="(element, index) in list" :key="index">
            <v-card>
              <v-card-title>
                <h3 v-if='false'>{{'Question ' + (index + 1) + ' of ' + list.length}}</h3>
                <h1>{{element.name}}</h1>
              </v-card-title>
            </v-card>
          </div>
        </draggable>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    props: ['questions'],
    components: {
      draggable
    },
    data () {
      return {
        list: this.questions
      }
    }
  }
</script>
