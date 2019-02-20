const fs = require('fs');
const path = require('path');
const header = `<?xml version="1.0" encoding="UTF-8"?>`;


//时间
const LAST_MODIFY = new Date().toLocaleString();

var data = [

  {
    url: "https://didiglobal.com/about-didi/about-us",
    priority: 0.1
  },
  {
    url: "https://didiglobal.com/about-didi/cultural",
    priority: 0.11
  },
  {
    url: "https://didiglobal.com/about-special/milestone",
    priority: 0.12
  },
  {
    url: "https://didiglobal.com/about-special/senior",
    priority: 0.13
  },
  {
    url: "https://didiglobal.com/about-didi/responsibility",
    priority: 0.14
  },
  {
    url: "https://didiglobal.com/about-didi/ddwn",
    priority: 0.15
  },
  {
    url: "https://didiglobal.com/about-didi/alliance",
    priority: 0.16
  },
  {
    url: "https://didiglobal.com/travel-service/express",
    priority: 0.17
  },
  {
    url: "https://didiglobal.com/travel-service/taxi",
    priority: 0.18
  },
  {
    url: "https://didiglobal.com/travel-service/hitch",
    priority: 0.19
  },
  {
    url: "https://didiglobal.com/travel-service/enterprise",
    priority: 0.2
  },
  {
    url: "https://didiglobal.com/travel-service/bus",
    priority: 0.21
  },
  {
    url: "https://didiglobal.com/travel-service/designated",
    priority: 0.22
  },
  {
    url: "https://didiglobal.com/travel-service/luxe",
    priority: 0.23
  },
  {
    url: "https://didiglobal.com/travel-service/bike",
    priority: 0.24
  },
  {
    url: "https://didiglobal.com/international-businesse",
    priority: 0.25
  },
  {
    url: "https://didiglobal.com/financial-business/car-insure",
    priority: 0.26
  },
  {
    url: "https://didiglobal.com/automobile-service/auto-solutions",
    priority: 0.27
  },
  {
    url: "https://didiglobal.com/science/brain",
    priority: 0.28
  },
  {
    url: "https://didiglobal.com/science/security",
    priority: 0.29
  },
  {
    url: "https://didiglobal.com/science/ailabs",
    priority: 0.3
  },
  {
    url: "https://didiglobal.com/science/intelligent-driving",
    priority: 0.31
  },
  {
    url: "https://didiglobal.com/news/newsCenter",
    priority: 0.32
  },
  {
    url: "https://didiglobal.com/news/blog",
    priority: 0.33
  },
  {
    url: "https://didiglobal.com/news/newsMedia",
    priority: 0.34
  },
  {
    url: "https://didiglobal.com/contact/contact-us",
    priority: 0.35
  },
  {
    url: "https://didiglobal.com/contact/platform",
    priority: 0.36
  },
  {
    url: "https://didiglobal.com/contact/recruit",
    priority: 0.37
  },
]


// 默认根节点配置
const default_root_config = {
  key: 'urlset',
  attributes: [
    {
      key: 'xmlns',
      value: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    },
    {
      key: 'xmlns:xsi',
      value: 'http://www.w3.org/2001/XMLSchema-instance',
    },
    {
      key: 'xsi:schemaLocation',
      value: 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
    },
  ],

};

//default_root_config 加入children
function default_children(data) {
  let child = [];
  data.map(item => {
    const list = {
      children: [
        {
          key: 'url',
          children: [
            {
              key: 'loc',
              value: `${item.url}`,
            },
            {
              key: 'lastmod',
              value: `${LAST_MODIFY}`,
            },
            {
              key: 'priority',
              value: `${item.priority}`,
            },
            {
              key: "mobile:mobile",
              attributes: [
                {
                  key: "type",
                  value: "mobile"
                }
              ]
            }

          ]
        }
      ]
    };
    child.push(list);
  }),
    default_root_config.children = child;
}


// 格式规范
function paddingTab(num) {
  return new Array(num).fill('  ').join('')
}


// 拼接根节点
function concatRootNode(root) {
  let result = [];
  let key = root.key
  let attributes = root.attributes
  result.push(`<${key}`);

  attributes.map(item => {
    const type = item.key;
    const value = item.value;
    result.push(`${type}="${value}"`);
  })
  result.push(`>`);
  return result.join(' ');
}



// 拼接children子节点
function concatChildrenNode(children, deep = 1) {
  const result = [];
  children.map(item => {
    // console.log(children)
    //无children
    if (!item.children) {
      // 解析属性
      let attributes = '';
      if (item.attributes) {

        attributes = item.attributes.reduce((res, attribute) => {
          res.push(` ${attribute.key}="${attribute.value}"`);

          return res;
        }, []);

        attributes = attributes.join('');
      }

      if (item.value) {
        result.push(`${paddingTab(deep)}<${item.key}${attributes}>${item.value}</${item.key}>`);
      } else {
        result.push(`${paddingTab(deep)}<${item.key}${attributes}/>`);
      }
    } else {
      // url
      if (deep != 1) {
        result.push(`${paddingTab(deep)}<${item.key}>`);
      }

      // 递归解析子节点
      let sub_children = concatChildrenNode(item.children, deep + 1);
      result.push(sub_children);


      if (deep != 1) {
        result.push(`${paddingTab(deep)}</${item.key}>`);
      }

    }


  });

  return result.join('\n');
}



function parse2Xml(config) {
  config = Object.assign({}, default_root_config, config || {});
  const xml_path = path.resolve(__dirname, './sitemap.xml');
  let xmlContent = [];

  // 写入header
  xmlContent.push(header);

  //获取URL
  default_children(data);

  // 写入根节点 
  const root_string = concatRootNode(default_root_config);
  xmlContent.push(root_string);

  // 写入子节点
  const children_string = concatChildrenNode(default_root_config.children);
  xmlContent.push(children_string);

  // 写入根节点结束标识
  xmlContent.push(`</${config.key}>`);

  fs.writeFileSync(xml_path, xmlContent.join('\n'), 'utf-8');
}

parse2Xml(default_root_config);










