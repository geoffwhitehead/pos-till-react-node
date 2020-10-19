import { Router, Request, Response, NextFunction } from 'express';
import { PrinterService } from '../../services/printer';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { ProductService } from '../../services/product';
import category from './product/category';

export default (app: Router) => {
    const route = Router();
    app.use('/sync', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const { item: itemService } = Container.get('productService') as ProductService;
        const { category: categoryService } = Container.get('productService') as ProductService;

        console.log('req.body', req.body);
        categoryService.pullChanges(req.body.lastPulledAt);
        console.log('SYNC');

        // {
        //     lastPulledAt: Ti]mestamp,
        //     schemaVersion: int,
        //     migration: null | { from: int, tables: string[], columns: { table: string, columns: string[] }[] }
        //   }

        // { changes: Changes, timestamp: Timestamp }
    });

    route.post('/', async (req: Request, res: Response, next: NextFunction) => {});
};
