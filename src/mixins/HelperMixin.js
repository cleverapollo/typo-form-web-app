// Helper Mixin
import moment from 'moment'
export default {
  computed: {
    $_slug: function () {
      return window.location.hostname.split('.')[0]
    }
  },
  methods: {
    $_getDate: function (date) {
      return moment(date).format('YYYY-MM-DD h:mm A')
    },
    $_getDateTime: function (date) {
      return moment(date).format('YYYY-MM-DD [at] LTS')
    }
  }
}
