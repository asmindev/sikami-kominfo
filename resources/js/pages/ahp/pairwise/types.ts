export interface Criteria {
    id: number;
    name: string;
    code: string;
    order: number;
}

export interface PairwiseComparison {
    id?: number;
    criteria1_id: number;
    criteria2_id: number;
    comparison_value: number | string;
}

export interface PairwiseMatrixProps {
    criteria: Criteria[];
    initialComparisons: PairwiseComparison[];
}

export interface ScaleDescription {
    value: number;
    label: string;
    description: string;
    color: string;
}

export interface ConsistencyAlertState {
    cr: number;
    consistent: boolean;
}
