// src/Types/customid.ts

export interface IDConfig {
  id: string;
  prefix: string;
  separator: string;
   digit: number;
  isActive: boolean;
}

export interface CustomIDStore {
  EMP: IDConfig[];
  DEP: IDConfig[];
}

export type IDCategory = "EMP" | "DEP";

export interface IDSectionProps {
  label: string;
  configLabel: string;
  category: IDCategory;
  items: IDConfig[];
  onAdd: (category: IDCategory, item: IDConfig) => void;
  onUpdate: (category: IDCategory, item: IDConfig) => void;
  onDelete: (category: IDCategory, id: string) => void;
  onActivate: (category: IDCategory, id: string) => void;
}

export interface EditModalProps {
  item: IDConfig;
  onSave: (updated: IDConfig) => void;
  onClose: () => void;
}

export interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}