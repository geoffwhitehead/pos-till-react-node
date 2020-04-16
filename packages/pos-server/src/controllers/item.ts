import { Item } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response): Promise<void> => {
    const ItemModel = Item();
    const item = new ItemModel(req.body);
    const errors = item.validateSync();

    if (errors) {
        res.status(401).send(errors);
        return;
    }

    try {
        await item.save();
        res.status(201).send('created item');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const item = await Item().findById(id);
        res.status(200).send(item);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const items = await Item().find({}, '', { skip, limit });
        res.status(200).send(items);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id, ...props } = req.body;
    try {
        const item = await Item().updateOne(id, props, { runValidators: true });
        if (item.err) {
            throw new Error('Error occured updating item');
        }
        res.send('item updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

const remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deleteMsg = await Item().deleteOne(id);
        res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
