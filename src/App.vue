<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Appsec Lab</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!userId" to="/login" color="primary" class="elevation-0"
        ><v-icon left>mdi-login</v-icon>Login</v-btn
      >

      <v-btn
        v-else
        color="primary"
        class="elevation-0"
        @click="$store.commit('logout')"
        ><v-icon left>mdi-logout</v-icon>Logout</v-btn
      >
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/user" v-if="role == 'admin'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>User</v-list-item-title>
          </v-list-item>

          <v-list-item to="/login" v-if="!userId">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>

          <v-list-item to="/login" v-else @click="$store.commit('logout')">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    userId() {
      return this.$store.state.id;
    },
    role() {
      return this.$store.state.role;
    },
  },
  name: "App",

  components: {},

  data: () => ({
    //
    drawer: false,
  }),
};
</script>
