interface PaginationType<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];
}