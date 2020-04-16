import { Modifier } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response): Promise<void> => {
    const ModifierModel = Modifier();
    const modifier = new ModifierModel(req.body);
    const errors = modifier.validateSync();

    if (errors) {
        res.status(401).send(errors);
        return;
    }

    try {
        await modifier.save();
        res.status(201).send('created modifier');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const modifier = await Modifier().findById(id);
        res.status(200).send(modifier);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const modifiers = await Modifier().find({}, '', { skip, limit });
        res.status(200).send(modifiers);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id, ...props } = req.body;
    try {
        const modifier = await Modifier().updateOne(id, props, { runValidators: true });
        if (modifier.err) {
            throw new Error('Error occured updating modifier');
        }
        res.send('modifier updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

const remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deleteMsg = await Modifier().deleteOne(id);
        res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
