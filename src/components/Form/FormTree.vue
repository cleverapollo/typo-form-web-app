<template>
  <v-expansion-panel>
    <v-expansion-panel-content
      v-for="item in list"
      :key="item.id"
      :hide-actions="repeatable(item)"
    >
      <div slot="header">{{ item.name }}</div>

      <v-card>
        <v-card-text>
          <form-tree :formId="formId" :list="children(item)"></form-tree>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
    export default {
      name: 'form-tree',
      props: ['formId', 'list'],
      methods: {
        children (item) {
          const children = this.$store.getters.loadedChildren(this.formId, item.id)
          return children.filter(child => {
            if (child.questions) return true
            return false
          })
        },
        repeatable (item) {
          const items = this.children(item)
          return (items.length === 0)
        }
      }
    }
</script>

<style scoped>
  .list--group .list__tile {
    padding-left: 15px !important;
  }
</style>
