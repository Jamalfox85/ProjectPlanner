<template>
  <main>
    <div class="title_wrapper">
      <div class="flex items-center">
        <div class="heading-group mb-4">
          <div class="project-label">
            <p>Current Title</p>
          </div>
          <div class="flex items-center">
            <h1 class="current-title">{{ currentTitle.title }}</h1>
            <n-icon class="text-4xl mx-2 currentTitleIcon"><StarEmphasis24Filled /></n-icon>
          </div>
        </div>
        <n-button class="ml-auto primary-bg-color text-white rounded-lg" @click="generateTitleRecommendations">
          <Sparkle20Filled class="w-4 mr-2" />
          Generate AI Recommendations
        </n-button>
      </div>
      <div class="main-content mt-8">
        <div class="title-input-group">
          <div class="project-label mb-2">
            <p>New Title Idea</p>
          </div>
          <div class="w-full flex items-center">
            <n-input class="title-input rounded-lg mr-2 text-xl p-2" placeholder="New Title Idea" v-model:value="title" @keypress.enter="submitNewTitle" />
            <n-button class="rounded-lg submit-bttn" @click="submitNewTitle">Submit</n-button>
          </div>
        </div>
        <div class="ideas-section mt-8">
          <div class="flex mb-8">
            <!-- FAVORITE TITLES -->
            <div class="idea-group w-1/2">
              <div class="project-label">
                <n-icon class="mx-2"><Star20Filled /></n-icon>
                <p>Favorite Titles</p>
                <n-icon class="mx-2"><Star20Filled /></n-icon>
              </div>
              <div class="title-list">
                <div class="title-item" v-for="title in favoriteTitles">
                  <p class="title-text">{{ title.title }}</p>
                  <n-icon v-if="title == currentTitle"><StarEmphasis24Filled /></n-icon>
                  <n-icon v-else class="makeCurrentTitle" @click="setCurrentTitle(title, true)"><StarEmphasis24Regular /></n-icon>
                  <n-icon class="removeFromFavorites" @click="removeFromFavorites(title)"><Star20Filled /></n-icon>
                </div>
              </div>
            </div>
            <!-- PAST TITLE IDEAS -->
            <div class="idea-group w-1/2">
              <div class="project-label"><p>Past Title Ideas</p></div>
              <div class="title-list">
                <div class="title-item" v-for="title in pastTitles">
                  <p class="title-text">{{ title.title }}</p>
                  <n-icon class="makeCurrentTitle" @click="setCurrentTitle(title)"><StarEmphasis24Regular /></n-icon>
                  <n-icon class="addToFavorites" @click="addToFavorites(title)"><Star20Regular /></n-icon>
                  <n-icon class="remove" @click="removeFromPastTitles(title)"><PresenceBlocked12Regular /></n-icon>
                </div>
              </div>
            </div>
          </div>
          <!-- AI TITLES -->
          <div class="idea-group" v-if="aiTitles.length > 0">
            <div class="project-label">
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
              <p>AI Recommended Titles</p>
              <n-icon class="mx-2"><Sparkle20Regular /></n-icon>
            </div>
            <!-- <n-button v-if="aiTitles.length < 1" @click="generateTitleRecommendations" class="generate-titles-bttn rounded-xl mt-4">Generate Recommendations</n-button> -->
            <div class="title-list">
              <div class="title-item" v-for="title in aiTitles">
                <p class="title-text">{{ title }}</p>
                <n-icon class="addToFavorites" @click="submitNewAITitle(title)"><Star20Regular /></n-icon>
                <n-icon class="remove" @click="removeFromAISuggestions(title)"><PresenceBlocked12Regular /></n-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { NInput, NButton, NIcon } from "naive-ui";
import { StarEmphasis24Regular, StarEmphasis24Filled, Sparkle20Regular, Star20Filled, Star20Regular, PresenceBlocked12Regular, Sparkle20Filled } from "@vicons/fluent";
import { supabase } from "@/lib/supabaseClient";
import { getTitleRecommendations } from "@/services/openai.js";
import { projectStore } from "@/stores/projectStore";

export default {
  components: {
    NInput,
    NButton,
    NIcon,
    StarEmphasis24Regular,
    StarEmphasis24Filled,
    Sparkle20Regular,
    Star20Filled,
    Star20Regular,
    Sparkle20Filled,
    PresenceBlocked12Regular,
  },
  data() {
    return {
      title: "",
      currentTitle: { title: "" },
      favoriteTitles: [],
      aiTitles: [],
      pastTitles: [],
    };
  },
  computed: {},
  methods: {
    async submitNewTitle() {
      let newTitle = {
        title: this.title,
        is_current_title: false,
        is_favorite_title: false,
        project_id: this.store.getCurrentProject.id,
      };
      const { data, error } = await supabase.from("titles").insert(newTitle).select();
      this.store.setTitles();
      if (data) {
        //@ts-ignore
        window.$message.success("New Title Added!");
        this.pastTitles.unshift(data[0]);
        this.title = "";
      } else {
        //@ts-ignore
        window.$message.error("Error Adding New Title");
      }
    },
    async submitNewAITitle(title) {
      let newTitle = {
        title: title,
        is_current_title: false,
        is_favorite_title: false,
        project_id: this.store.getCurrentProject.id,
      };
      const { data, error } = await supabase.from("titles").insert(newTitle).select();
      this.store.setTitles();
      if (data) {
        //@ts-ignore
        window.$message.success("New Title Added!");
        this.pastTitles.unshift(data[0]);
        this.title = "";
      } else {
        //@ts-ignore
        window.$message.error("Error Adding New Title");
      }
    },
    setCurrentTitle(title: object, favorite: boolean = false) {
      this.currentTitle = title;
      if (!favorite) {
        this.favoriteTitles.unshift(title);
        this.pastTitles = this.pastTitles.filter((t) => t !== title);
        this.aiTitles = this.aiTitles.filter((t) => t !== title);
      }
      this.updateTitleInDB(title, true, true);
      //@ts-ignore
      window.$message.success("Current Title Updated!");
    },
    addToFavorites(title: object) {
      this.favoriteTitles.unshift(title);
      this.pastTitles = this.pastTitles.filter((t) => t !== title);
      this.aiTitles = this.aiTitles.filter((t) => t !== title);
      this.updateTitleInDB(title, false, true);
      //@ts-ignore
      window.$message.success("Title Added to Favorites!");
    },
    removeFromFavorites(title: object) {
      this.favoriteTitles = this.favoriteTitles.filter((t) => t !== title);
      this.pastTitles.unshift(title);
      this.updateTitleInDB(title, false, false);
      //@ts-ignore
      window.$message.warning("Title Removed from Favorites");
    },
    async removeFromPastTitles(title: any) {
      const { error } = await supabase.from("titles").delete().eq("id", title.id);
      this.store.setTitles();
      if (error) {
        //@ts-ignore
        window.$message.error("Error Removing Title");
        return;
      }
      this.pastTitles = this.pastTitles.filter((t) => t !== title);

      //@ts-ignore
      window.$message.warning("Title Removed from Past Titles");
    },
    removeFromAISuggestions(title: object) {
      this.aiTitles = this.aiTitles.filter((t) => t !== title);
      //@ts-ignore
      window.$message.warning("Title Removed from AI Suggestions");
    },
    async updateTitleInDB(title, is_current_title = false, is_favorite_title = false) {
      let currentTitle = is_current_title;
      let favoriteTitle = is_favorite_title;
      if ((is_current_title = true)) {
        const { data: arrayData, error: arrayError } = await supabase.from("titles").update({ is_current_title: false }).eq("project_id", this.store.getCurrentProject.id).select("*");
        const { data: projectData, error: projectError } = await supabase.from("projects").update({ title: this.currentTitle.title }).eq("id", this.store.getCurrentProject.id).select("*");
        this.store.setTitles();
      }
      const { data, error } = await supabase.from("titles").update({ is_current_title: currentTitle, is_favorite_title: favoriteTitle }).eq("id", title.id).select();
      this.store.setTitles();
    },
    async generateTitleRecommendations() {
      let recommendations = await getTitleRecommendations(this.favoriteTitles, "App to help solo developers plan projects before development");
      this.aiTitles = JSON.parse(recommendations);
      console.log("AI Titles", this.aiTitles);
    },
    getTitles() {
      let titles = this.store.getTitles;
      this.currentTitle = { title: "" };
      this.favoriteTitles = [];
      this.pastTitles = [];
      if (titles.length > 0) {
        titles.forEach((title) => {
          if (title.is_current_title) {
            this.currentTitle = title;
          }
          if (title.is_favorite_title) {
            this.favoriteTitles.push(title);
          } else {
            this.pastTitles.push(title);
          }
        });
      }
    },
  },
  watch: {
    store: {
      async handler() {
        this.getTitles();
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    const store = projectStore();
    return { store };
  },
};
</script>

<style scoped lang="scss">
.title_wrapper {
  padding: 2em;
  height: 100%;
  .project-label {
    background-color: var(--dark);
    color: var(--light);
    width: fit-content;
    padding: 4px 12px;
    border-radius: 1em;
    display: flex;
    align-items: center;
  }
  .currentTitleIcon {
    color: var(--primary);
  }
  .current-title {
    font-size: 2em;
    font-weight: bold;
  }
  .main-content {
    display: flex;
    flex-direction: column;
    .title-input-group {
      margin: 0 auto;
      width: 50%;
      min-width: 400px;
      .title-input {
        // width: 100%;
      }
      .submit-bttn {
        background-color: var(--primary);
        color: var(--light);
        &:hover {
          background-color: var(--light);
          color: var(--primary);
        }
      }
    }
    .ideas-section {
      .idea-group {
        border: solid 1px var(--lightgray);
        border-radius: 8px;
        padding: 1em;
        margin: 1em;
        .generate-titles-bttn {
          background-color: var(--primary);
          color: var(--light);
          &:hover {
            background-color: var(--light);
            color: var(--primary);
          }
        }
        .title-list {
          margin-top: 12px;
          .title-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            .title-text {
              background-color: var(--light);
              flex-grow: 1;
              max-width: 500px;
              padding: 4px 12px;
              border-radius: 12px;
              margin-right: 12px;
            }
            i {
              font-size: 2em;
              margin-right: 4px;
              cursor: pointer;
              &.makeCurrentTitle {
                &:hover {
                  color: var(--secondary);
                  background: var(--primary);
                  border-radius: 4px;
                }
              }
              &.removeFromFavorites {
                &:hover {
                  color: var(--secondary);
                  background: var(--tertiary);
                  border-radius: 4px;
                }
              }
              &.addToFavorites {
                &:hover {
                  color: var(--primary);
                  background: var(--light);
                  border-radius: 4px;
                }
              }
              &.remove {
                font-size: 1.5em;
                &:hover {
                  color: var(--secondary);
                  background: var(--tertiary);
                  border-radius: 4px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
