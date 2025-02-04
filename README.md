# ONE ISLAM

[oneislam](https://oneislam.pro/) is an IT company founded to connect humanity with Islam and usher in a `new era of halal platforms for Muslims`.

# controllerSets

[controllerSets](https://oneislam.pro/)  Designed for Node.js/Express.js developers, it follows modern JavaScript architecture to minimize code. Simply create a model, import ControllerSet, instantiate it, define routes, and your API is ready. It streamlines data handling and enables validation via Mongoose models.

Additionally, the [express-controller-sets-router](https://www.npmjs.com/package/express-controller-sets-router) package simplifies route definition, while. [controller-sets-s3-file-upload](https://www.npmjs.com/package/controller-sets-s3-file-upload) enables efficient S3 file uploads.


## Update logs:
* Develop a middleware for `uploading files to S3`.
* Enable `search` functionality.
* Set the default `page size` to 50.
* Add support for custom `middlewares`.
* Enable S3 file uploads via `.env` configuration.


## Documentation

The official documentation website is [controllerSets](https://oneislam.pro/).

controllerSets 1.0.0 was released on May 2023. You can find more details on [backwards breaking changes in 1.0.0 on our docs site](https://oneislam.pro/).

## Installation

First install [Node.js](http://nodejs.org/) and [mongoose](https://www.mongodb.org/downloads). Then:

```sh
$ npm i express-controller-sets
```

## Importing

```javascript

// Using ES6 imports
import { ControllerSets } from "express-controller-sets";
```

### Defining an class to create rest api

```js

// imports
import { ControllerSets } from "express-controller-sets";
import taskModel from "./modelPath.js";

// Create an instance of the controller
// ControllerSets(Mongoose Model, sorting Field, filters field, Search field, run function after save data)
const taskController = new ControllerSets(taskModel, "-_id", [
  "email",
  "status",
],
"name",
(createdObject) => {
  console.log("New object created: ", createdObject);
});

export { taskController };

```

### Defining routers
```js
// imports
import { Router } from "express";
import { taskController } from "../taskClassController.js";

// routers
const router = Router();

// task routes
router.get("/", taskController.getAll.bind(taskController));
router.get("/:id", taskController.getById.bind(taskController));
router.post("/", taskController.create.bind(taskController));
router.put("/:id", taskController.update.bind(taskController));
router.delete("/:id", taskController.delete.bind(taskController));

// exports
export default router;


```

### File upload 
[controller-sets-s3-file-upload](https://www.npmjs.com/package/controller-sets-s3-file-upload)



## License

Copyright (c) 2025 Learn &lt;https://oneislam.pro/&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
