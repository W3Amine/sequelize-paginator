# Sequelize Paginator

Sequelize Paginator is a utility package for handling pagination with Sequelize models in Node.js applications. It provides easy-to-use functions for paginating query results and generating pagination links with Bootstrap and Tailwind CSS styles.

## Installation

You can install the package using npm or yarn:

```
npm install sequelize-paginator
```


## Setup
In Your Models

To set up Sequelize Paginator in your Sequelize models, follow these steps:

Import the package:

```
const { findAndPaginate } = require("sequelize-paginator");
```
1 - For each Sequelize model you want to paginate, add the findAndPaginate function to it. For example:

```
const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
model.findAndPaginate = findAndPaginate;
```

2 - or inside the model file  : define or init function
 
  - init 
  
```
  Cours.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    },
    {
      sequelize,
      modelName: "Cours",
    }
  );
   Cours.findAndPaginate = findAndPaginate;

```
-  define

```

// Define the model
const MyModel = sequelize.define('MyModel', {
  // Your model attributes here
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
});

// Add a findAndPaginate to the model
MyModel.findAndPaginate = findAndPaginate ;

```



### In Your Application

To use Sequelize Paginator in your application, you can follow these examples:

## BootstrapLinks

```
const { bootstrapLinks, addQueryString } = require("sequelize-paginator");

// Inside your route or controller:
const data = await YourModel.findAndPaginate(10, req, {});
const paginationLinks = bootstrapLinks(data.links);

res.render("your_template", { data, paginationLinks });
```

In this example, YourModel should be replaced with your Sequelize model, and "your_template" should be replaced with the name of your template or view.

## TailwindLinks


```
const { tailwindLinks, addQueryString } = require("sequelize-paginator");

// Inside your route or controller:
const data = await YourModel.findAndPaginate(10, req, {});
const paginationLinks = tailwindLinks(data.links);

res.render("your_template", { data, paginationLinks });

```


Again, replace YourModel and "your_template" with your model and template name, respectively.

## Usage with addQueryString


The addQueryString function is used to append query parameters to pagination links. It ensures that the pagination links retain any existing query parameters while adding the necessary pagination-related parameters.
```
const { addQueryString } = require("sequelize-paginator");

const data = await YourModel.findAndPaginate(10, req, {});
const paginationLinks = bootstrapLinks(addQueryString(data.links, req.query, "page"));
```

