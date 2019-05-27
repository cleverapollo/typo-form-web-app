// Helper Mixin
import moment from 'moment'
export default {
  computed: {
    $_slug: () => window.location.hostname.split('.')[0],
    $_appName: () => process.env.APP_NAME,
    $_appDomain: () => process.env.APP_DOMAIN,
    $_sslEnabled: () => process.env.SSL_ENABLED === 'true',
    $_protocol () {
      return 'http' + (this.$_sslEnabled ? 's' : '') + '://'
    }
  },
  methods: {
    $_getDate: date => moment(date).format('YYYY-MM-DD'),
    $_getDateTime: date => moment(date).format('YYYY-MM-DD h:mm A'),
    $_getTimeSince: date => moment(date).fromNow(),
    $_getFirstChar: string => string.charAt(0).toUpperCase(),
    $_getApplicationUrl (slug) {
      return this.$_protocol + slug + '.' + this.$_appDomain
    }
  }
}
