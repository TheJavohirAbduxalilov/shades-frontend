import client from './client';
import { Shade } from '../types';

export interface ShadePayload {
  shadeTypeId: number | null;
  options: { optionTypeId: number; optionValueId: number }[];
  width: number | null;
  height: number | null;
  materialVariantId: number | null;
  installationIncluded: boolean;
  removalIncluded: boolean;
}

export interface PriceBreakdown {
  areaCalculation: string;
  basePriceCalculation: string;
  minPriceApplied: boolean;
}

export interface PriceCalculation {
  area: number;
  basePrice: number;
  minPrice: number;
  priceBeforeServices: number;
  installationPrice: number;
  removalPrice: number;
  totalPrice: number;
  breakdown?: PriceBreakdown;
}

export const createShade = async (windowId: string, payload: ShadePayload) => {
  const { data } = await client.post<Shade>('/api/windows/' + windowId + '/shades', payload);
  return data;
};

export const updateShade = async (shadeId: string, payload: ShadePayload) => {
  const { data } = await client.patch<Shade>('/api/shades/' + shadeId, payload);
  return data;
};

export const deleteShade = async (shadeId: string) => {
  const { data } = await client.delete('/api/shades/' + shadeId);
  return data;
};

export const calculatePrice = async (payload: ShadePayload) => {
  const { data } = await client.post<PriceCalculation>('/api/price/calculate', payload);
  return data;
};
