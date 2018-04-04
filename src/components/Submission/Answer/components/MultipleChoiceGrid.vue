<template>
  <v-layout column>
    <v-flex xs10 offset-xs2>
      <v-layout row>
        <v-flex v-for='(columnString, index) in computedColumns' :key='"OptionString " + index'>{{ columnString }}</v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout row v-for='(rowString, index) in computedRows' :key='"row " + index'>
        <v-flex xs2>
          <v-layout row>
            <h3>{{ index + 1 }}.</h3>
            <h3>{{rowString}}</h3>
          </v-layout>
        </v-flex>
        <v-flex xs10>
          <v-radio-group row class="pt-0 pb-0">
            <v-radio v-for='(columnString, index) in computedColumns' :key='"column " + index2' :value="'option-'+index+'-'+index2"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>


<script>
//  import * as _ from 'lodash'
  export default {
    name: 'multiple-choice-grid',
    props: {
      'rows': {
        default: function () {
          return []
        }
      },
      'columns': {
        default: function () {
          return []
        }
      }
    },
    methods: {
    },
    mounted () {
      if (this.rows.length === 0) {
        this.computedRows = [
          'Row 1'
        ]
      }
      if (this.columns.length === 0) {
        this.computedColumns = [
          'Column 1'
        ]
      }
    },
    computed: {
      computedRows: {
        get: function () {
          return this.rows
        },
        set: function (rows) {
          this.$emit('update-rows', rows)
        }
      },
      computedColumns: {
        get: function () {
          return this.columns
        },
        set: function (columns) {
          this.$emit('update-columns', columns)
        }
      }
    }
  }
</script>

<style scoped>
  .radio-wrapper {
    display: inline-block;
  }
  .radio-wrapper > i {
    font-style: normal;
    color: inherit;
    margin-top: 1em;
    margin-right: 0.3em;
  }
  .input-wrapper {
    display: inline-block;
    width: 70%;
  }
  .close-wrapper {
    display: inline-block;
    padding: 0.5em;
  }
  .actions {
    display: flex;
  }
  .actions > .input-wrapper {
    width: 7em;
  }
</style>
