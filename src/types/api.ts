export interface Vinyl {
    id: number;
    name: string;
    author: string;
    description: string | null;
    price: number | string;
    image: string | null;
    reviews?: Review[];
}

export interface Review {
    id: number;
    content: string;
    score: number;
    userId: number;
    vinylId: number;
    createdAt: string;
    user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
}

export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole | string;
    birthdate: string | null;
    avatar: string | null;
    reviews?: Review[];
    purchases?: Purchase[];
}

export interface Purchase {
    id: number;
    userId: number;
    vinylId: number;
    amount: number | string;
    status: string;
    createdAt: string;
    vinyl?: Vinyl;
}

export interface LogEntry {
    id: number;
    action: string;
    timestamp: string;
}

export interface Paginated<T> {
    rows: T[];
    count: number;
}

export type VinylPage = Paginated<Vinyl>;

export interface CreateVinylInput {
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

export type UpdateVinylInput = Partial<CreateVinylInput>;

export interface CreateReviewInput {
    content: string;
    score: number;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    birthdate?: string;
    avatar?: string;
}

export interface SendVinylInput {
    name: string;
    link: string;
    price: number;
}

export interface DiscogsVinyl extends CreateVinylInput {
    score?: number | string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
}

export interface HealthResponse {
    service?: string;
    version?: string;
    status?: string;
}
