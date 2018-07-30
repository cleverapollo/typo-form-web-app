<template>

  <v-list>
    <v-list-group
      v-for="(item, index) in list"
      :key="item.id"
      v-if="!isSectionTrigger(item) || submissionId === -1"
    >
      <v-list-tile slot="activator" @click="clickSection(item)" class="v-list__group__header_tile">
        <v-list-tile-avatar>
          <v-icon v-if='sectionProgress(formId, item.id, submissionId) === 100'>check_circle</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-for="subItem in children(item)" :key="subItem.name" @click="clickSection(subItem)" v-if="!isSectionTrigger(subItem) || submissionId === -1">
        <v-list-tile-avatar>
          <v-icon v-if='sectionProgress(formId, subItem.id, submissionId) === 100'>check_circle</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title class="ml-3">{{ subItem.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
  </v-list>

</template>

<script>
  import TriggerMixin from './TriggerMixin.js'
  import * as _ from 'lodash'
  export default {
    name: 'form-tree',
    props: ['formId', 'list', 'section', 'submissionId'],
    mixins: [TriggerMixin],
    data () {
      return {
        opened: true
      }
    },
    methods: {
      children (item) {
        return _.sortBy(this.$store.getters.loadedChildrenSection(this.formId, item.id), element => {
          return element.order
        })
      },
      hasChildren (item) {
        return this.children(item).length === 0
      },
      clickSection (item) {
        if (this.submissionId === -1 || this.hasChildren(item)) {
          this.$emit('section-clicked', item)
        }
      },
      active (item) {
        return (this.section && item.id === this.section.id) ? 'active' : ''
      }
    }
  }
</script>

<style scoped>
  .v-list__group {
    background: rgba(0,0,0,.04);
    border-bottom: 4px #ffffff solid;
  }

  .v-list__group__header_tile {
    flex: 1 1 auto!important;
    overflow: hidden;
  }

  .v-list {
    background:transparent;
  }

  .v-list__group__items {
    padding-left: 15px;
  }
</style>
