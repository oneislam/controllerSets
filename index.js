import mongoose from "mongoose";

class ControllerSets {
    constructor(model, orderBy = "none", query = [], runAfterCreate = "none") {
        this.model = model;
        this.orderBy = orderBy;
        this.query = query;
        this.runAfterCreate = runAfterCreate;
    }

    async getObjectById(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return this.sendErrorResponse(res, 400, "Invalid ID");
        }

        try {
            const object = await this.model.findById(id);
            if (!object) {
                return this.sendErrorResponse(res, 404, "Details not found");
            }
            return object;
        } catch (error) {
            this.sendErrorResponse(res, 500, "Internal server error!");
            return null;
        }
    }

    async create(req, res) {
        try {
            const result = await this.model.create(req.body);
            if (this.runAfterCreate != "none") {
                this.runAfterCreate(result);
            }
            return res.status(201).send(result);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async getById(req, res) {
        const object = await this.getObjectById(req, res);
        if (object) {
            return res.json(object);
        }
    }

    async update(req, res) {
        const object = await this.getObjectById(req, res);
        if (object) {
            try {
                const updatedObject = await this.model.findByIdAndUpdate(
                    object._id,
                    req.body,
                    {
                        new: true,
                    }
                );
                return res.status(200).json(updatedObject);
            } catch (error) {
                return this.sendErrorResponse(
                    res,
                    500,
                    "Internal server error!"
                );
            }
        }
    }

    async delete(req, res) {
        const object = await this.getObjectById(req, res);
        if (object) {
            try {
                await this.model.findByIdAndDelete(object._id);
                return res.status(200).json({ message: "Item deleted" });
            } catch (error) {
                return this.sendErrorResponse(
                    res,
                    500,
                    "Internal server error!"
                );
            }
        }
    }

    async getAll(req, res) {
        try {
            let filters = this.query.reduce((acc, query) => {
                if (req.query[query]) {
                    acc[query] = req.query[query];
                }
                return acc;
            }, {});

            let sort = {};
            if (this.orderBy !== "none") {
                const sortKey = this.orderBy.startsWith("-")
                    ? this.orderBy.substring(1)
                    : this.orderBy;
                const sortOrder = this.orderBy.startsWith("-") ? -1 : 1;
                sort = { [sortKey]: sortOrder };
            }

            if (req.query.page) {
                return await this.getPaginatedResults(req, res, filters, sort);
            }

            const result = await this.model.find(filters).sort(sort);
            return res.status(200).json({ data: result });
        } catch (error) {
            console.log(error);
            return this.sendErrorResponse(res, 500, "Internal server error!");
        }
    }

    async getPaginatedResults(req, res, filters, sort) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        try {
            const [totalRecords, result] = await Promise.all([
                this.model.countDocuments(filters),
                this.model.find(filters).skip(skip).limit(pageSize).sort(sort),
            ]);

            const totalPages = Math.ceil(totalRecords / pageSize);
            return res
                .status(200)
                .json({ data: result, page, totalPages, totalRecords });
        } catch (error) {
            return this.sendErrorResponse(res, 500, "Internal server error!");
        }
    }

    sendErrorResponse(res, statusCode, message) {
        return res.status(statusCode).json({ error: message });
    }
}

export { ControllerSets };
