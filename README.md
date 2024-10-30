# controllerSets

[controllerSets](https://oneislam.pro/)  is designed to reduce code for Node.js/Express.js developers by following the MVC architecture. First, create your model, import ControllerSet, create a new instance, define routes, and your API is ready. It simplifies data-saving logic and allows for data validation through Mongoose models.

Additionally, the [express-controller-sets-router](https://www.npmjs.com/package/express-controller-sets-router) package enables route definition without extra code. [controller-sets-s3-file-upload](https://www.npmjs.com/package/controller-sets-s3-file-upload) can also be used to upload files to S3 efficiently.


## Update logs:
* removed file uploading from main controller.
* create a new middleware to upload files to S3.


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

### Defining an class to create rest api without file upload

```js

// imports
import { ControllerSets } from "express-controller-sets";
import taskModel from "./modelPath.js";

// Create an instance of the controller
// ControllerSets(Mongoose Model, sorting Field, filters field, run function after save data)
const taskController = new ControllerSets(taskModel, "-_id", [
  "email",
  "status",
],
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

Copyright (c) 2023 LearnBoost &lt;https://oneislam.pro/&gt;

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
