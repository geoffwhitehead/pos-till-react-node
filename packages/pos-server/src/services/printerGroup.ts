import { InjectedDependencies } from '.';
import { RepositoryFns } from '../repositories/utils';
import { PrinterGroupProps } from '../models/PrinterGroup';

export type PrinterGroupService = RepositoryFns<PrinterGroupProps>;

export const printerGroupService = ({ repositories: { printerGroupRepository }, logger }: InjectedDependencies): PrinterGroupService =>
    printerGroupRepository;
