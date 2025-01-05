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
      </RelationGraph>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import RelationGraph from 'relation-graph/vue3';

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
  backgroundColor: 'transpanret',
  layouts: [
    {
      label: '自动布局',
      layoutName: 'force',
      layoutClassName: 'seeks-layout-force'
    }
  ],
  defaultJunctionPoint: 'border',
});

// 生命周期钩子
onMounted(() => {
  showGraph();
});
onBeforeUnmount(() => {
  console.log('beforeDestroy stop layout');
  graphRef.value.getInstance().stopAutoLayout();
});

// 展示图谱的方法
const showGraph = () => {
  const __graph_json_data = {
    'rootId': 'a',
    'nodes': [
      {'id': 'a', 'text': 'a'},
      {'id': 'b', 'text': 'b'},
      {'id': 'b1', 'text': 'b1'},
      {'id': 'b1-1', 'text': 'b1-1'},
      {'id': 'b1-2', 'text': 'b1-2'},
      {'id': 'b1-3', 'text': 'b1-3'},
      {'id': 'b1-4', 'text': 'b1-4'},
      {'id': 'b1-5', 'text': 'b1-5'},
      {'id': 'b1-6', 'text': 'b1-6'},
      {'id': 'b2', 'text': 'b2'},
      {'id': 'b2-1', 'text': 'b2-1'},
      {'id': 'b2-2', 'text': 'b2-2'},
      {'id': 'b2-3', 'text': 'b2-3'},
      {'id': 'b2-4', 'text': 'b2-4'},
      {'id': 'b3', 'text': 'b3'},
      {'id': 'b3-1', 'text': 'b3-1'},
      {'id': 'b3-2', 'text': 'b3-2'},
      {'id': 'b3-3', 'text': 'b3-3'},
      {'id': 'b3-4', 'text': 'b3-4'},
      {'id': 'b3-5', 'text': 'b3-5'},
      {'id': 'b3-6', 'text': 'b3-6'},
      {'id': 'b3-7', 'text': 'b3-7'},
      {'id': 'b4', 'text': 'b4'},
      {'id': 'b4-1', 'text': 'b4-1'},
      {'id': 'b4-2', 'text': 'b4-2'},
      {'id': 'b4-3', 'text': 'b4-3'},
      {'id': 'b4-4', 'text': 'b4-4'},
      {'id': 'b4-5', 'text': 'b4-5'},
      {'id': 'b4-6', 'text': 'b4-6'},
      {'id': 'b4-7', 'text': 'b4-7'},
      {'id': 'b4-8', 'text': 'b4-8'},
      {'id': 'b4-9', 'text': 'b4-9'},
      {'id': 'b5', 'text': 'b5'},
      {'id': 'b5-1', 'text': 'b5-1'},
      {'id': 'b5-2', 'text': 'b5-2'},
      {'id': 'b5-3', 'text': 'b5-3'},
      {'id': 'b5-4', 'text': 'b5-4'},
      {'id': 'b6', 'text': 'b6'},
      {'id': 'b6-1', 'text': 'b6-1'},
      {'id': 'b6-2', 'text': 'b6-2'},
      {'id': 'b6-3', 'text': 'b6-3'},
      {'id': 'b6-4', 'text': 'b6-4'},
      {'id': 'b6-5', 'text': 'b6-5'},
      {'id': 'c', 'text': 'c'},
      {'id': 'c1', 'text': 'c1'},
      {'id': 'c1-1', 'text': 'c1-1'},
      {'id': 'c1-2', 'text': 'c1-2'},
      {'id': 'c1-3', 'text': 'c1-3'},
      {'id': 'c1-4', 'text': 'c1-4'},
      {'id': 'c1-5', 'text': 'c1-5'},
      {'id': 'c1-6', 'text': 'c1-6'},
      {'id': 'c1-7', 'text': 'c1-7'},
      {'id': 'c2', 'text': 'c2'},
      {'id': 'c2-1', 'text': 'c2-1'},
      {'id': 'c2-2', 'text': 'c2-2'},
      {'id': 'c3', 'text': 'c3'},
      {'id': 'c3-1', 'text': 'c3-1'},
      {'id': 'c3-2', 'text': 'c3-2'},
      {'id': 'c3-3', 'text': 'c3-3'},
      {'id': 'd', 'text': 'd'},
      {'id': 'd1', 'text': 'd1'},
      {'id': 'd1-1', 'text': 'd1-1'},
      {'id': 'd1-2', 'text': 'd1-2'},
      {'id': 'd1-3', 'text': 'd1-3'},
      {'id': 'd1-4', 'text': 'd1-4'},
      {'id': 'd1-5', 'text': 'd1-5'},
      {'id': 'd1-6', 'text': 'd1-6'},
      {'id': 'd1-7', 'text': 'd1-7'},
      {'id': 'd1-8', 'text': 'd1-8'},
      {'id': 'd2', 'text': 'd2'},
      {'id': 'd2-1', 'text': 'd2-1'},
      {'id': 'd2-2', 'text': 'd2-2'},
      {'id': 'd3', 'text': 'd3'},
      {'id': 'd3-1', 'text': 'd3-1'},
      {'id': 'd3-2', 'text': 'd3-2'},
      {'id': 'd3-3', 'text': 'd3-3'},
      {'id': 'd3-4', 'text': 'd3-4'},
      {'id': 'd3-5', 'text': 'd3-5'},
      {'id': 'd4', 'text': 'd4'},
      {'id': 'd4-1', 'text': 'd4-1'},
      {'id': 'd4-2', 'text': 'd4-2'},
      {'id': 'd4-3', 'text': 'd4-3'},
      {'id': 'd4-4', 'text': 'd4-4'},
      {'id': 'd4-5', 'text': 'd4-5'},
      {'id': 'd4-6', 'text': 'd4-6'},
      {'id': 'e', 'text': 'e'},
      {'id': 'e1', 'text': 'e1'},
      {'id': 'e1-1', 'text': 'e1-1'},
      {'id': 'e1-2', 'text': 'e1-2'},
      {'id': 'e1-3', 'text': 'e1-3'},
      {'id': 'e1-4', 'text': 'e1-4'},
      {'id': 'e1-5', 'text': 'e1-5'},
      {'id': 'e1-6', 'text': 'e1-6'},
      {'id': 'e2', 'text': 'e2'},
      {'id': 'e2-1', 'text': 'e2-1'},
      {'id': 'e2-2', 'text': 'e2-2'},
      {'id': 'e2-3', 'text': 'e2-3'},
      {'id': 'e2-4', 'text': 'e2-4'},
      {'id': 'e2-5', 'text': 'e2-5'},
      {'id': 'e2-6', 'text': 'e2-6'},
      {'id': 'e2-7', 'text': 'e2-7'},
      {'id': 'e2-8', 'text': 'e2-8'},
      {'id': 'e2-9', 'text': 'e2-9'}
    ],
    'lines': [
      {'from': 'a', 'to': 'b'},
      {'from': 'b', 'to': 'b1'},
      {'from': 'b1', 'to': 'b1-1'},
      {'from': 'b1', 'to': 'b1-2'},
      {'from': 'b1', 'to': 'b1-3'},
      {'from': 'b1', 'to': 'b1-4'},
      {'from': 'b1', 'to': 'b1-5'},
      {'from': 'b1', 'to': 'b1-6'},
      {'from': 'b', 'to': 'b2'},
      {'from': 'b2', 'to': 'b2-1'},
      {'from': 'b2', 'to': 'b2-2'},
      {'from': 'b2', 'to': 'b2-3'},
      {'from': 'b2', 'to': 'b2-4'},
      {'from': 'b', 'to': 'b3'},
      {'from': 'b3', 'to': 'b3-1'},
      {'from': 'b3', 'to': 'b3-2'},
      {'from': 'b3', 'to': 'b3-3'},
      {'from': 'b3', 'to': 'b3-4'},
      {'from': 'b3', 'to': 'b3-5'},
      {'from': 'b3', 'to': 'b3-6'},
      {'from': 'b3', 'to': 'b3-7'},
      {'from': 'b', 'to': 'b4'},
      {'from': 'b4', 'to': 'b4-1'},
      {'from': 'b4', 'to': 'b4-2'},
      {'from': 'b4', 'to': 'b4-3'},
      {'from': 'b4', 'to': 'b4-4'},
      {'from': 'b4', 'to': 'b4-5'},
      {'from': 'b4', 'to': 'b4-6'},
      {'from': 'b4', 'to': 'b4-7'},
      {'from': 'b4', 'to': 'b4-8'},
      {'from': 'b4', 'to': 'b4-9'},
      {'from': 'b', 'to': 'b5'},
      {'from': 'b5', 'to': 'b5-1'},
      {'from': 'b5', 'to': 'b5-2'},
      {'from': 'b5', 'to': 'b5-3'},
      {'from': 'b5', 'to': 'b5-4'},
      {'from': 'b', 'to': 'b6'},
      {'from': 'b6', 'to': 'b6-1'},
      {'from': 'b6', 'to': 'b6-2'},
      {'from': 'b6', 'to': 'b6-3'},
      {'from': 'b6', 'to': 'b6-4'},
      {'from': 'b6', 'to': 'b6-5'},
      {'from': 'c', 'to': 'c1'},
      {'from': 'c1', 'to': 'c1-1'},
      {'from': 'c1', 'to': 'c1-2'},
      {'from': 'c1', 'to': 'c1-3'},
      {'from': 'c1', 'to': 'c1-4'},
      {'from': 'c1', 'to': 'c1-5'},
      {'from': 'c1', 'to': 'c1-6'},
      {'from': 'c1', 'to': 'c1-7'},
      {'from': 'c', 'to': 'c2'},
      {'from': 'c2', 'to': 'c2-1'},
      {'from': 'c2', 'to': 'c2-2'},
      {'from': 'c', 'to': 'c3'},
      {'from': 'c3', 'to': 'c3-1'},
      {'from': 'c3', 'to': 'c3-2'},
      {'from': 'c3', 'to': 'c3-3'},
      {'from': 'd', 'to': 'd1'},
      {'from': 'd1', 'to': 'd1-1'},
      {'from': 'd1', 'to': 'd1-2'},
      {'from': 'd1', 'to': 'd1-3'},
      {'from': 'd1', 'to': 'd1-4'},
      {'from': 'd1', 'to': 'd1-5'},
      {'from': 'd1', 'to': 'd1-6'},
      {'from': 'd1', 'to': 'd1-7'},
      {'from': 'd1', 'to': 'd1-8'},
      {'from': 'd', 'to': 'd2'},
      {'from': 'd2', 'to': 'd2-1'},
      {'from': 'd2', 'to': 'd2-2'},
      {'from': 'd', 'to': 'd3'},
      {'from': 'd3', 'to': 'd3-1'},
      {'from': 'd3', 'to': 'd3-2'},
      {'from': 'd3', 'to': 'd3-3'},
      {'from': 'd3', 'to': 'd3-4'},
      {'from': 'd3', 'to': 'd3-5'},
      {'from': 'd', 'to': 'd4'},
      {'from': 'd4', 'to': 'd4-1'},
      {'from': 'd4', 'to': 'd4-2'},
      {'from': 'd4', 'to': 'd4-3'},
      {'from': 'd4', 'to': 'd4-4'},
      {'from': 'd4', 'to': 'd4-5'},
      {'from': 'd4', 'to': 'd4-6'},
      {'from': 'a', 'to': 'e'},
      {'from': 'e', 'to': 'e1'},
      {'from': 'e1', 'to': 'e1-1'},
      {'from': 'e1', 'to': 'e1-2'},
      {'from': 'e1', 'to': 'e1-3'},
      {'from': 'e1', 'to': 'e1-4'},
      {'from': 'e1', 'to': 'e1-5'},
      {'from': 'e1', 'to': 'e1-6'},
      {'from': 'e', 'to': 'e2'},
      {'from': 'e2', 'to': 'e2-1'},
      {'from': 'e2', 'to': 'e2-2'},
      {'from': 'e2', 'to': 'e2-3'},
      {'from': 'e2', 'to': 'e2-4'},
      {'from': 'e2', 'to': 'e2-5'},
      {'from': 'e2', 'to': 'e2-6'},
      {'from': 'e2', 'to': 'e2-7'},
      {'from': 'e2', 'to': 'e2-8'},
      {'from': 'e2', 'to': 'e2-9'}
    ]
  };
  graphRef.value.setJsonData(__graph_json_data, (graphInstance) => {
    // 这些写上当图谱初始化完成后需要执行的代码
  });
};

// 节点点击事件处理方法
const onNodeClick = (nodeObject, $event) => {
  console.log('onNodeClick:', nodeObject);
  const allChildIds = ['e', 'a', 'b', 'b4', 'b4-3', 'e1', 'e1-6'];
  console.log(allChildIds, 'allChildIds');
  const graphInstance = graphRef.value.getInstance();
  if (graphInstance) {
    const nodes = graphInstance.getNodes();
    for (const node of nodes) {
      if (allChildIds.includes(node.id)) {
        node.opacity = 1;
        node.color = 'rgb(116,2,173)';
      } else {
        node.opacity = 0.1;
        node.color = undefined;
      }
    }
    const links = graphInstance.getLinks();
    for (const link of links) {
      if (allChildIds.includes(link.fromNode.id) && allChildIds.includes(link.toNode.id)) {
        link.relations.forEach(line => {
          line.color = 'rgb(116,2,173)';
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
  //background: linear-gradient(to right, #2c3e50, #34495e);
  //background: linear-gradient(to right, #ff9a8b, #ff6a88);
  //background: linear-gradient(to right, #00bcd4, #2196f3);
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
