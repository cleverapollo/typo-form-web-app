'use strict'
require('dotenv').config()
module.exports = {
  NODE_ENV: '"production"',
  APP_NAME: JSON.stringify(process.env.APP_NAME),
  API_URL: JSON.stringify(process.env.API_URL),
  API_ORIGIN_URL: JSON.stringify(process.env.API_ORIGIN_URL),

  GITHUB_CLIENT_ID: JSON.stringify(process.env.GITHUB_CLIENT_ID),
  GITHUB_CLIENT_SECRET: JSON.stringify(process.env.GITHUB_CLIENT_SECRET),

  FACEBOOK_CLIENT_ID: JSON.stringify(process.env.FACEBOOK_CLIENT_ID),
  FACEBOOK_CLIENT_SECRET: JSON.stringify(process.env.FACEBOOK_CLIENT_SECRET),

  GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: JSON.stringify(process.env.GOOGLE_CLIENT_SECRET),

  LIVE_CLIENT_ID: JSON.stringify(process.env.LIVE_CLIENT_ID),
  LIVE_CLIENT_SECRET: JSON.stringify(process.env.LIVE_CLIENT_SECRET),

  REDIRECT_URL: JSON.stringify(process.env.REDIRECT_URL)
}
