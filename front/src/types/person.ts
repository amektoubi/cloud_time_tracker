export interface IPersonCreate {
  readonly name: string;
  readonly age: number;
}

export interface IPersonUpdate {
  readonly name?: string;
  readonly age?: number;
}

export interface IPersonResponse {
  readonly id: string; // Changed from number to string (UUID)
  readonly name: string;
  readonly age: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface IPersonStatistics {
  readonly totalCount: number;
  readonly averageAge: number;
  readonly minAge: number;
  readonly maxAge: number;
}

export type PersonFormMode = 'create' | 'edit';

export interface IPersonFormData {
  name: string;
  age: number;
}
