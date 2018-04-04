<template>
  <div>
    <v-layout row class="p-2">
      <v-flex xs8 offset-xs2>
        <v-layout row>
          <v-flex v-for="n in end" :key="n" v-if="n-1!=start">
            <span class="optionLabel">{{ n }}</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row style='p-2'>
      <v-flex xs2 class="text-center">{{ startString }}</v-flex>
      <v-flex xs8>
        <v-layout row>
          <v-radio-group row>
            <v-radio v-for="n in end" :key="n" v-if="n-1!=start" :value="'radio-'+n"></v-radio>
          </v-radio-group>
        </v-layout>
      </v-flex>
      <v-flex xs2 class="text-center">{{ endString }}</v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'linear-scale',
    data () {
      return {
        startString: 'start',
        endString: 'end',
        start: 1,
        end: 8,
        startItems: [
          {
            id: 0,
            text: '0'
          },
          {
            id: 1,
            text: '1'
          }
        ],
        endItems: [
          {
            id: 2,
            text: '2'
          },
          {
            id: 3,
            text: '3'
          },
          {
            id: 4,
            text: '4'
          },
          {
            id: 5,
            text: '5'
          },
          {
            id: 6,
            text: '6'
          },
          {
            id: 7,
            text: '7'
          },
          {
            id: 8,
            text: '8'
          },
          {
            id: 9,
            text: '9'
          },
          {
            id: 10,
            text: '10'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .optionLabel {
    padding-left: 9px;
  }
</style>
