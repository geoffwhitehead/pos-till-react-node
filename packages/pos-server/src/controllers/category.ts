import { Category } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response) => {
    const category = new Category(req.body);
    const errors = category.validateSync();

    if (errors) {
        return res.status(401).send(errors);
    }

    try {
        await category.save();
        res.status(201).send('created category');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        return res.status(200).send(category);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response) => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const categories = await Category.find({}, '', { skip, limit });
        return res.status(200).send(categories);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response) => {
    const { id, ...props } = req.body;
    try {
        const category = await Category.updateOne(id, props, { runValidators: true });
        if (category.err) {
            throw new Error('Error occured updating category');
        }
        return res.send('category updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleteMsg = await Category.deleteOne(id);
        return res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
