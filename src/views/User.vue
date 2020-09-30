<template>
  <v-container>
    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title> 사용자추가 </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field v-model="newUserModel.id" label="ID"></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="newUserModel.name"
                label="name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="newUserModel.password"
                label="password"
                type="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="newUserModel.position"
                label="Position"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="newUserModel.contact"
                label="Contact"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- fill empty space -->
          <v-btn color="primary" tile depressed @click="onAddClick">OK</v-btn>
          <!-- tile depressed-->
          <v-btn color="primary" tile outlined @click="addDialog = false"
            >Cancel</v-btn
          >
          <!-- outlined -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          사용자 편집 ID: {{ editUserModel.id }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="editUserModel.name"
                label="name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="editUserModel.password"
                label="password"
                type="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="editUserModel.position"
                label="Position"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                v-model="editUserModel.contact"
                label="Contact"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- fill empty space -->
          <v-btn
            color="primary"
            tile
            depressed
            @click="onEditClick(editUserModel)"
            >OK</v-btn
          >
          <!-- tile depressed-->
          <v-btn color="primary" tile outlined @click="editDialog = false"
            >Cancel</v-btn
          >
          <!-- outlined -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> 사용자 삭제 </v-card-title>
        <v-card-text>
          해당 사용자의 정보가 삭제됩니다.
          <p />
          정말로 진행하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false">
            NO
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="onDeleteClick(deleteUserID)"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8" align="center"><h4>사용자관리</h4></v-col>
      <v-col cols="2" align="end">
        <v-btn icon><v-icon @click="addDialog = true">mdi-plus</v-icon></v-btn>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.edit="{ item }">
            <v-btn icon
              ><v-icon @click="onEditDialog(item)">mdi-pencil</v-icon></v-btn
            >
          </template>
          <template v-slot:item.delete="{ item }">
            <v-btn icon
              ><v-icon @click="onDeleteDialog(item.id)"
                >mdi-delete</v-icon
              ></v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
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
    onAddClick() {
      this.$axios
        .post("/api/users", this.newUserModel)
        .then(() => {
          this.addDialog = false;
          this.newUserModel = {
            id: "",
            name: "",
            password: "",
            position: "",
            contact: "",
          };
        })
        .catch((err) => {
          console.log("post failed", err);
        });
    },
    onEditClick(editUserModel) {
      console.log("id: ", editUserModel.id);
      this.editDialog = false;
    },
    onEditDialog(item) {
      this.editDialog = true;
      this.editUserModel = item;
    },
    onDeleteClick(userID) {
      console.log("id: ", userID);
      this.$axios
        .delete("/api/users/" + `${userID}`)
        .then(() => {
          this.deleteDialog = false;
          this.deleteUserID = "";
        })
        .catch((err) => {
          console.log("delete failed", err);
        });
    },
    onDeleteDialog(id) {
      this.deleteDialog = true;
      this.deleteUserID = id;
    },
  },
  data() {
    return {
      newUserModel: {
        id: "",
        name: "",
        password: "",
        position: "",
        contact: "",
      },
      editUserModel: {
        id: "",
        name: "",
        password: "",
        position: "",
        contact: "",
      },
      deleteUserID: "",
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      headers: [
        { text: "No", value: "no" },
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Position", value: "position" },
        { text: "Contact", value: "contact" },
        { text: "Now at", value: "at" },
        { text: "Created at", value: "createdAt" },
        { text: "Edit", value: "edit" },
        { text: "Delete", value: "delete" },
      ],
      users: [],
    };
  },
};
</script>

<style></style>
