import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

// file upload settings
const createStorage = (folderName, basePath) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const fullFolderPath = path.join(basePath, folderName);
            fs.mkdirSync(fullFolderPath, { recursive: true });
            cb(null, fullFolderPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
};

const uploadHandler = (folderName, basePath) =>
    multer({
        storage: createStorage(folderName, basePath),
        limits: {
            fileSize: 1024 * 1024 * 50,
        },
    });

// Controller set without file uploading
class ControllerSets {
    constructor(model, orderBy = "none", query = []) {
        this.model = model;
        this.orderBy = orderBy;
        this.query = query;
    }

    async getAll(req, res) {
        try {
            let filters = {};
            let sort = {};
            if (Object.keys(req.query).length > 0) {
                for (let i = 0; i < this.query.length; i++) {
                    const query = this.query[i];
                    if (req.query[query]) {
                        filters[query] = req.query[query];
                    }
                }
            }

            if (this.orderBy !== "none") {
                const sortKey = this.orderBy.startsWith("-")
                    ? this.orderBy.substring(1)
                    : this.orderBy;
                const sortOrder = this.orderBy.startsWith("-") ? -1 : 1;
                sort = { sort: { [sortKey]: sortOrder } };
            }

            if (req.query.page) {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const skip = (page - 1) * pageSize;
                const totalRecords = await this.model.countDocuments(filters);
                const totalPages = Math.ceil(totalRecords / pageSize);
                const result = await this.model
                    .find(filters, null, sort)
                    .skip(skip)
                    .limit(pageSize);

                return res
                    .status(200)
                    .send({ data: result, page, totalPages, totalRecords });
            }

            const result = await this.model.find(filters, null, sort);
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        try {
            const example = await this.model.findById(id);
            if (!example) {
                return res.status(404).json({ error: "Data not found" });
            }
            res.json(example);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async create(req, res, next, body = null) {
        try {
            const data = body ? body : req.body;
            const result = await this.model.create(data);
            await result.validate();
            await result.save();
            return res.status(201).send(result);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        try {
            const result = await this.model.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!result) {
                return res.status(404).json({ error: "data not found" });
            }
            return res.status(200).send(result);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        try {
            const result = await this.model.findByIdAndDelete(id);

            if (!result) {
                return res.status(404).json({ error: "Data not found" });
            }
            return res.status(200).send({ message: "success" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

// Controller set with file uploading
class FileUploaderControllerSets {
    constructor(model, uploadOptions, basePath) {
        this.model = model;
        this.uploadOptions = uploadOptions;
        this.basePath = basePath;
    }

    async fileUpload(req, res, next) {
        try {
            const uploadOptions = this.uploadOptions;
            const basePath = this.basePath;
            uploadHandler(uploadOptions.folder, basePath).single(
                uploadOptions.fileField
            )(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                if (req.file) {
                    req.body[`${uploadOptions.fileField}`] = req.file.filename;
                }
                try {
                    const result = await this.model.create(req.body);
                    await result.validate();
                    await result.save();
                    return res.status(201).send(result);
                } catch (error) {
                    return res.status(500).send(error.message);
                }
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async updateFileUpload(req, res, next) {
        try {
            const uploadOptions = this.uploadOptions;
            const basePath = this.basePath;
            uploadHandler(uploadOptions.folder, basePath).single(
                uploadOptions.fileField
            )(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                if (req.file) {
                    req.body[`${uploadOptions.fileField}`] = req.file.filename;
                }
                try {
                    const { id } = req.params;
                    const result = await this.model.findByIdAndUpdate(
                        id,
                        req.body,
                        {
                            new: true,
                        }
                    );
                    if (!result) {
                        return res.status(404).send("Resource not found");
                    }
                    return res.status(200).send(result);
                } catch (error) {
                    return res.status(500).send(error.message);
                }
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async multiFileUpload(req, res, next) {
        try {
            const uploadOptions = this.uploadOptions;
            const basePath = this.basePath;
            uploadHandler(uploadOptions.folder, basePath).fields(
                uploadOptions.multiFields
            )(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                uploadOptions.multiFields.forEach((field) => {
                    const fileField = field.name;
                    req.body[`${field.name}`] = req.files[fileField]
                        ? req.files[fileField][0].filename
                        : "";
                });

                try {
                    const result = await this.model.create(req.body);
                    await result.validate();
                    await result.save();
                    return res.status(201).send(result);
                } catch (error) {
                    return res.status(500).send(error.message);
                }
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async updateMultiFileUpload(req, res, next) {
        try {
            const uploadOptions = this.uploadOptions;
            const basePath = this.basePath;
            uploadHandler(uploadOptions.folder, basePath).fields(
                uploadOptions.multiFields
            )(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                uploadOptions.multiFields.forEach((field) => {
                    const fileField = field.name;
                    req.body[`${field.name}`] = req.files[fileField]
                        ? req.files[fileField][0].filename
                        : "";
                });

                try {
                    const { id } = req.params;
                    const result = await this.model.findByIdAndUpdate(
                        id,
                        req.body,
                        {
                            new: true,
                        }
                    );
                    if (!result) {
                        return res.status(404).send("Resource not found");
                    }
                    return res.status(200).send(result);
                } catch (error) {
                    return res.status(500).send(error.message);
                }
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
}

// file Serve
class FileServe {
    constructor(paths = [], basePath) {
        this.paths = paths;
        this.basePath = basePath;
    }

    async serve(req, res) {
        try {
            const { fileName } = req.params;
            const paths = this.paths;
            const basePath = this.basePath;
            const imagePath = path.join(basePath, ...paths, fileName);
            return res.sendFile(imagePath);
        } catch (error) {
            return res.status(400).send({ message: "Invalid Routes!" });
        }
    }
}

export { ControllerSets, FileServe, FileUploaderControllerSets };
