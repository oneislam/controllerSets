import mongoose from "mongoose";

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
        const pageSize = parseInt(req.query.pageSize) || 3;
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
        return res.status(404).json({ error: "Example not found" });
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
      return res.status(500).send(error);
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
        return res.status(404).json({ error: "Example not found" });
      }
      return res.status(200).send({ message: "success" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

class FileUploaderControllerSets extends ControllerSets {
  constructor(model, orderBy, query, uploadOptions) {
    super(model, orderBy, query);
    this.uploadOptions = uploadOptions;
  }

  async create(req, res) {
    try {
      if (req.files && Object.keys(req.files).length > 0) {
        const files = req.files;

        if (this.uploadOptions.multiple) {
          // Handle multiple file uploads
          const filePromises = Object.values(files).map((file) => {
            const filePath = `/path/to/save/${file.name}`; // Replace with the actual path to save the file
            return file.mv(filePath);
          });

          await Promise.all(filePromises);
        } else {
          // Handle single file upload
          const file = files.file; // Assuming the file field name is 'file', modify it as per your actual field name
          const filePath = `/path/to/save/${file.name}`; // Replace with the actual path to save the file

          await file.mv(filePath);
        }
      }

      const result = await this.model.create(req.body);
      await result.validate();
      await result.save();
      return res.status(201).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

export { ControllerSets, FileUploaderControllerSets };
