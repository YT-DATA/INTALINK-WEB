<template>
  <div class="dataExploration">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-button type="primary" icon="ChromeFilled" :disabled="disabled" @click="analysisStart">{{ $t('btn.start_exploration') }}</el-button>
        <!-- <el-button type="danger" icon="ChromeFilled" :disabled="!disabled" @click="disconnectWebSocket">{{ $t('btn.Deactivate') }}</el-button> -->
      </el-form-item>
    </el-form>
      <div class="taskScheduling-log-dialog">
        <el-input id="rizhi" type="textarea" v-model="log" disabled :style="'height: '+fullHeight1+'px'" :autosize="{ minRows: 15}"></el-input>
      </div>
    <!-- 添加或修改方案名称对话框 -->
    <!-- <el-dialog title="数据关系探查日志" v-model="open" width="500px">
      
    </el-dialog> -->
  </div>
</template>

<script setup name="scorePlanManage">
import {inject, reactive, onMounted, computed} from 'vue';
import {relationshipAnalysisStart, getRelationshipAnalysisStatus} from "@/api/relationship/relationship.js";

const {proxy} = getCurrentInstance();
const queryParams = reactive({});
// const open = ref(false)
const fullHeight1 = ref(document.documentElement.clientHeight - 310)
const disabled = ref(true)
const log = ref('')
const socket = ref(null);
const heartbeatTimer = ref(null)
    let text = window.location.host;
    text = "ws://" + text
    //线上
    // const url = text + '/websocket/log';
    //兰本地
    // const url = 'ws://localhost:8888/websocket/log';
    //何本地
    const url = 'ws://175.47.100.175:9207/websocket/log';
    console.log(url,'url')

    //启动websocket
    const handleQuery = () => {
      // open.value = true
      disabled.value = true
      socket.value = new WebSocket(url);
 
      socket.value.onopen = () => {
        console.log('WebSocket已连接');
        socket.value.send('PING');
        // 设置定时器，每隔 heartbeatInterval 毫秒发送一次心跳消息
        // heartbeatTimer.value = setInterval(() => {
        //   socket.value.send('PING');
        // }, 3000);
        socket.value.isConnected = true;
      };
 
      socket.value.onerror = (error) => {
        console.error('报错:', error);
      };
 
      socket.value.onmessage = (message) => {
        // console.log('新消息:', message.data);
        log.value = message.data+'\n'+log.value
        // scrollToBottom('rizhi')
      };
 
      socket.value.onclose = () => {
        console.log('连接关闭');
        // 清除定时器
        clearInterval(heartbeatTimer.value);
        socket.value.isConnected = false;
      };
    };

    //手动发送消息
    const sendMessage = () => {
      if (socket.value.isConnected) {
        socket.value.send('Your message here');
      }
    };
 
    const disconnectWebSocket = () => {
      console.log('停止');
      if (socket.value.isConnected) {
        socket.value.close();
      }
      // open.value = false
      disabled.value = false
    };


    const scrollToBottom = (id)=> {
        var textarea = document.getElementById(id);
        textarea.scrollTop = textarea.scrollHeight;
        console.log(textarea.scrollTop,'textarea.scrollTop');
        console.log(textarea.scrollHeight,'textarea.scrollHeight');
    }

    //获取探查状态
    const getStatus = ()=>{
      
      getRelationshipAnalysisStatus().then(response => {
        console.log(response,'response');
        if (response.msg === '1') {
          disabled.value = true
          handleQuery()
        } else if (response.msg === '0') {
          disabled.value = false
          
        } else {
          
        }
      });
    } 

    //开始探查
    const analysisStart = ()=>{
      
      relationshipAnalysisStart().then(response => {
        console.log(response,'response1');
        handleQuery()
      });
    } 

    onMounted(() => {
      getStatus()
      // handleQuery()
    })

</script>


<style lang="scss" scoped>
.taskScheduling-log-page {
  padding: 10px;
}

.taskScheduling-log-dialog {
  padding: 10px 20px 30px;
}
.dataExploration .el-form {
  padding: 20px;
}
:deep .el-textarea.is-disabled .el-textarea__inner {
  background-color: #ffff;
  color: #000;
  height: 100% !important;
}
</style>
