<template>

  <!--
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

      <v-card flat v-if="!hasChildren(item)">
        <v-card-text>
          <form-tree
            :formId="formId"
            :section="section"
            :list="children(item)"
            :submissionId="submissionId"
            @section-clicked="sectionClicked"
          ></form-tree>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
  -->

  <v-list>
    <v-list-group
      v-for="(item, index) in list"
      :key="item.id"
    >
      <v-list-tile slot="activator" @click="clickSection(item)">
        <v-list-tile-content>
          <v-list-tile-title>{{ index + 1 }}. {{ item.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-for="subItem in children(item)" :key="subItem.name" @click="clickSection(subItem)">
        <v-list-tile-content>
          <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
  </v-list>

</template>

<script>
    export default {
      name: 'form-tree',
      props: ['formId', 'list', 'section', 'submissionId'],
      data () {
        return {
          opened: true
        }
      },
      methods: {
        children (item) {
          const children = this.$store.getters.loadedChildren(this.formId, item.id)
          return children.filter(child => { return child.questions })
        },
        hasChildren (item) {
          const items = this.children(item)
          return (items.length === 0)
        },
        clickSection (item) {
          const children = this.children(item)
          if (this.submissionId === -1 || children.length === 0) {
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
  .list__group {
    background: #f5f5f5;
    border-bottom:4px solid white;
  }
</style>
