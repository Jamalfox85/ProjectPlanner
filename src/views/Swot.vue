<template>
  <main>
    <div class="swot_wrapper flex flex-col relative">
      <div class="flex items-center">
        <div class="heading-group mb-4 mr-auto">
          <div class="flex items-center">
            <h1 class="current-title">S.W.O.T.</h1>
            <!-- <n-icon class="text-4xl mx-2 currentTitleIcon"><StarEmphasis24Filled /></n-icon> -->
          </div>
        </div>
        <n-spin class="mx-2" v-if="recommendationsLoading" />
        <n-button class="mx-2 primary-bg-color text-white rounded-lg" @click="generateSwot" :disabled="aiResponse.strengths != undefined || recommendationsLoading">
          <Sparkle20Filled class="w-4 mr-2" />
          Generate Results
        </n-button>
        <n-button class="mx-2 primary-bg-color text-white rounded-lg" @click="showAddSWOTDrawer = true">
          <AddCircle20Filled class="w-4 mr-2" />
          Add Item
        </n-button>
      </div>
      <div class="swot-main grow flex">
        <div class="swot-list-column min-w-2/3 grow flex flex-wrap">
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Strengths</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in aiResponse.strengths" class="list-item-container primary-bg-color text-white"><Sparkle20Filled class="w-4 mr-2 inline-block" /> {{ item }} <AddCircle20Filled class="w-4 mr-2 inline-block cursor-pointer" @click="addAISwot(item, 1)" /></li>
                <li v-for="item in strengths" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Weaknesses</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in aiResponse.weaknesses" class="list-item-container primary-bg-color text-white"><Sparkle20Filled class="w-4 mr-2 inline-block" /> {{ item }} <AddCircle20Filled class="w-4 mr-2 inline-block cursor-pointer" @click="addAISwot(item, 2)" /></li>
                <li v-for="item in weaknesses" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Opportunities</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in aiResponse.opportunities" class="list-item-container primary-bg-color text-white"><Sparkle20Filled class="w-4 mr-2 inline-block" /> {{ item }}<AddCircle20Filled class="w-4 mr-2 inline-block cursor-pointer" @click="addAISwot(item, 3)" /></li>
                <li v-for="item in opportunities" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Threats</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in aiResponse.threats" class="list-item-container primary-bg-color text-white"><Sparkle20Filled class="w-4 mr-2 inline-block" /> {{ item }}<AddCircle20Filled class="w-4 mr-2 inline-block cursor-pointer" @click="addAISwot(item, 4)" /></li>
                <li v-for="item in threats" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ADD SWOT DRAWER -->
    <n-drawer v-model:show="showAddSWOTDrawer" :width="502" :placement="'right'">
      <n-drawer-content title="Add Project" class="add-project-drawer">
        <div class="flex flex-col">
          <div class="mb-4">
            <label class="mb-2">Type</label>
            <n-select class="mb-8" v-model:value="newSWOTType" :options="SWOTOptions" />

            <label class="mb-2">Text</label>
            <n-input v-model:value="newSWOTText" placeholder="Project Title" class="w-1/2" />
          </div>
          <n-button class="rounded" @click="addNewSWOT">Create</n-button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </main>
</template>

<script lang="js">
import { Sparkle20Filled, TextEditStyle20Filled, AddCircle20Filled } from "@vicons/fluent";
import { NIcon, NDrawer, NDrawerContent, NSelect, NButton, NInput, NSpin } from "naive-ui";
import { projectStore } from "@/stores/projectStore";
import { supabase } from "@/lib/supabaseClient";
import { getSWOTAnalysis } from "@/services/openai";

export default {
  components: {
    NIcon,
    Sparkle20Filled,
    AddCircle20Filled,
    TextEditStyle20Filled,
    NDrawer,
    NDrawerContent,
    NSelect,
    NButton,
    NInput, NSpin,
  },
  data() {
    return {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      aiResponse: {},
      showAddSWOTDrawer: false,
      newSWOTText: "",
      newSWOTType: 1,
      recommendationsLoading: false,
    };
  },
  computed: {
    SWOTOptions() {
      return [
        { label: "Strength", value: 1 },
        { label: "Weakness", value: 2 },
        { label: "Opportunity", value: 3 },
        { label: "Threat", value: 4 },
      ];
    },
  },
  methods: {
    loadSwotItems() {
      let swotItems = this.store.getSWOTItems;
      this.strengths = [];
      this.weaknesses = [];
      this.opportunities = [];
      this.threats = [];
      swotItems.forEach((item) => {
        if (item.swot_type_id == 1) {
          this.strengths.push(item);
        } else if (item.swot_type_id == 2) {
          this.weaknesses.push(item);
        } else if (item.swot_type_id == 3) {
          this.opportunities.push(item);
        } else if (item.swot_type_id == 4) {
          this.threats.push(item);
        }
      });
    },
    async addNewSWOT() {
      const { data, error } = await supabase
        .from("swot_items")
        .insert([{ text: this.newSWOTText, swot_type_id: this.newSWOTType, project_id: this.store.getCurrentProject?.id }])
        .select();
      if (error) {
        window.$message.error(error.message);
        return;
      }
      if (this.newSWOTType == 1) {
        this.strengths.push({ text: this.newSWOTText });
      } else if (this.newSWOTType == 2) {
        this.weaknesses.push({ text: this.newSWOTText });
      } else if (this.newSWOTType == 3) {
        this.opportunities.push({ text: this.newSWOTText });
      } else if (this.newSWOTType == 4) {
        this.threats.push({ text: this.newSWOTText });
      }
      window.$message.success("Item added successfully");
      this.newSWOTText = "";
      this.newSWOTType = 1;
      this.showAddSWOTDrawer = false;
    },
    async generateSwot() {
      this.recommendationsLoading = true;
      let response = await getSWOTAnalysis(this.store.getDescriptions.short_summary);
      const jsonResponse = JSON.parse(response.replace(/SWOT\s*/, '').trim());

      this.aiResponse.strengths = jsonResponse.strengths
      this.aiResponse.weaknesses = jsonResponse.weaknesses
      this.aiResponse.opportunities = jsonResponse.opportunities
      this.aiResponse.threats = jsonResponse.threats
      this.recommendationsLoading = false;
    },
    async addAISwot(item, type) {
      const { data, error } = await supabase
        .from("swot_items")
        .insert([{ text: item, swot_type_id: type, project_id: this.store.getCurrentProject?.id }])
        .select();
      if (error) {
        window.$message.error(error.message);
        return;
      }
      if (type == 1) {
        this.aiResponse.strengths = this.aiResponse.strengths.filter((i) => i !== item);
        this.strengths.push({ text: item });
      } else if (type == 2) {
        this.aiResponse.weaknesses = this.aiResponse.weaknesses.filter((i) => i !== item);
        this.weaknesses.push({ text: item });
      } else if (type == 3) {
        this.aiResponse.opportunities = this.aiResponse.opportunities.filter((i) => i !== item);
        this.opportunities.push({ text: item });
      } else if (type == 4) {
        this.aiResponse.threats = this.aiResponse.threats.filter((i) => i !== item);
        this.threats.push({ text: item });
      }
      window.$message.success("Item added successfully");
    },
  },
  watch: {
    store: {
      handler: function (val) {
        this.loadSwotItems();
      },
      immediate: true,
      deep: true,
    },
  },
  setup() {
    let store = projectStore();
    return { store };
  },
};
</script>

<style scoped lang="scss">
.swot_wrapper {
  padding: 2em;
  height: 100%;
  .heading-group {
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
  }
  .swot-list-item {
    display: flex;
    flex-direction: column;
    .list-outer-container {
      flex-grow: 1;
      padding: 0.5em;
      margin: 0.5em;
      overflow-y: auto;
      .list-inner-container {
        .list-item-container {
          border: solid 2px purple;
          padding: 0.5em;
          margin-bottom: 0.5em;
          border-radius: 8px;
        }
      }
      &::-webkit-scrollbar {
        width: 12px;
      }
      &::-webkit-scrollbar-track {
        background: #0066ff20;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #0066ff;
        border-radius: 10px;
        border: 2px solid #0066ff;
      }
    }
  }
}
</style>
