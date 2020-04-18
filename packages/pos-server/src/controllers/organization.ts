// import { Organization } from '../models';
// import { Request, Response } from 'express';
// import * as userController from './user';

// const create = async (req: Request, res: Response): Promise<void> => {
//     const OrganizationModel = Organization();

//     const { name, email, phone, address } = req.body;
//     const organization = new OrganizationModel({ name, email, phone, address });

//     const errors = organization.validateSync();

//     if (errors) {
//         res.status(401).send(errors);
//         return;
//     }

//     try {
//         await organization.save();

//         // create initial user
//         await userController.create(req, res);

//         res.status(201).send('created item');
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// const getById = async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     try {
//         const organization = await Organization().findById(id);
//         res.status(200).send(organization);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// const getAll = async (req: Request, res: Response): Promise<void> => {
//     const skip = req.query.skip;
//     const limit = req.query.limit;
//     try {
//         const organizations = await Organization().find({}, '', { skip, limit });
//         res.status(200).send(organizations);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// const update = async (req: Request, res: Response): Promise<void> => {
//     const { id, ...props } = req.body;
//     try {
//         const organization = await Organization().updateOne(id, props, { runValidators: true });
//         if (organization.err) {
//             throw new Error('Error occured updating item');
//         }
//         res.send('item updated');
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// export { create, update, getById, getAll };
