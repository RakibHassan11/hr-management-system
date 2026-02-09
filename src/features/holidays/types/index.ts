export interface Holiday {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    active: boolean;
    total_days?: number;
}
