<template>
  <v-layout row wrap>
    <template v-if="editMode">
      <v-textarea
        v-model="text"
        @blur="updateText"
        rows="1"
      ></v-textarea>
    </template>

    <template v-else>
      <div class="title pa-4" @click="editMode=userIsApplicationAdmin">
        <span>{{ text ? text : 'Click here to add custom slot.' }}</span>
      </div>
    </template>
  </v-layout>
</template>

<script>
  import LayoutMixin from './LayoutMixin'
  export default {
    name: 'CustomSlot',
    props: ['type'],
    mixins: [LayoutMixin],
    data () {
      return {
        text: '',
        editMode: false
      }
    },
    mounted () {
      this.text = this.metaValue(this.type)
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsApplicationAdmin () {
        return this.userIsAdmin || this.isSuperUser
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      updateText () {
        this.editMode = false
        if (!this.meta) {
          const newMeta = {}
          newMeta[this.type] = this.text
          this.createMeta(JSON.stringify(newMeta))
        } else {
          try {
            const oldMetaData = JSON.parse(this.meta.metadata)
            oldMetaData[this.type] = this.text
            this.updateMeta(JSON.stringify(oldMetaData))
          } catch (error) {
            return false
          }
        }
      }
    }
  }
</script>
