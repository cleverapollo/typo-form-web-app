// Core Mixin
import moment from 'moment'
export default {
  computed: {
    $_user: function () {
      return this.$store.getters.user
    },
    $_roles: function () {
      return this.$store.getters.roles
    }
  },
  methods: {
    $_isSuperUser: function () {
      const role = this.$_user ? this.$_findRole(this.$_user.role_id) : null
      return role && role.name === 'Super Admin'
    },
    $_getUserFullName: function () {
      return this.$_user ? this.$_user.first_name + ' ' + this.$_user.last_name : null
    },
    $_findRole: function (roleId) {
      return this.$_roles.find((role) => {
        return role.id === roleId
      })
    },
    $_getDate: function () {
      return moment().format('YYYY-MM-DD h:mm A')
    },
    $_getDateTime: function () {
      return moment().format('YYYY-MM-DD [at] LTS')
    }
  },
  created () {
    this.$store.dispatch('loadRoles')
  },
  filters: {
    $_formatDate: function (date) {
      return date ? moment(date).format('YYYY-MM-DD') : null
    },
    $_formatDateTime: function (date) {
      return date ? moment(date).format('YYYY-MM-DD h:mm A') : null
    }
  }
}
