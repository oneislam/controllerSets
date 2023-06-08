# controllerSets

[controllerSets](https://ornatecorporation.xyz/) is a automate tool that help backend developers to create Rest api using express.js and mongoose. Don't need to write same code again and again, use [controllerSets](https://ornatecorporation.xyz/) to boost your productivity.

## Documentation

The official documentation website is [controllerSets](https://ornatecorporation.xyz/).

controllerSets 1.0.0 was released on May 2023. You can find more details on [backwards breaking changes in 1.0.0 on our docs site](https://ornatecorporation.xyz/).

## Support

  - [Coming Soon](https://ornatecorporation.xyz/)
 


## Installation

First install [Node.js](http://nodejs.org/) and [mongoose](https://www.mongodb.org/downloads). Then:

```sh
$ npm i express-controller-sets
```

## Importing

```javascript

// Using ES6 imports
import { ControllerSets, FileUploaderControllerSets } from "express-controller-sets";
```

### Defining an class to create rest api without file upload

```js
import { ControllerSets } from "express-controller-sets";
import taskModel from "../models/taskModels.js";

// Create an instance of the controller
// ControllerSets(Mongoose Model, sorting Field, filters field)
const taskController = new ControllerSets(taskModel, "-_id", [
  "email",
  "status",
]);
export { taskController };

```

### Defining routers
```js
// imports
import { Router } from "express";
import { taskController } from "../controllers/taskClassController.js";

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

### Define base path

```js
// base path is the main parent folder where your files will be uploaded
// how to create base path --->
// create settings.js
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname);

export { basePath };

```

### Single files uploading

```js
import {ControllerSets,FileUploaderControllerSets} from "express-controller-sets";
import taskModel from "../models/taskModels.js";
import { basePath } from "../settings.js";

// (Mongoose Model, Upload options, basePath)
// in file upload we have only one method create
const uploadFile = new FileUploaderControllerSets(
  taskModel,
  {
    folder: "uploads/user/images/",
    fileField: "document",
  },
  basePath
);

export { taskController, uploadFile };

```

### Single file uploading routing
```js

// imports
import {taskController,uploadFile} from "../controllers/taskClassController.js";

router.post("/", uploadFile.fileUpload.bind(uploadFile));


// exports
export default router;

```

### Multiple files uploading

```js

// currently we don't support multiple file upload
// we are working on this


```




## License

Copyright (c) 2023 LearnBoost &lt;https://ornatecorporation.xyz/&gt;

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
