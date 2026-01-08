export interface User {
  id: number;
  username: string;
  fullName: string;
  preferredLanguageCode: string;
}

export interface Order {
  id: number;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  notes: string | null;
  visitDate: string;
  status: 'new' | 'in_progress' | 'measured' | 'completed';
  statusName: string;
  windows: Window[];
  totalPrice?: number;
}

export interface Window {
  id: number;
  orderId: number;
  name: string;
  shade: Shade | null;
}

export interface Shade {
  id: number;
  windowId: number;
  shadeTypeId: number;
  shadeTypeName: string;
  width: number;
  height: number;
  materialVariantId: number;
  materialName: string;
  colorName: string;
  options: ShadeOptionValue[];
  installationIncluded: boolean;
  removalIncluded: boolean;
  area?: number;
  calculatedPrice?: number;
  totalPrice?: number;
}

export interface ShadeOptionValue {
  optionTypeId: number;
  optionTypeName: string;
  optionValueId: number;
  optionValueName: string;
}

export interface Catalog {
  shadeTypes: ShadeType[];
  materials: Material[];
  servicePrices: {
    installation: { price: number; name: string };
    removal: { price: number; name: string };
  };
}

export interface ShadeType {
  id: number;
  name: string;
  minPrice: number;
  optionTypes: OptionType[];
  materials: number[];
}

export interface OptionType {
  id: number;
  name: string;
  displayOrder: number;
  values: OptionValue[];
}

export interface OptionValue {
  id: number;
  name: string;
  displayOrder: number;
}

export interface Material {
  id: number;
  name: string;
  variants: MaterialVariant[];
}

export interface MaterialVariant {
  id: number;
  colorName: string;
  colorHex: string | null;
  pricePerSqm: number;
}
