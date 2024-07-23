<template>
  <div class="app_wrapper" :style="themeColors">
    <TheHeader />
    <div class="flex grow">
      <TheSidepanel class="sidepanel" />
      <RouterView class="main" />
    </div>
    <n-modal v-model:show="showModal" :mask-closable="forceLoginMode ? true : false">
      <n-card style="width: 90%" title="Welcome to Gemini!" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="flex">
          <div v-if="!forceLoginMode" class="new-user-col min-w-1/2 flex flex-col items-center p-2">
            <h2 class="text-center text-lg font-bold mb-2">Just Stopping By?</h2>
            <p class="mb-2">Enter a basic description of your app and we'll try to help you out</p>
            <n-input type="textarea" v-model:value="quickAppDescription" placeholder="Enter a description of your app" />
            <n-button @click="startQuickVersion" class="lets-get-started-bttn">Lets Get Started</n-button>
            <n-spin class="m-8" v-if="quickModeLoading" />
          </div>
          <div class="returning-user-col flex grow flex-col items-center p-2">
            <h2 class="text-center text-lg font-bold mb-2">Plan On Staying A While?</h2>
            <p class="mb-4" v-if="!signUpMode"><span class="text-md font-bold">Log in now.</span> Don't have an account? <span class="primary-text-color underline cursor-pointer" @click="signUpMode = true">Sign up here.</span></p>
            <p class="mb-4" v-else><span class="text-md font-bold">Sign up now.</span> Already have an account? <span class="primary-text-color underline cursor-pointer" @click="signUpMode = false">Login in here.</span></p>
            <div class="mb-4">
              <div v-if="signUpMode" class="flex">
                <div class="mr-2">
                  <label>First Name</label>
                  <n-input type="text" v-model:value="firstName" class="w-full" />
                </div>
                <div class="">
                  <label>Last Name</label>
                  <n-input type="text" v-model:value="lastName" class="w-full" />
                </div>
              </div>
              <div class="mb-2">
                <label>Email</label>
                <n-input type="email" v-model:value="email" class="w-full" />
              </div>
              <div>
                <label>Password</label>
                <n-input type="password" v-model:value="password" class="w-full" />
              </div>
              <div v-if="signUpMode">
                <div>
                  <label>Confirm Password</label>
                  <n-input type="password" v-model:value="confirmPassword" class="w-full" />
                </div>
                <div>
                  <label>Project Description</label>
                  <n-input type="textarea" v-model:value="initialProjectDescription" class="w-full" />
                </div>
              </div>
              <div class="m-8">
                <n-button class="w-full rounded-lg" type="primary" @click="signUpMode ? signUp() : logIn()">{{ signUpMode ? "Sign Up Now" : "Log In Now" }}</n-button>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import TheHeader from "./components/TheHeader.vue";
import TheSidepanel from "./components/TheSidepanel.vue";
import { supabase } from "@/lib/supabaseClient";
import { projectStore } from "@/stores/projectStore";
import { NModal, NCard, NInput, NButton, NSpin } from "naive-ui";
import { useEventBus } from "@vueuse/core";

export default {
  components: { TheHeader, TheSidepanel, RouterLink, RouterView, NModal, NCard, NInput, NButton, NSpin },
  data() {
    return {
      showModal: false,
      forceLoginMode: false,
      quickAppDescription: "",
      quickModeLoading: false,
      signUpMode: false,
      email: "",
      password: "",
      confirmPassword: "",
      initialProjectDescription: "",
      firstName: "",
      lastName: "",
    };
  },
  computed: {
    themeColors() {
      return {
        "--primary": this.$colors.primary,
        "--secondary": this.$colors.secondary,
        "--tertiary": this.$colors.tertiary,
        "--lightgray": this.$colors.lightgray,
        "--dark": this.$colors.dark,
        "--light": this.$colors.light,
      };
    },
  },
  methods: {
    startQuickVersion() {
      this.quickModeLoading = true;
      this.store.setQuickMode(true);
      this.store.setQuickModeDetails(this.quickAppDescription);
    },
    async logIn() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });
      if (error) {
        window.$message.error(error.message);
      } else {
        await this.setLoadInProject();
        this.showModal = false;
      }
    },
    async signUp() {
      if (this.password.length > 8) {
        window.$message.error("Password must be at least 8 characters long");
        return;
      }
      if (this.password !== this.confirmPassword) {
        window.$message.error("Passwords do not match");
        return;
      }
      if (this.firstName.length < 1 || this.lastName.length < 1) {
        window.$message.error("Please enter your first and last name");
        return;
      }
      if (this.initialProjectDescription.length < 1) {
        window.$message.error("Please enter a description of your project");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      });
      if (error) {
        window.$message.error(error.message);
      } else {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([{ user_id: data.user.id, first_name: this.firstName, last_name: this.lastName }])
          .select();

        let randomNumber = Math.floor(Math.random() * (1000 - 100) + 100);
        const { data: projectData, error } = await supabase
          .from("projects")
          .insert([{ title: `Project-${randomNumber}`, user_id: data.user.id }])
          .select();

        const { data: descriptionData, error: descriptionError } = await supabase
          .from("descriptions")
          .insert([{ project_id: projectData[0].id, short_summary: this.initialProjectDescription }])
          .select();

        await this.setLoadInProject();
        this.quickModeLoading = false;
        this.showModal = false;
      }
    },
    async setLoadInProject() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: projects, error: projectsError } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: true });
        if (projects.length > 0) {
          this.store.setUserProjects(projects);
          let lastViewedProject = JSON.parse(localStorage.getItem("gemini-project-id")) || 0;
          let project = projects.find((project) => project.id === lastViewedProject) || projects[0];
          this.store.setCurrentProject(project);
        }
      }
    },
  },
  async mounted() {
    const loginModalBus = useEventBus("loginModalBus");
    loginModalBus.on((event) => {
      this.forceLoginMode = true;
      this.showModal = event;
    });

    this.setLoadInProject();

    let sessionData = await supabase.auth.getSession();
    if (sessionData.data.session != null) {
      this.setLoadInProject();
      this.showModal = false;
    } else {
      this.showModal = true;
    }
  },
  watch: {
    store: {
      deep: true,
      handler() {
        let quickData = this.store.getQuickModeDetails;
        if (quickData && quickData.titles.length > 0 && quickData.features.length > 0) {
          this.showModal = false;
        }
      },
    },
  },
  setup() {
    const store = projectStore();
    return { store };
  },
};
</script>

<style lang="scss">
.app_wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .sidepanel {
    width: 200px;
    background-color: var(--light);
  }
  .main {
    flex: 1;
    .primary-text-color {
      color: #0066ff !important;
    }
    .primary-bg-color {
      background: var(--primary) !important;
    }
  }
}
.lets-get-started-bttn {
  margin-top: 1em;
}
.n-modal,
.n-popover {
  .primary-text-color {
    color: #0066ff !important;
  }
  .primary-bg-color {
    background: #0066ff !important;
  }
}
</style>
