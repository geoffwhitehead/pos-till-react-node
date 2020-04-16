// import requestStorage from 'cls-hooked';
import cls from 'cls-hooked';

const ns = cls.createNamespace('request');

export { ns };

export const getTenantId = (): string => ns.get('tenantId');

export const setTenantId = (tenantId: string): void => ns.set('tenantId', tenantId);
