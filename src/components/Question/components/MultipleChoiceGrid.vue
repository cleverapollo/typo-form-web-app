<template>
  <v-layout>
    <v-flex xs6>
      <div>Rows</div>
      <draggable v-model='computedRows' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(rowString, index) in computedRows' :key='"Option " + index' class='"item" + index'>
          <div class='radio-wrapper'>
            <i aria-hidden="true" class="icon">{{ index + 1 }}.</i>
          </div>
          <div class='input-wrapper'>
            <v-text-field
              autofocus
              :value='rowString'
            ></v-text-field>
          </div>
          <div class='close-wrapper' v-show='computedRows.length > 1'>
            <v-btn flat icon @click='removeRow(index)'>
              <v-icon>close</v-icon>
            </v-btn>
          </div>
        </v-layout>
        <div class='actions'>
          <div class='radio-wrapper'>
            <i aria-hidden="true" class="icon">{{ computedRows.length + 1 }}.</i>
          </div>
          <div class='input-wrapper'>
            <v-text-field
              value='Add row'
              @click='addRow'
            ></v-text-field>
          </div>
        </div>
      </draggable>
    </v-flex>
    <v-flex xs6>
      <div>Columns</div>
      <draggable v-model='computedColumns' class='dragArea' :options='{group:"people", draggable:".item"}' style='min-height: 100px'>
        <v-layout row v-for='(columnString, index) in computedColumns' :key='"Option " + index' class='"item" + index'>
          <div class='radio-wrapper'>
            <i aria-hidden="true" class="icon icon--selection-control material-icons">radio_button_unchecked</i>
          </div>
          <div class='input-wrapper'>
            <v-text-field
              autofocus
              :value='columnString'
            ></v-text-field>
          </div>
          <div class='close-wrapper' v-show='computedColumns.length > 1'>
            <v-btn flat icon @click='removeColumn(index)'>
              <v-icon>close</v-icon>
            </v-btn>
          </div>
        </v-layout>
        <div class='actions'>
          <div class='radio-wrapper'>
            <i aria-hidden="true" class="icon icon--selection-control material-icons">radio_button_unchecked</i>
          </div>
          <div class='input-wrapper'>
            <v-text-field
              value='Add column'
              @click='addColumn'
            ></v-text-field>
          </div>
        </div>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<script>
  import draggable from 'vuedraggable'
  import * as _ from 'lodash'
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
    components: {
      draggable
    },
    methods: {
      addRow () {
        this.computedRows.push(`Row ${this.computedRows.length + 1}`)
      },
      removeRow (index) {
        const rows = _.remove(this.computedRows, (item, n) => { return n !== index })
        this.computedRows = rows
      },
      addColumn () {
        this.computedColumns.push(`Column ${this.computedColumns.length + 1}`)
      },
      removeColumn (index) {
        const columns = _.remove(this.computedColumns, (item, n) => { return n !== index })
        this.computedColumns = columns
      }
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
