import { fromUnixTime, getUnixTime } from 'date-fns';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { LoggerService } from '../../loaders/logger';
import { CATEGORY_COLLECTION_NAME } from '../../models/Category';
import { DISCOUNT_COLLECTION_NAME } from '../../models/Discount';
import { ITEM_COLLECTION_NAME } from '../../models/Item';
import { ITEM_MODIFIER_COLLECTION_NAME } from '../../models/ItemModifier';
import { ITEM_PRICE_COLLECTION_NAME } from '../../models/ItemPrice';
import { MODIFIER_COLLECTION_NAME } from '../../models/Modifier';
import { MODIFIER_ITEM_COLLECTION_NAME } from '../../models/ModifierItem';
import { MODIFIER_ITEM_PRICE_COLLECTION_NAME } from '../../models/ModifierItemPrice';
import { ORGANIZATION_COLLECTION_NAME } from '../../models/Organization';
import { PRICE_GROUP_COLLECTION_NAME } from '../../models/PriceGroup';
import { PRINTER_COLLECTION_NAME } from '../../models/Printer';
import { PRINTER_GROUP_COLLECTION_NAME } from '../../models/PrinterGroup';
import { PRINTER_GROUP_PRINTER_COLLECTION_NAME } from '../../models/PrinterGroupPrinter';
import { Changes } from '../../services';
import { OrganizationService } from '../../services/organization';
import { PrinterService } from '../../services/printer';
import { ProductService } from '../../services/product';
import { fromClientChanges } from '../../utils/sync';

type SyncRequest = Request & { body: { lastPulledAt: Date; changes: Changes } };

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
        const printerService = Container.get('printerService') as PrinterService;
        const printerGroupService = Container.get('printerGroupService') as PrinterService;
        const organizationService = Container.get('organizationService') as OrganizationService;

        const { lastPulledAt: lastPulledAtUnix, schemaVersion, migration = null } = req.query;

        const lastPulledAt = lastPulledAtUnix ? fromUnixTime(lastPulledAtUnix) : null;

        const [
            itemChanges,
            modifierChanges,
            categoryChanges,
            discountChanges,
            priceGroupChanges,
            printerChanges,
            printerGroupChanges,
            organizationChanges,
        ] = await Promise.all([
            categoryService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            itemService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            modifierService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            discountService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            priceGroupService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            printerService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            printerGroupService.pullChanges({ lastPulledAt, schemaVersion, migration }),
            organizationService.pullChanges({ lastPulledAt, schemaVersion, migration }),
        ]);

        const changes = {
            ...itemChanges,
            ...modifierChanges,
            ...categoryChanges,
            ...discountChanges,
            ...priceGroupChanges,
            ...printerChanges,
            ...printerGroupChanges,
            ...organizationChanges,
        };
        const timestamp = getUnixTime(new Date());
        return res.status(200).json({ changes, timestamp });
    });

    route.post('/', async (req: SyncRequest, res: Response, next: NextFunction) => {
        const {
            item: itemService,
            modifier: modifierService,
            category: categoryService,
            discount: discountService,
            priceGroup: priceGroupService,
        } = Container.get('productService') as ProductService;
        const printerService = Container.get('printerService') as PrinterService;
        const printerGroupService = Container.get('printerGroupService') as PrinterService;
        const organizationService = Container.get('organizationService') as OrganizationService;

        const { lastPulledAt: lastPulledAtUnix, changes: unparsedChanges } = req.body;

        const unmappedChanges = JSON.parse(unparsedChanges);
        const changes = fromClientChanges(unmappedChanges);
        const lastPulledAt = lastPulledAtUnix ? fromUnixTime(lastPulledAtUnix) : null;

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
                        ...deconstructChanges(changes, MODIFIER_ITEM_PRICE_COLLECTION_NAME),
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
                ,
                printerService.pushChanges({
                    lastPulledAt,
                    changes: deconstructChanges(changes, PRINTER_COLLECTION_NAME),
                }),
                printerGroupService.pushChanges({
                    lastPulledAt,
                    changes: {
                        ...deconstructChanges(changes, PRINTER_GROUP_COLLECTION_NAME),
                        ...deconstructChanges(changes, PRINTER_GROUP_PRINTER_COLLECTION_NAME),
                    },
                }),
                organizationService.pushChanges({
                    lastPulledAt,
                    changes: deconstructChanges(changes, ORGANIZATION_COLLECTION_NAME),
                }),
            ]);

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('ERROR: ', error);
            return res.status(500).json({ success: false, error });
        }
    });
};

export const deconstructChanges = (changes: Changes, key: string) => ({
    [key]: changes[key] ? changes[key] : { created: [], updated: [], deleted: [] },
});
