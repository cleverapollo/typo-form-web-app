<template>
  <v-card>
    <v-card-title>
      <div>
        <h3>{{'Question ' + (question.order)}}</h3>
        <h1>{{question.name}}</h1>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    props: ['element'],
    components: {
      draggable
    },
    data () {
      return {
        question: this.element
      }
    },
    methods: {
      checkMove: function (evt) {
        console.log(evt)
      }
    }
  }
</script>
