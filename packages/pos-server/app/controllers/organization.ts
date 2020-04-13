import { Organization } from '../models';
import { Request, Response } from 'express';

const create = async (req: Request, res: Response) => {
    const organization = new Organization(req.body);
    const errors = organization.validateSync();

    if (errors) {
        return res.status(401).send(errors);
    }

    try {
        await organization.save();
        res.status(201).send('created item');
    } catch (err) {
        res.status(400).send(err);
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const organization = await Organization.findById(id);
        return res.status(200).send(organization);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAll = async (req: Request, res: Response) => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const organizations = await Organization.find({}, '', { skip, limit });
        return res.status(200).send(organizations);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req: Request, res: Response) => {
    const { id, ...props } = req.body;
    try {
        const organization = await Organization.updateOne(id, props, { runValidators: true });
        if (organization.err) {
            throw new Error('Error occured updating item');
        }
        return res.send('item updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, getById, getAll };
