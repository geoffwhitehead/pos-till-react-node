import { Item } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response) => {
    const item = new Item(req.body);
    const errors = item.validateSync();

    if (errors) {
        return res.status(401).send(errors);
    }

    try {
        await item.save();
        res.status(201).send('created item');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        return res.status(200).send(item);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response) => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const items = await Item.find({}, '', { skip, limit });
        return res.status(200).send(items);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response) => {
    const { id, ...props } = req.body;
    try {
        const item = await Item.updateOne(id, props, { runValidators: true });
        if (item.err) {
            throw new Error('Error occured updating item');
        }
        return res.send('item updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleteMsg = await Item.deleteOne(id);
        return res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
