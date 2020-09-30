<template>
  <v-container>
    <v-col cols="12"><h4>재실현황판</h4></v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
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
  data() {
    return {
      headers: [
        {
          text: "No",
          value: "no",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Position",
          value: "position",
        },
        {
          text: "Contact",
          value: "contact",
        },
        {
          text: "Now at",
          value: "at",
        },
      ],
      users: [],
    };
  },
};
</script>

<style></style>
