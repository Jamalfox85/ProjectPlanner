<template>
  <main>
    <div class="swot_wrapper flex flex-col relative">
      <div class="flex items-center">
        <div class="heading-group mb-4">
          <div class="project-label">
            <p>Current Title</p>
          </div>
          <div class="flex items-center">
            <h1 class="current-title">S.W.O.T.</h1>
            <!-- <n-icon class="text-4xl mx-2 currentTitleIcon"><StarEmphasis24Filled /></n-icon> -->
          </div>
        </div>
        <n-button class="ml-auto bg-blue-500 text-white rounded-lg" @click="showAddSWOTDrawer = true">
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
                <li v-for="item in strengths" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Weaknesses</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in weaknesses" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Opportunities</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in opportunities" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
          <div class="swot-list-item w-1/2 h-1/2 p-4 border-2 rounded-xl">
            <h2 class="text-lg font-bold">Threats</h2>
            <div class="list-outer-container">
              <ul class="list-inner-container">
                <li v-for="item in threats" class="list-item-container">{{ item.text }}</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- <div class="swot-recc-column w-1/3 border-2 rounded-xl p-4">
          <h2 class="text-lg font-bold">Strengths</h2>
          <ul class="mb-8 list-disc ml-4">
            <li>AI Generated #1</li>
            <li>AI Generated #2</li>
            <li>AI Generated #3</li>
            <li>AI Generated #4</li>
          </ul>
          <h2 class="text-lg font-bold">Weaknesses</h2>
          <ul class="mb-8 list-disc ml-4">
            <li>AI Generated #1</li>
            <li>AI Generated #2</li>
            <li>AI Generated #3</li>
            <li>AI Generated #4</li>
          </ul>
          <h2 class="text-lg font-bold">Threats</h2>
          <ul class="mb-8 list-disc ml-4">
            <li>AI Generated #1</li>
            <li>AI Generated #2</li>
            <li>AI Generated #3</li>
            <li>AI Generated #4</li>
          </ul>
          <h2 class="text-lg font-bold">Opportunity</h2>
          <ul class="mb-8 list-disc ml-4">
            <li>AI Generated #1</li>
            <li>AI Generated #2</li>
            <li>AI Generated #3</li>
            <li>AI Generated #4</li>
          </ul>
        </div> -->
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
import { TextEditStyle20Filled, AddCircle20Filled } from "@vicons/fluent";
import { NIcon, NDrawer, NDrawerContent, NSelect, NButton, NInput } from "naive-ui";
import { projectStore } from "@/stores/projectStore";
import { supabase } from "@/lib/supabaseClient";
export default {
  components: {
    NIcon,
    AddCircle20Filled,
    TextEditStyle20Filled,
    NDrawer,
    NDrawerContent,
    NSelect,
    NButton,
    NInput,
  },
  data() {
    return {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      showAddSWOTDrawer: false,
      newSWOTText: "",
      newSWOTType: 1,
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
    naiveuitest() {
      //@ts-ignore
      window.$message.success("naiveuitest");
    },
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
        .insert([{ text: this.newSWOTText, swot_type_id: this.newSWOTType, project_id: this.store.getCurrentProject.id }])
        .select();
      if (error) {
        window.$message.error(error.message);
        return;
      }
      window.$message.success("Item added successfully");
      this.showAddSWOTDrawer = false;
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
