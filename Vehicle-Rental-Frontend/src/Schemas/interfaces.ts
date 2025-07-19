export interface User{
    id?: string
    name: string
    email: string
    address: string
    role: "admin" | "customer"
    created_at?: string
}

export interface Vehicle{
    id?: string
    model: string
    type: string
    next_maintenance?: string
    last_maintenance?: string
    rental_rate: number
    license_plate_no: string
    location: string
    description?: string
    status: string
<<<<<<< HEAD
    imageUrl?: string
    range?: number
    gearType?: "automatic" | "manual"
=======
>>>>>>> 42042e656aa8ede617cf0e991dd29787822006d6
}

export interface Booking{
    id?: string
    user_id: string
    vehicle_id: string
    vehicle_name: string
    start_date: string
    end_date: string
    status: string
    total_amount?: number
}

export interface Maintenance{
    id?: string
    maintenance_date: string
    vehicle_id: string
    description: string
    status: string
    cost?: number
}