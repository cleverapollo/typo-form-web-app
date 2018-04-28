<template>
  <v-expansion-panel>
    <v-expansion-panel-content
      v-for="item in list"
      :key="item.id"
      :hide-actions="hasChildren(item)"
      v-model="opened"
    >
      <div
        slot="header"
        @click="clickSection(item)"
        :class="active(item)"
      >
        {{ item.name }}
      </div>

      <v-card v-if="!hasChildren(item)">
        <v-card-text>
          <form-tree
            :formId="formId"
            :section="section"
            :list="children(item)"
            :view="view"
            @section-clicked="sectionClicked"
          ></form-tree>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
    export default {
      name: 'form-tree',
      props: ['formId', 'list', 'section', 'view'],
      data () {
        return {
          opened: true
        }
      },
      methods: {
        children (item) {
          const children = this.$store.getters.loadedChildren(this.formId, item.id)
          return children.filter(child => {
            if (child.questions) return true
            return false
          })
        },
        hasChildren (item) {
          const items = this.children(item)
          return (items.length === 0)
        },
        clickSection (item) {
          const children = this.children(item)
          if (this.view === 'questions' || children.length === 0) {
            this.$emit('section-clicked', item)
          }
        },
        sectionClicked (item) {
          this.$emit('section-clicked', item)
        },
        active (item) {
          return (this.section && item.id === this.section.id) ? 'active' : ''
        }
      }
    }
</script>

<style scoped>
  .list--group .list__tile {
    padding-left: 15px !important;
  }

  .expansion-panel__header {
    border-bottom: 1px solid rgba(0, 0, 0, .12);
  }

  .expansion-panel__header .active {
    color: #1976D2 !important;
  }
</style>
