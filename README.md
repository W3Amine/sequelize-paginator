# Sequelize Paginator

Sequelize Paginator is a utility package for handling pagination with Sequelize models in Node.js applications. It provides easy-to-use functions for paginating query results and generating pagination links with Bootstrap and Tailwind CSS styles.

## Installation

You can install the package using npm or yarn:

```bash
npm install sequelize-paginator


Setup
In Your Models

To set up Sequelize Paginator in your Sequelize models, follow these steps:

    Import the package:

javascript

const { findAndPaginate } = require("sequelize-paginator");

    For each Sequelize model you want to paginate, add the findAndPaginate function to it. For example:

javascript

const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
model.findAndPaginate = findAndPaginate;
