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



## In Your Application

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

# Usage with where Operators


```
const { Op } = require("sequelize");
  data = await Cours.findAndPaginate(5, req, { where: { id: { [Op.gt]: 100 } } });
  data2 = await User.findAndPaginate(10, req, { where: { id: { [Op.lt]: 100 } } });

```


# functions explenation
findAndPaginate: This is an asynchronous function that accepts parameters for pagination. It retrieves data based on these parameters and returns a paginated response. It also generates pagination links.

generatePaginationLinks: A nested function within findAndPaginate, it generates pagination links based on the current page, total pages, and other parameters. It handles different cases for pagination link generation, including ellipsis and disabled links.

bootstrapLinks: This function generates Bootstrap-styled pagination links based on the data provided to it. It creates HTML for pagination using Bootstrap classes.

tailwindLinks: This function generates Tailwind CSS-styled pagination links based on the data provided to it. It creates HTML for pagination using Tailwind CSS classes.

addQueryString: This function appends query parameters to pagination links. It ensures that the pagination links retain any existing query parameters while adding the necessary pagination-related parameters.

buildQueryString: A helper function that converts a query object into a query string format.

At the end of the code, you export these functions for use in other parts of your application.

This code provides a comprehensive solution for handling pagination and generating pagination links in both Bootstrap and Tailwind CSS styles, making it versatile and adaptable for various web development projects.

# Server-Side Rendering (SSR) and Client-Side Rendering (CSR)


Sequelize Paginator can be used in both server-side rendering (SSR) and client-side rendering (CSR) applications. Simply import the necessary functions and use them in your routes, controllers, or components as shown in the examples above.

For SSR, you might use frameworks like Express.js, while for CSR, you can integrate Sequelize Paginator with your frontend JavaScript framework of choice.

Feel free to customize the pagination links' styles to match your project's design using Bootstrap or Tailwind CSS classes.



