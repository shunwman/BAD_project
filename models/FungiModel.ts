export default class Fungi {
    id: number;
    scientific_name: string;
    common_name?: string;
    authority: string;
    synonym?: string;
    descriptions: string;
    habitat: string;
    local_distribution: string;
    isNative: boolean;
    edibility: string;
    edibility_source: string;
    created_at: Date;
    updated_at: Date;
}