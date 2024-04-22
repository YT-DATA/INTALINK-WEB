const associationQuery = {
  // "total": 11,
  "total": 10,
  "headers": [
    {"name": "车型", "title": "Model"},
    {"name": "变速器类型", "title": "Transmission"},
    {"name": "颜色", "title": "Color"},
    {"name": "生产日期", "title": "ProductionDate"},
    {"name": "销售日期", "title": "SaleDate"},
    {"name": "销售金额", "title": "SaleAmount"},
    {"name": "付款方式", "title": "PaymentMethod"}
  ],
  "rows": [
    {
      "Model": "Camry",
      "Transmission": "Manual",
      "Color": "Red",
      "ProductionDate": "2023-01-15",
      "SaleDate": "2023-01-20",
      "SaleAmount": 25000.00,
      "PaymentMethod": "Cash"
    },
    {
      "Model": "Civic",
      "Transmission": "Automatic",
      "Color": "Blue",
      "ProductionDate": "2023-02-20",
      "SaleDate": null,
      "SaleAmount": null,
      "PaymentMethod": null
    },
    {
      "Model": "Fusion",
      "Transmission": "Automatic",
      "Color": "red",
      "ProductionDate": "2023-03-10",
      "SaleDate": null,
      "SaleAmount": null,
      "PaymentMethod": null
    },
    {
      "Model": "Malibu",
      "Transmission": "Automatic",
      "Color": "Red",
      "ProductionDate": "2023-04-05",
      "SaleDate": null,
      "SaleAmount": null,
      "PaymentMethod": null
    },
    {
      "Model": "X5",
      "Transmission": "Manual",
      "Color": "Black",
      "ProductionDate": "2023-05-10",
      "SaleDate": null,
      "SaleAmount": null,
      "PaymentMethod": null
    },
    {
      "Model": "Corolla",
      "Transmission": null,
      "Color": null,
      "ProductionDate": "2023-01-15",
      "SaleDate": "2023-01-20",
      "SaleAmount": 27000.00,
      "PaymentMethod": null
    },
    {
      "Model": "Focus",
      "Transmission": null,
      "Color": null,
      "ProductionDate": "2023-03-20",
      "SaleDate": "2023-03-25",
      "SaleAmount": 29000.00,
      "PaymentMethod": "Cash"
    },
    {
      "Model": "SU7",
      "Transmission": "MI",
      "Color": "Red",
      "ProductionDate": "2023-04-05",
      "SaleDate": null,
      "SaleAmount": null,
      "PaymentMethod": null
    },
    {
      "Model": "S600",
      "Transmission": "Daimler AG",
      "Color": "Black",
      "ProductionDate": "2023-05-10",
      "SaleDate": null,
      "SaleAmount": null,
      "PaymentMethod": null
    },
    {
      "Model": "Rav4",
      "Transmission": "CVT",
      "Color": "Red",
      "ProductionDate": "2023-07-12",
      "SaleDate": "2024-03-02",
      "SaleAmount": 32000,
      "PaymentMethod": "WeChat Pay"
    },
    // {
    //   "Model": "Volkswagen Tiguan",
    //   "Transmission": "Dual Clutch",
    //   "Color": "Black",
    //   "ProductionDate": "2023-08-05",
    //   "SaleDate": "2024-03-10",
    //   "SaleAmount": 200000,
    //   "PaymentMethod": "Alipay"
    // }
  ],
  "code": 200,
  "msg": "查询成功"
}

export default associationQuery