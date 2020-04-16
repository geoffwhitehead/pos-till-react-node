import { PriceGroup } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response): Promise<void> => {
    const PriceGroupModel = PriceGroup();
    const priceGroup = new PriceGroupModel(req.body);
    const errors = priceGroup.validateSync();

    if (errors) {
        res.status(401).send(errors);
        return;
    }

    try {
        await priceGroup.save();
        res.status(201).send('created price group');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const priceGroup = await PriceGroup().findById(id);
        res.status(200).send(priceGroup);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const priceGroups = await PriceGroup().find({}, '', { skip, limit });
        res.status(200).send(priceGroups);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id, ...props } = req.body;
    try {
        const priceGroup = await PriceGroup().updateOne(id, props, { runValidators: true });
        if (priceGroup.err) {
            throw new Error('Error occured updating price group');
        }
        res.send('price group updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

// const remove = async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     try {
//         const deleteMsg = await PriceGroup.deleteOne(id);
//         return res.send(deleteMsg);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

export { create, update, getById, getAll };
