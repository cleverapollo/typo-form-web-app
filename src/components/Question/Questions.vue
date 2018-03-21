<template>
  <draggable v-model="list" class="dragArea" :options="{group:'people'}" :move="checkMove">
    <div v-for="(element, index) in list" :key="index" class="question">
      <v-card>
        <v-card-title>
          <div>
            <h3>{{'Question ' + (index + 1) + ' of ' + list.length}}</h3>
            <h1>{{element.name}}</h1>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </draggable>
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
    },
    methods: {
      checkMove: function (evt) {
        console.log(evt)
      }
    }
  }
</script>
