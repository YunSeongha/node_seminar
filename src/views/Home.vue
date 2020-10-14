<template>
  <v-container>
    <v-dialog v-model="atDialog" max-width="500px">
      <v-card>
        <v-card-title> 재실 상태 변경 </v-card-title>
        <v-card-text>
          <v-row>
            <v-radio-group v-model="selectedAt">
              <v-radio label="Lab" value="Lab"></v-radio>
              <v-radio label="In campus" value="In campus"></v-radio>
              <v-radio label="Out campus" value="Out campus"></v-radio>
              <v-radio label="Home" value="Home"></v-radio>
            </v-radio-group>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" tile depressed @click="onOk">OK</v-btn>
          <v-btn color="primary" tile outlined @click="atDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="12"><h4>재실현황판</h4></v-col>
    <v-col cols="12">
      <v-data-table
        @click:row="onRowClick"
        :headers="headers"
        :items="users"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, -1],
        }"
        class="elevation-3"
      >
        <!--eslint-disable-->
        <template v-slot:item.at="{ item }">
          <v-chip :color="getColor(item.at)" dark>{{ item.at }}</v-chip>
        </template>
      </v-data-table>
    </v-col>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$axios
      .get("/api/users")
      .then((result) => {
        this.users = result.data;
        this.users.map((val, idx) => {
          val.no = idx + 1;
        });
      })
      .catch((err) => {
        console.log("mounted fail", err);
      });
  },
  methods: {
    onRowClick(user) {
      this.selectedAt = user.at;
      this.userModel = user;
      this.atDialog = true;
    },
    onOk() {
      this.$axios
        .patch(`/api/users/${this.userModel.id}`, { at: this.selectedAt })
        .then(() => {
          this.userModel.at = this.selectedAt;
          this.atDialog = false;
        })
        .catch((err) => {
          console.log("patch fail", err);
        });
    },
    getColor(at) {
      switch (at) {
        case "Lab":
          return "green darken-3";
        case "In campus":
          return "light-green lighten-1";
        case "Out campus":
          return "orange darken-1";
        default:
          return "blue-grey darken-3";
      }
    },
  },
  data() {
    return {
      atDialog: false,
      userModel: {},
      selectedAt: "",
      headers: [
        { text: "No", value: "no" },
        { text: "Name", value: "name" },
        { text: "Position", value: "position" },
        { text: "Contact", value: "contact" },
        { text: "Now at", value: "at" },
      ],
      users: [],
    };
  },
};
</script>

<style></style>
