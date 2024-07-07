import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";

export const userStore = defineStore("userStore", {
  state: () => ({
    session: null,
    userData: null,
    currentProject: null,
  }),
  actions: {
    setSession(session) {
      this.session = session;
      this.checkUserProfile();
    },
    async checkUserProfile() {
      if (!this.session) return;

      let userId = this.session.user.id;
      const { data: user } = await supabase.from("user").select().eq("id", userId);
      if (user.length > 0) {
        this.userData = user[0];
      } else {
        const { data: newUser } = await supabase
          .from("user")
          .insert([{ id: userId, first_name: this.session.user?.user_metadata?.name, last_name: "", email: this.session.user?.email, avatar_id: 0 }])
          .select();
        this.userData = newUser[0];
      }
    },
    clearSession() {
      this.session = null;
      this.userData = null;
    },
    async setCurrentProject(project) {
      this.currentProject = project;
    },
  },
  getters: {
    getSession() {
      return this.session;
    },
    getUserData() {
      return this.userData;
    },
    getCurrentProject() {
      return this.currentProject;
    },
  },
});
