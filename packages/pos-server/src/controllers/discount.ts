import { Discount } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response): Promise<void> => {
    const DiscountModel = Discount();
    const discount = new DiscountModel(req.body);
    const errors = discount.validateSync();

    if (errors) {
        res.status(401).send(errors);
        return;
    }

    try {
        await discount.save();
        res.status(201).send('created discount');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const discount = await Discount().findById(id);
        res.status(200).send(discount);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const discounts = await Discount().find({}, '', { skip, limit });
        res.status(200).send(discounts);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id, ...props } = req.body;
    try {
        const discount = await Discount().updateOne(id, props, { runValidators: true });
        if (discount.err) {
            throw new Error('Error occured updating discount');
        }
        res.send('discount updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

const remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deleteMsg = await Discount().deleteOne(id);
        res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
