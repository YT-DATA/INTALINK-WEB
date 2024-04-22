<template>
  <div class="app-container home" :style="'height:'+fullHeight+'px;'">
    <el-row :gutter="20" class="homeTop">
      <el-col :sm="24" :lg="24">
        <el-card class="update-log">
          <div class="titleBody">
            <div class="homeTitle">
              <span class="titleName">
                {{ $t('homePage.sourcesNumber') }}
              </span>
              <span class="titleQuantity">
                {{ sourseTotal }} {{ $t('homePage.number')}}
              </span>
              <span class="titleIcon">
                <svg-icon class-name="shuju-icon" icon-class="shuju"/>
              </span>
            </div>
            <div class="homeTitle">
              <span class="titleName">
                 {{ $t('homePage.systemsNumber') }}
              </span>
              <span class="titleQuantity">
                {{ systemTotal }} {{ $t('homePage.number')}}
              </span>
              <span class="titleIcon">
                <svg-icon class-name="shuju1-icon" icon-class="shuju1"/>

              </span>
            </div>
            <div class="homeTitle">
              <span class="titleName">
               {{ $t('homePage.modelsNumber') }}
              </span>
              <span class="titleQuantity">
                {{ modelTotal }} {{ $t('homePage.number')}}
              </span>
              <span class="titleIcon">
                <svg-icon class-name="shujuyuan-icon" icon-class="shujuyuan"/>

              </span>

            </div>
            <div class="homeTitle">
              <span class="titleName">
                {{ $t('homePage.tablesNumber') }}
              </span>
              <span class="titleQuantity">
                {{ tableTotal }} {{ $t('homePage.number')}}
              </span>
              <span class="titleIcon">
                <svg-icon class-name="shujujicheng-icon" icon-class="shujujicheng"/>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row :gutter="20" :style="'margin-top: 0.8rem;height: '+fullHeight1+'px'">
      <el-col :xs="24" :sm="44">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>{{ $t('homePage.functionDisplayTitle') }}</span>
            </div>
          </template>
          <div class="body">
            <div class="navigationItem">
              <div id="firstJson" class="navigationMenu" @click="toPath('/dataConfiguration/dataSource')">
                <div class="title">
                  {{ $t('homePage.sourceManagement') }}
                </div>
              </div>
              <div id="firstArrow" class="navigationArrow"></div>
            </div>
            <div class="navigationItem">
              <div id="secondJson" class="navigationMenu" @click="toPath('/dataConfiguration/dataModel')">
                <div class="title">
                  {{ $t('homePage.modelManagement') }}
                </div>
              </div>
              <div id="secondArrow" class="navigationArrow"></div>
            </div>
            <div class="navigationItem">
              <div id="thirdJson" class="navigationMenu" @click="toPath('/dataConfiguration/dataSystem')">
                <div class="title">
                  {{ $t('homePage.systemManagement') }}
                </div>
              </div>
              <div class="thirdDiv">
                <div id="thirdArrow" class="navigationArrow1"></div>
                <div id="thirdArrow1" class="navigationArrow2"></div>
              </div>
            </div>
            <div class="navigationItem">
              <div class="fourthDiv">
                <div id="fourthJson" class="navigationMenu1" @click="toPath('/dataConfiguration/dataSystem')"></div>
                <div id="fourthJson1" class="navigationMenu2" @click="toPath('/dataConfiguration/dataSystem')"></div>
              </div>
              <div class="title1">
                {{ $t('homePage.associateSources') }}
              </div>
              <div class="title2">
                {{ $t('homePage.associatedModels') }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="home">
import {onMounted, watch} from 'vue'
import stats from '@/assets/animation/stats.json'
import Arrow from '@/assets/animation/Arrow.json'
import analys from '@/assets/animation/approved-server.json'
import analysis from '@/assets/animation/cloud-data-analysis.json'
import webAnaly from '@/assets/animation/web-analytics.json'
import {jsonAnimation} from '@/utils/common'
import {
  dataModelCount,
  dataTableCount,
  sourceBasicCount,
  systemBasicCount
} from "@/api/configuration/configuration.js";


// 使用 inject 获取 DataNexus 提供的方法
const router = useRouter();
const dataNexus = inject('dataNexus');
const sourseTotal = ref('123')
const systemTotal = ref('30')
const modelTotal = ref('78')
const tableTotal = ref('165')
const fullHeight = ref(document.documentElement.clientHeight - 105)
const fullHeight1 = ref(document.documentElement.clientHeight - 310)

const toPath = (val) => {
  router.push(val)
}

onMounted(() => {

  getSourceBasicCount()
  getSystemBasicCount()
  getDataModelCount()
  getDataTableCount()
  const baseSize = 16 //跟postcss.config.js中rootValue的值是一致的
  // 设置 rem 函数
  function setRem() {
    const scale = document.documentElement.clientWidth / 1920
    // console.log('重置根节点字体');
    // 设置页面根节点字体大小 最高为两倍图 即设计稿为750
    document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
  }

  // 初始化
  setRem()
  // 改变窗口大小时重新设置 rem
  window.onresize = function () {
    setRem()
  }


  jsonAnimation('#firstJson', analysis)
  jsonAnimation('#firstArrow', Arrow)
  jsonAnimation('#secondJson', analys)
  jsonAnimation('#secondArrow', Arrow)
  jsonAnimation('#thirdJson', webAnaly)
  jsonAnimation('#thirdArrow', Arrow)
  jsonAnimation('#thirdArrow1', Arrow)
  jsonAnimation('#fourthJson', stats)
  jsonAnimation('#fourthJson1', stats)
  dataNexus.subscribeToDataChange('home', 'sourseTotal', sourseTotalUpdated);
  dataNexus.subscribeToDataChange('home', 'systemTotal', systemTotalUpdated);
  dataNexus.subscribeToDataChange('home', 'modelTotal', modelTotalUpdated);
  dataNexus.subscribeToDataChange('home', 'tableTotal', tableTotalUpdated);

})

const sourseTotalUpdated = (newValue) => {
  console.log(newValue);
}
const systemTotalUpdated = (newValue) => {
  console.log(newValue);
}
const modelTotalUpdated = (newValue) => {
  console.log(newValue);
}
const tableTotalUpdated = (newValue) => {
  console.log(newValue);
}

function goTarget(url) {
  window.open(url, '__blank')
}

function getSourceBasicCount() {
  sourceBasicCount().then(res => {
    sourseTotal.value = res.data
  })
}

function getSystemBasicCount() {
  systemBasicCount().then(res => {
    systemTotal.value = res.data
  })
}

function getDataModelCount() {
  dataModelCount().then(res => {
    modelTotal.value = res.data
  })
}

function getDataTableCount() {
  dataTableCount().then(res => {
    tableTotal.value = res.data
  })
}
</script>

<style scoped lang="scss">
.home {
  hr {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 1.25rem;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 0.625rem;
    font-size: 1.625rem;
    font-weight: 100;
  }

  p {
    margin-top: 0.625rem;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 2.5rem;
    }
  }

}

.homeTop {
  height: 11.875rem;
}

.body {
  display: flex;
  justify-content: space-between;
}

.navigationItem {
  width: 25%;
  position: relative;
  font-size: 1.5rem;
  color: #5a5a5a;
  font-family: "Deng Xian";
  text-align: center;

  .title {
    position: absolute;
    bottom: 10%;
    width: 80%;
  }

  .title1 {
    position: absolute;
    top: 38%;
    width: 100%;

  }

  .title2 {
    position: absolute;
    bottom: -20%;
    width: 100%;

  }


  .navigationMenu {
    position: relative;
    cursor: pointer;
    width: 68%;
    float: left;
    height: 100%;

  }

  .navigationMenu1 {
    cursor: pointer;
    height: 50%;
    width: 100%;
    position: absolute;
    top: -15%;
    left: 0;
  }

  .navigationMenu2 {
    cursor: pointer;
    height: 50%;
    width: 100%;
    position: absolute;
    bottom: -10%;
    left: 0;
  }

  .navigationArrow {
    width: 29%;
    float: left;
    height: 100%;
  }

  .thirdDiv {
    float: left;
    width: 29%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 27%;
  }

  .fourthDiv {
    float: left;
    height: 100%;

  }

  .navigationArrow1 {
    height: 30%;
    transform: rotate(-14deg);
  }

  .navigationArrow2 {
    height: 30%;
    transform: rotate(14deg);
  }
}


.home {
  padding: 0;


  ::v-deep .el-card__header {
    border-bottom: 0;
    font-weight: 700;
  }

  .titleBody {
    display: flex;
    justify-content: space-around;
  }

  .homeTitle {
    width: 23%;
    height: 7.2em;
    border-radius: 2px;
    font-size: 1.125rem;
    letter-spacing: 0;
    line-height: 3.75rem;
    color: #ffffff;
    font-family: "Deng Xian";
    text-align: center;
    background-image: linear-gradient(-180deg, #81afed 0%, #5280ee 100%);
    position: relative;

    .titleName {
      display: block;
      width: 15rem;
      height: 2.5rem;
      margin-left: 1rem;
      text-align: left;
    }

    .titleQuantity {
      display: block;
      width: 7.5rem;
      height: 3.125rem;
      margin-left: 1rem;
      text-align: left;
    }

    .titleIcon {
      position: absolute;
      top: 1.5625rem;
      right: 0px;
      font-size: 3.625rem;
      display: block;
      width: 7.5rem;
      height: 3.125rem;

    }
  }


  ::v-deep .el-card {
    height: 100%;

    .el-card__body {
      height: 100%;
      padding: 30px 10px 30px 10px !important;

      .body {
        height: 75%;
      }
    }
  }

}

// /* 当屏幕宽度大于等于2200px时 */
@media screen and (min-width: 2200px) {
  .navigationItem {
    .title {
      bottom: 1%;
    }

    .title1 {
      top: 38%;
    }

    .title2 {
      bottom: -22%;
    }
  }

}

// /* 当屏幕宽度小于等于1750px时 */
@media screen and (max-width: 1750px) {
  .homeTop {
    height: 13.8rem
  }
  .home {
    ::v-deep .el-card {
      .el-card__body {
        padding: 35px 10px 35px 10px !important;
      }
    }
  }
}

// /* 当屏幕宽度小于等于1350px时 */
@media screen and (max-width: 1350px) {
  .homeTop {
    height: 15.8rem
  }
  .home {
    ::v-deep .el-card {
      .el-card__body {
        padding: 40px 10px 40px 10px !important;
      }
    }
  }
}
</style>

