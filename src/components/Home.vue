<template>
  <v-template>

    <!--
    <v-layout row fill-height>
      <v-flex xs12 class="background-cover" v-bind:style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
        <v-container fill-height>
          <v-layout row wrap align-center>
            <v-flex xs12 class="text-xs-center white--text">
              <div class="flex display-3 font-weight-light my-3">Informed 365</div>
              <div class="flex my-3">
                
              </div>
              <div class="flex">
                <v-btn class="white black--text my-5" large dark>Get Started</v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    -->

    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }} Informed 365 | Terms of Use</div>
    </v-footer>

  </v-template>
</template>

<script>
  export default {
    computed: {
      backgroundImage () {
        return '/static/background.jpg'
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
