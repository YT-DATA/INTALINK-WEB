/*
* mock data
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
  }
]
export default mockMenuList


