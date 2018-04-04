<template>
  <div>
    <v-layout row style='padding: 20px 30px'>
      <v-flex>{{ start }}</v-flex>
      <div class='select-wrapper'>
        <v-select
          v-model='start'
          :items='startItems'
          item-text='text'
          item-value='id'
        ></v-select>
      </div>
      <div class='to'>
        to
      </div>
      <div class='select-wrapper'>
        <v-select
          v-model='end'
          :items='endItems'
          item-text='text'
          item-value='id'
        ></v-select>
      </div>
    </v-layout>
    <v-layout row>
      <div class='number-wrapper'>
        {{ start }}
      </div>
      <v-flex xs3>
        <v-text-field
          value='Label (option)'
          xs3
          disabled
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <div class='number-wrapper'>
        {{ end }}
      </div>
      <v-flex xs3>
        <v-text-field
          value='Label (option)'
          disabled
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'linear-scale',
    data () {
      return {
        start: 1,
        end: 5,
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
  .select-wrapper {
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
  }
  .to {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
  }
  .number-wrapper {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
