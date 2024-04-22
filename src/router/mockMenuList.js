/*
* mock data
* 配置系统路由信息
* */

const mockMenuList = [
  {
    "name": "DataConfiguration",
    "path": "/dataConfiguration",
    "hidden": false,
    "redirect": "noRedirect",
    "component": {
      "__name": "index", "__hmrId": "051739fd", "__scopeId": "data-v-051739fd", "__file": ""
    },
    "alwaysShow": true,
    "meta": {"title": "数据管理", "icon": "date-range", "noCache": false, "link": null},
    "children": [
      {
        "name": "DataSource",
        "path": "dataSource",
        "hidden": false,
        "meta": {"title": "数据源管理", "icon": "cascader", "noCache": false, "link": null}
      },
      {
        "name": "DataModel",
        "path": "dataModel",
        "hidden": false,
        "meta": {"title": "数据模型管理", "icon": "tree", "noCache": false, "link": null}
      },
      {
        "name": "DataTable",
        "path": "dataTable",
        "hidden": false,
        "meta": {"title": "数据表管理", "icon": "date-range", "noCache": false, "link": null}
      },
      {
        "name": "DataColumn",
        "path": "dataColumn",
        "hidden": false,
        "meta": {"title": "数据项管理", "icon": "dict", "noCache": false, "link": null}
      },
      {
        "name": "DataSystem",
        "path": "dataSystem",
        "hidden": false,
        "meta": {"title": "系统管理", "icon": "system", "noCache": false, "link": null}
      }
    ]
  },
  {
    "name": "DataRelationship",
    "path": "/dataRelationship",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": {
      "title": "数据关系管理",
      "icon": "swagger",
      "noCache": false,
      "link": null
    },
    "children": [
      {
        "name": "DataRelationEntry",
        "path": "dataRelationEntry",
        "hidden": false,
        "component": "dataRelationship/dataRelationEntry/index",
        "meta": {
          "title": "数据关系录入",
          "icon": "documentation",
          "noCache": false,
          "link": null
        }
      },
      {
        "name": "ScoreMethodManage",
        "path": "scoreMethodManage",
        "hidden": false,
        "component": "dataRelationship/scoreMethodManage/index",
        "meta": {
          "title": "评分方法管理",
          "icon": "table",
          "noCache": false,
          "link": null
        }
      },
      {
        "name": "ScorePlanManage",
        "path": "scorePlanManage",
        "hidden": false,
        "component": "dataRelationship/scorePlanManage/index",
        "meta": {
          "title": "评分方案管理",
          "icon": "tab",
          "noCache": false,
          "link": null
        }
      }
    ]
  },
  {
    "name": "DataRelationalApp",
    "path": "/dataRelationalApp",
    "hidden": false,
    "redirect": "noRedirect",
    "component": "Layout",
    "alwaysShow": true,
    "meta": {
      "title": "数据关系应用",
      "icon": "shuju",
      "noCache": false,
      "link": null
    },
    "children": [
      {
        "name": "AssociationQuery",
        "path": "associationQuery",
        "hidden": false,
        "component": "dataRelationalApp/associationQuery",
        "meta": {
          "title": "数据关联查询",
          "icon": "tree",
          "noCache": false,
          "link": null
        }
      }
    ]
  }
]

export default mockMenuList

