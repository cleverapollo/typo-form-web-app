<template>
  <v-template>

    <v-layout row fill-height>
      <v-flex xs12 class="background-cover" v-bind:style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
        <v-container fill-height>
          <v-layout row wrap align-center>
            <v-flex xs12 class="text-xs-center white--text">
              <div class="flex headline font-weight-light my-3">Login/Register/Password Reset Components here.</div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>

  </v-template>
</template>

<script>
  export default {
    computed: {
      backgroundImage () {
        return '/static/background.jpg' //Default image, set from application if available
      }
    }
  }
</script>

<style>
  .app-toolbar.v-toolbar,
  .app-toolbar-divider.v-divider {
    display:none !important;
  }
  .v-content {
    padding: 0 !important;
  }
  .app-container {
    padding:0;
    height:100%;
  }
</style>
