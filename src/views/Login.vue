<template>
  <v-container class="fill-height">
    <v-row>
      <v-col align="center" cols="12">
        <v-card max-width="500">
          <v-card-title> Login </v-card-title>
          <v-card-text>
            <v-form ref="loginForm">
              <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                  <v-text-field
                    label="id"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => (!!v && !idError) || 'Invalid ID',
                    ]"
                    prepend-icon="mdi-account"
                    v-model="loginModel.id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pt-0 pb-0">
                  <v-text-field
                    label="Password"
                    v-model="loginModel.password"
                    prepend-icon="mdi-lock"
                    type="password"
                    @keypress.enter="onLogin"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => (!!v && !passError) || 'Invalid password',
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed tile @click="onLogin">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    onLogin() {
      this.$axios
        .post("/api/auth", this.loginModel)
        .then((user) => {
          console.log("success");
          this.$refs.loginForm.resetValidation();
          this.$store.commit("login", user.data);
          this.$router.push("/");
        })
        .catch((err) => {
          switch (err.response.status) {
            case 403:
            case 404:
              this.passError = true;
              this.idError = true;
              break;
            default:
              break;
          }
          this.$refs.loginForm.validate();
        });
    },
  },
  data: () => ({
    loginModel: {
      id: "",
      password: "",
    },
    passError: false,
    idError: false,
  }),
};
</script>

<style></style>
