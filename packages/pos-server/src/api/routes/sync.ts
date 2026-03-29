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
import { PAYMENT_TYPE_COLLECTION_NAME } from '../../models/PaymentType';
import { PRICE_GROUP_COLLECTION_NAME } from '../../models/PriceGroup';
import { PRINT_CATEGORY_COLLECTION_NAME } from '../../models/PrintCategory';
import { PRINTER_COLLECTION_NAME } from '../../models/Printer';
import { PRINTER_GROUP_COLLECTION_NAME } from '../../models/PrinterGroup';
import { PRINTER_GROUP_PRINTER_COLLECTION_NAME } from '../../models/PrinterGroupPrinter';
import { TABLE_PLAN_ELEMENT_COLLECTION_NAME } from '../../models/TablePlanElement';
import { Changes } from '../../services';
import { OrganizationService } from '../../services/organization';
import { PrinterService } from '../../services/printer';
import { ProductService } from '../../services/product';
import { TablePlanService } from '../../services/tablePlan';
import { fromClientChanges } from '../../utils/sync';
import { AuthorizedRequest } from '../middlewares/extendAuthorize';

type SyncRequest = Request & { body: { lastPulledAt: Date; changes: Changes } };

export default (app: Router) => {
    const route = Router();
    app.use('/sync', route);

    route.get('/', async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const logger = Container.get('logger') as LoggerService;
        const {
            item: itemService,
            modifier: modifierService,
            category: categoryService,
            discount: discountService,
            priceGroup: priceGroupService,
        } = Container.get('productService') as ProductService;
        const printerService = Container.get('printerService') as PrinterService;
        const organizationService = Container.get('organizationService') as OrganizationService;
        const tablePlanService = Container.get('tablePlanService') as TablePlanService;

        const { lastPulledAt: lastPulledAtUnix, schemaVersion, migration = null } = req.query;

        logger.info('Sync pull requested', {
            organizationId: req.organizationId,
            userId: req.userId,
            lastPulledAtUnix,
            schemaVersion,
            hasMigration: migration !== null,
        });

        try {
            const lastPulledAt = lastPulledAtUnix ? fromUnixTime(lastPulledAtUnix) : null;

            logger.info('Sync pull: categories start', { organizationId: req.organizationId });
            const categoryChanges = await categoryService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: categories complete', { organizationId: req.organizationId });

            logger.info('Sync pull: items start', { organizationId: req.organizationId });
            const itemChanges = await itemService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: items complete', { organizationId: req.organizationId });

            logger.info('Sync pull: modifiers start', { organizationId: req.organizationId });
            const modifierChanges = await modifierService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: modifiers complete', { organizationId: req.organizationId });

            logger.info('Sync pull: discounts start', { organizationId: req.organizationId });
            const discountChanges = await discountService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: discounts complete', { organizationId: req.organizationId });

            logger.info('Sync pull: price groups start', { organizationId: req.organizationId });
            const priceGroupChanges = await priceGroupService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: price groups complete', { organizationId: req.organizationId });

            logger.info('Sync pull: printers start', { organizationId: req.organizationId });
            const printerChanges = await printerService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: printers complete', { organizationId: req.organizationId });

            logger.info('Sync pull: organization start', { organizationId: req.organizationId });
            const organizationChanges = await organizationService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: organization complete', { organizationId: req.organizationId });

            logger.info('Sync pull: table plan start', { organizationId: req.organizationId });
            const tablePlanChanges = await tablePlanService.pullChanges({ lastPulledAt, schemaVersion, migration });
            logger.info('Sync pull: table plan complete', { organizationId: req.organizationId });

            const changes = {
                ...itemChanges,
                ...modifierChanges,
                ...categoryChanges,
                ...discountChanges,
                ...priceGroupChanges,
                ...printerChanges,
                ...organizationChanges,
                ...tablePlanChanges,
            };
            const timestamp = getUnixTime(new Date());
            logger.info('Sync pull completed', {
                organizationId: req.organizationId,
                timestamp,
                changeCollections: Object.keys(changes),
            });
            return res.status(200).json({ changes, timestamp });
        } catch (error) {
            logger.error('Sync pull failed', {
                organizationId: req.organizationId,
                userId: req.userId,
                lastPulledAtUnix,
                schemaVersion,
                error,
            });
            return res.status(500).json({ success: false, error: 'Sync pull failed' });
        }
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
        const organizationService = Container.get('organizationService') as OrganizationService;
        const tablePlanService = Container.get('tablePlanService') as TablePlanService;

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
                    changes: {
                        ...deconstructChanges(changes, PRINTER_COLLECTION_NAME),
                        ...deconstructChanges(changes, PRINTER_GROUP_COLLECTION_NAME),
                        ...deconstructChanges(changes, PRINTER_GROUP_PRINTER_COLLECTION_NAME),
                        ...deconstructChanges(changes, PRINT_CATEGORY_COLLECTION_NAME),
                    },
                }),
                organizationService.pushChanges({
                    lastPulledAt,
                    changes: {
                        ...deconstructChanges(changes, ORGANIZATION_COLLECTION_NAME),
                        ...deconstructChanges(changes, PAYMENT_TYPE_COLLECTION_NAME),
                    },
                }),
                tablePlanService.pushChanges({
                    lastPulledAt,
                    changes: deconstructChanges(changes, TABLE_PLAN_ELEMENT_COLLECTION_NAME),
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
