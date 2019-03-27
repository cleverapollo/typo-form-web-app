// Appication Mixin
import CoreMixin from './CoreMixin.js'
export default {
  mixins: [CoreMixin],
  computed: {
    $_slug: function () {
      return window.location.hostname.split('.')[0]
    },
    $_application: function () {
      return this.$store.getters.loadedApplication(this.$_slug)
    },
    $_users: function () {
      return this.$store.getters.loadedUsers(this.$_slug)
    }
  },
  methods: {
    $_findApplicationUser: function (userId) {
      return this.$_users.find(user => {
        return user.id === userId
      })
    },
    $_getApplicationUserRole: function (userId) {
      const user = this.$_findApplicationUser(userId) || this.$_user
      const roleId = user ? user.application_role_id || user.role_id : null
      return roleId ? this.$_findRole(roleId) : null
    },
    $_getApplicationUserRoleName: function (userId) {
      const role = this.$_getApplicationUserRole(userId)
      return role ? role.name : ''
    },
    $_isApplicationAdminUser: function (userId) {
      const roleName = this.$_getApplicationUserRoleName(userId)
      return roleName === 'Super Admin' || roleName === 'Admin'
    },
    $_getApplicationUserFullName: function (userId) {
      const user = this.$_findApplicationUser(userId)
      return user ? user.first_name + ' ' + user.last_name : null
    }
  },
  created () {
    this.$store.dispatch('loadUsers', this.$_slug)
  }
}
