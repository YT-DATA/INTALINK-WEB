<template>
  <div>
    <div ref="myPage" class="my-graph" style="height:calc(100vh);">
      <RelationGraph
          ref="graphRef"
          style="background: none"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-line-click="onLineClick"
          :on-canvas-click="onCanvasClick"
      >
        <!--        <template #graph-plug>-->
        <!--          <div style="position:absolute;z-index:700;left:20px;top:20px;height:70px;padding: 20px;border: #efefef solid 1px;color: #555555;border-radius: 10px;background-color: rgba(255,255,255,0.79);font-size: 12px;">-->
        <!--            <div>-->
        <!--              此示例展示如何获取节点的子节点和孙子节点们。请点击一个非叶子节点。-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              This example shows how to get the children and grandchildren of a node. Please click on a non-leaf node.-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </template>-->
        <template #graph-plug>
          <div style="position:absolute;z-index:700;left:20px;top:20px;height:50px;padding-top:6px;padding-left: 30px;padding-right:30px;border: #efefef solid 1px;color: #555555;border-radius: 10px;background-color: rgba(255,255,255,0.79);font-size: 12px;">
            <div style="">
              <el-form :model="queryParams" ref="queryRef" :inline="true">
                <el-form-item :label="$t('columnManagement.Belonging_model')" prop="dataModelId">
                  <el-select
                      v-model="queryParams.dataModelId"
                      :placeholder="$t('columnManagement.Belonging_model_Tip')"
                      :teleported="false"
                      @change="handleModelValueChange"
                      clearable
                  >
                    <el-option
                        v-for="item in optionsModel"
                        :key="item.dataModelId"
                        :label="item.dataModelName"
                        :value="item.dataModelId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('columnManagement.Data_table')" prop="dataTableId">
                  <el-select
                      v-model="queryParams.dataTableId"
                      :placeholder="$t('columnManagement.Data_table_Tip')"
                      @change="handleTableValueChange"
                      clearable
                      :teleported="false"
                  >
                    <el-option
                        v-for="item in optionsTable"
                        :key="item.dataTableId"
                        :label="item.dataTableName"
                        :value="item.dataTableId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('columnManagement.Data_Item_Name')" prop="dataColumnName">
                  <el-input
                      v-model="queryParams.dataColumnName"
                      :placeholder="$t('columnManagement.Data_Item_Name_Tip')"
                      clearable
                      style="width: 200px"
                      @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-form>

            </div>
          </div>
        </template>
      </RelationGraph>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, onBeforeUnmount, reactive} from 'vue';
import RelationGraph from 'relation-graph/vue3';
import {
  dataModelSelectAll,
  selectAllByModelId
} from "@/api/configuration/configuration.js";
// 使用 ref 来声明 graphRef，初始值设为 null，用于后续获取组件实例引用
const graphRef = ref(null);
// 响应式数据声明
const isShowCodePanel = ref(false);
const graphOptions = ref({
  debug: false,
  defaultNodeBorderWidth: 0,
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
  defaultLineShape: 1,
  backgroundColor: '#00001a', // 深蓝色，类似星空背景
  // defaultLineColor: '#9999FF', // 淡紫色，与星空背景搭配协调
  defaultNodeColor: '#87CEFA',
  // defaultNodeColor: 'rgba(238, 178, 94, 1)',
  // 连线颜色配置，采用淡蓝色，与节点颜色相呼应，呈现科技感
  defaultLineColor: '#7a99af',
  layouts: [
    {
      label: '自动布局',
      layoutName: 'force',
      layoutClassName: 'seeks-layout-force'
    }
  ],
  defaultJunctionPoint: 'border',
});
const queryParams = reactive({
  dataColumnName: undefined,
  dataModelId: undefined,
  dataTableId: undefined,
});
const optionsModel = ref([]) //模型下拉选
const optionsTable = ref([]) //表下拉选
// 生命周期钩子
onMounted(() => {
  showGraph();
  ModelSelectAll();
});
onBeforeUnmount(() => {
  console.log('beforeDestroy stop layout');
  graphRef.value.getInstance().stopAutoLayout();
});

// 展示图谱的方法
const showGraph = () => {
  const __graph_json_data = {
    'nodes': [
      {'id': 'a', 'text': 'a'},
      {'id': 'b', 'text': 'b'},
      {'id': 'b1', 'text': 'b1'},
      {'id': 'b1-1', 'text': 'b1-1'},
      {'id': 'b2', 'text': 'b2'},
      {'id': 'b2-1', 'text': 'b2-1'},
      {'id': 'b3', 'text': 'b3'},
      {'id': 'b3-1', 'text': 'b3-1'},
      {'id': 'b4', 'text': 'b4'},
      {'id': 'b4-1', 'text': 'b4-1'},
      {'id': 'b4-2', 'text': 'b4-2'},
      {'id': 'b4-3', 'text': 'b4-3'},
      {'id': 'b5', 'text': 'b5'},
      {'id': 'b5-1', 'text': 'b5-1'},
      {'id': 'b6', 'text': 'b6'},
      {'id': 'b6-1', 'text': 'b6-1'},
      {'id': 'e', 'text': 'e'},
      {'id': 'e1', 'text': 'e1'},
      {'id': 'e1-1', 'text': 'e1-1'},
    ],
    'lines': [
      {'from': 'a', 'to': 'b'},
      {'from': 'b', 'to': 'b1'},
      {'from': 'b1', 'to': 'b1-1'},
      {'from': 'b', 'to': 'b2'},
      {'from': 'b', 'to': 'b3'},
      {'from': 'b3', 'to': 'b3-1'},
      {'from': 'b', 'to': 'b4'},
      {'from': 'b4', 'to': 'b4-1'},
      {'from': 'b4', 'to': 'b4-2'},
      {'from': 'b4', 'to': 'b4-3'},
      {'from': 'b', 'to': 'b5'},
      {'from': 'b5', 'to': 'b5-1'},
      {'from': 'b', 'to': 'b6'},
      {'from': 'b6', 'to': 'b6-1'},
      {'from': 'a', 'to': 'e'},
      {'from': 'e', 'to': 'e1'},
      {'from': 'e1', 'to': 'e1-1'},
    ]
  };
  graphRef.value.setJsonData(__graph_json_data, (graphInstance) => {
    // 这些写上当图谱初始化完成后需要执行的代码
  });

};

// 节点点击事件处理方法
const onNodeClick = (nodeObject, $event) => {
  console.log('onNodeClick:', nodeObject);
  const allChildIds = ['e', 'a', 'b', 'b1',  'e1'];
  console.log(allChildIds, 'allChildIds');
  const graphInstance = graphRef.value.getInstance();
  if (graphInstance) {
    const nodes = graphInstance.getNodes();

    for (const node of nodes) {
      if (allChildIds.includes(node.id)) {
        node.opacity = 1;
        node.color = 'rgb(30 115 237)';
      } else {
        node.opacity = 0.1;
        node.color = undefined;
      }
    }
    const links = graphInstance.getLinks();
    for (const link of links) {
      if (allChildIds.includes(link.fromNode.id) && allChildIds.includes(link.toNode.id)) {
        link.relations.forEach(line => {
          line.color = 'rgb(30 115 237)';
        });
      } else {
        link.relations.forEach(line => {
          line.color = '';
        });
      }
    }
  }
};
//查询某个节点
const handleQuery = async () => {
  console.log(queryParams);
  const allChildIds = ['e', 'a', 'b', 'b1',  'e1'];
  const graphInstance = graphRef.value.getInstance();
  if (graphInstance) {
    const searchResults = [];
    const nodes = graphInstance.getNodes();
    for (const node of nodes) {
      if (allChildIds.includes(node.id)) {
        node.opacity = 1;
        node.color = 'rgb(30 115 237)';
      } else {
        node.opacity = 0.1;
        node.color = undefined;
      }
    }
    const links = graphInstance.getLinks();
    for (const link of links) {
      if (allChildIds.includes(link.fromNode.id) && allChildIds.includes(link.toNode.id)) {
        link.relations.forEach(line => {
          line.color = 'rgb(30 115 237)';
        });
      } else {
        link.relations.forEach(line => {
          line.color = '';
        });
      }
    }
  }
};

// 获取所有子节点ID的方法（原 deepGeAlltChildIds）
const deepGeAlltChildIds = (node, ids = []) => {
  if (ids.includes(node.id)) return ids;
  ids.push(node.id);
  if (node.lot && node.lot.childs) {
    for (const cNode of node.lot.childs) {
      ids = deepGeAlltChildIds(cNode, ids);
    }
  }
  return ids;
};

// 画布点击事件处理方法（原 onCanvasClick）
const onCanvasClick = ($event) => {
  console.log('onCanvasClick:');
  const graphInstance = graphRef.value.getInstance();
  if (graphInstance) {
    const nodes = graphInstance.getNodes();
    for (const node of nodes) {
      node.opacity = 1;
      node.color = undefined;
    }
    const links = graphInstance.getLinks();
    for (const link of links) {
      link.relations.forEach(line => {
        line.color = undefined;
      });
    }
  }
};

// 连线点击事件处理方法（原 onLineClick）
const onLineClick = (lineObject, linkObject, $event) => {
  console.log('onLineClick:', lineObject);
};

/** 查询所有模型列表 */
function ModelSelectAll() {
  dataModelSelectAll().then(response => {
    optionsModel.value = response.data;

  });
}
//选择模型
const handleModelValueChange = (newValue) => {
  if (newValue) {
    queryParams.dataTableId=undefined
    queryParams.dataColumnName=undefined
    optionsTable.value=[]
    ModelIdSelectAll(newValue)
  }
};
/** 根据id查询数据表下拉列表 */
function ModelIdSelectAll(ModelId) {
  selectAllByModelId(ModelId).then(response => {
    optionsTable.value = response.data;

  });
}
</script>
<style>
.relation-graph .rel-map {
  background: none !important;
}
</style>

<style lang="scss" scoped>
.relation-graph .rel-map {
  ////background: none !important;
  //background: linear-gradient(to right, rgb(16, 185, 129), rgb(101, 163, 13));
}

::v-deep .rel-map {

  .rel-node-shape-1 {
  }

  .c-round {
    display: flex;
    place-items: center;
    justify-content: center;
  }
}

::v-deep .rel-toolbar {
  color: #ffffff;

  .c-current-zoom {
    color: #ffffff;
  }
}

.my-graph {
  background: linear-gradient(to right, rgb(16, 185, 129), rgb(101, 163, 13));
  //background: linear-gradient(to right, #add8e6, #ffffff);
  //background: linear-gradient(to right, #f8bbd0, #e1bee7);
  background: linear-gradient(to right, #2c3e50, #34495e);
  //background: linear-gradient(to right, #ff9a8b, #ff6a88);
  //background: linear-gradient(to right, #00bcd4, #2196f3);
  background: linear-gradient(to right, #000000, #1a1a1a);
  background: linear-gradient(to right, #000000, #333333);
  //background: linear-gradient(to right, #00001a, #17174b);
  background: linear-gradient(to right, #3ca3e3, rgb(140, 95, 231));
}

::v-deep .relation-graph {
  .my-line-highlightxxxxxxxxxxxxxxx {
    animation: my-line-easy-anm1 2s linear infinite;
  }

  .rg-line-anm-1 {
    animation: my-line-easy-anm1 2s linear infinite;
  }

  //取消点击线条后节点的闪烁效果
  rel-node-flashing {
    animation: none;
  }
}

@keyframes my-line-easy-anm1 {
  0% {
    stroke-dashoffset: 100px;
    stroke-dasharray: 5, 5, 5;
  }
  100% {
    stroke-dasharray: 5, 5, 5;
    stroke-dashoffset: 3px;
  }
}
</style>

<style scoped lang="scss">
.my-line-style-1 .c-rg-line-checked {
  animation: my-line-anm1 1s infinite;
}

.my-line-style-2 .c-rg-line-checked {
  animation: my-line-anm2 1s infinite;
}

.my-line-style-3 .c-rg-line-checked {
  animation: my-line-anm3 1s infinite;
}

.my-line-style-4 .c-rg-line-checked {
  animation: my-line-anm4 1s infinite;
}

@keyframes my-line-anm1 {
  0% {
    stroke-dashoffset: 352px;
    stroke-dasharray: 5, 5, 5;
  }
  50% {
    stroke-dasharray: 5, 5, 5;
    stroke-dashoffset: 3px;
  }
  100% {
    stroke-dashoffset: 352px;
    stroke-dasharray: 5, 5, 5;
  }
}

@keyframes my-line-anm2 {
  from {
    stroke-dashoffset: 0;
    stroke-dasharray: 4, 4, 4;
  }
  to {
    stroke-dashoffset: 10px;
    stroke-dasharray: 20, 20, 20;
  }
}

@keyframes my-line-anm3 {
  0% {
    stroke-opacity: 1;
  }
  50% {
    stroke-opacity: 0.2;
  }
  100% {
    stroke-opacity: 1;
  }
}

@keyframes my-line-anm4 {
  0% {
    stroke-dasharray: 0, 100%;
  }
  100% {
    stroke-dasharray: 100%, 0;
  }
}
</style>
