import { Router, Request, Response, NextFunction } from 'express';
import { PrinterService } from '../../services/printer';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { ProductService } from '../../services/product';
import { Changes } from '../../services';
import { CATEGORY_COLLECTION_NAME } from '../../models/Category';
import { DISCOUNT_COLLECTION_NAME } from '../../models/Discount';
import { ITEM_COLLECTION_NAME } from '../../models/Item';
import { ITEM_MODIFIER_COLLECTION_NAME } from '../../models/ItemModifier';
import { ITEM_PRICE_COLLECTION_NAME } from '../../models/ItemPrice';
import { MODIFIER_COLLECTION_NAME } from '../../models/Modifier';
import { MODIFIER_ITEM_COLLECTION_NAME } from '../../models/ModifierItem';
import { MODIFIER_PRICE_COLLECTION_NAME } from '../../models/ModifierPrice';
import { PRICE_GROUP_COLLECTION_NAME } from '../../models/PriceGroup';
import { fromClientChanges } from '../../utils/sync';

export default (app: Router) => {
    const route = Router();
    app.use('/sync', route);

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const {
            item: itemService,
            modifier: modifierService,
            category: categoryService,
            discount: discountService,
            priceGroup: priceGroupService,
        } = Container.get('productService') as ProductService;

        const { lastPulledAt, schemaVersion, migration = null } = req.query;

        const [itemChanges, modifierChanges, categoryChanges, discountChanges, priceGroupChanges] = await Promise.all([
            categoryService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            itemService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            modifierService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            discountService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            priceGroupService.pullChanges({ lastPulledAt, schemaVersion, migration }),
        ]);

        const changes = {
            ...itemChanges,
            ...modifierChanges,
            ...categoryChanges,
            ...discountChanges,
            ...priceGroupChanges,
        };

        return res.status(200).json(changes);
    });

    type SyncRequest = Request & { body: { lastPulledAt: Date; changes: Changes } };
    route.post('/', async (req: SyncRequest, res: Response, next: NextFunction) => {
        const {
            item: itemService,
            modifier: modifierService,
            category: categoryService,
            discount: discountService,
            priceGroup: priceGroupService,
        } = Container.get('productService') as ProductService;

        const { lastPulledAt, changes: unmappedChanges } = req.body;

        console.log('unmappedChanges', unmappedChanges);
        const changes = fromClientChanges(unmappedChanges);

        console.log('JSON.stringify(changes, null, 4)', JSON.stringify(changes, null, 4));

        try {
            await Promise.all([
                itemService.pushChanges({
                    lastPulledAt,
                    changes: {
                        ...deconstructChanges(changes, ITEM_COLLECTION_NAME),
                        ...deconstructChanges(changes, ITEM_MODIFIER_COLLECTION_NAME),
                        ...deconstructChanges(changes, ITEM_PRICE_COLLECTION_NAME),
                    },
                }),
                modifierService.pushChanges({
                    lastPulledAt,
                    changes: {
                        ...deconstructChanges(changes, MODIFIER_COLLECTION_NAME),
                        ...deconstructChanges(changes, MODIFIER_ITEM_COLLECTION_NAME),
                        ...deconstructChanges(changes, MODIFIER_PRICE_COLLECTION_NAME),
                    },
                }),
                categoryService.pushChanges({
                    lastPulledAt,
                    changes: deconstructChanges(changes, CATEGORY_COLLECTION_NAME),
                }),
                discountService.pushChanges({
                    lastPulledAt,
                    changes: deconstructChanges(changes, DISCOUNT_COLLECTION_NAME),
                }),
                priceGroupService.pushChanges({
                    lastPulledAt,
                    changes: deconstructChanges(changes, PRICE_GROUP_COLLECTION_NAME),
                }),
            ]);

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('ERROR: ', error);
            return res.status(500).json({ success: false, error });
        }
    });
};

export const deconstructChanges = (changes: Changes, key: string) => ({ [key]: changes[key] });
