<template>
  <v-container>
    <v-dialog v-model="onDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          {{ addFlag ? "사용자 추가" : `사용자 편집: ${userModel.id}` }}
        </v-card-title>
        <v-card-text>
          <v-form ref="userForm">
            <v-row>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-show="addFlag"
                  v-model="userModel.id"
                  label="ID"
                  :rules="[
                    (v) => !!v || 'required',
                    (v) =>
                      (!!v && v.length > 3) || 'id must have more 3 length',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="userModel.name"
                  label="name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="userModel.password"
                  v-if="addFlag"
                  label="password"
                  type="password"
                  :rules="[
                    (v) => !!v || 'required',
                    (v) =>
                      (!!v && v.length > 3) ||
                      'password must have more 3 length',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="userModel.position"
                  label="Position"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="userModel.contact"
                  label="Contact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- fill empty space -->
          <v-btn color="primary" tile depressed @click="onOK">OK</v-btn>
          <!-- tile depressed-->
          <v-btn color="primary" tile outlined @click="onCancel">Cancel</v-btn>
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
        <v-btn icon><v-icon @click="onAddDialog()">mdi-plus</v-icon></v-btn>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="10"
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
    this.getUser();
  },
  methods: {
    getUser() {
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
    onOK() {
      if (!this.$refs.userForm.validate()) {
        return;
      }
      if (this.addFlag) {
        this.$axios
          .post("/api/users", this.userModel)
          .then(() => {
            this.onDialog = false;
            this.getUser();
          })
          .catch((err) => {
            console.log("post failed", err);
          });
      } else {
        this.$axios
          .patch(`/api/users/${this.userModel.id}`, {
            name: this.userModel.name,
            contact: this.userModel.contact,
            position: this.userModel.position,
          })
          .then(() => {
            this.onDialog = false;
            this.addFlag = true;
            this.getUser();
          })
          .catch((err) => {
            console.log("patch failed", err);
          });
      }
      this.$refs.userForm.reset();
    },
    onCancel() {
      this.$refs.userForm.reset();
      this.onDialog = false;
    },
    onAddDialog() {
      this.addFlag = true;
      this.onDialog = true;
    },
    onEditDialog(item) {
      this.userModel = { ...item };
      this.addFlag = false;
      this.onDialog = true;
    },
    onDeleteClick(userID) {
      console.log("id: ", userID);
      this.$axios
        .delete(`/api/users/${userID}`)
        .then(() => {
          this.deleteDialog = false;
          this.deleteUserID = "";
          this.getUser();
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
      userModel: {
        id: "",
        name: "",
        password: "",
        position: "",
        contact: "",
      },
      deleteUserID: "",
      onDialog: false,
      deleteDialog: false,
      addFlag: true,
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
