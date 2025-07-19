import { Routes } from '@angular/router';
import { userGuard } from './guard/user/user.guard';
import { adminGuard } from './guard/admin/admin.guard';

export const routes: Routes = [
    {
        path: 'home',  loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent)
    },
    {   path:'', redirectTo: 'home', pathMatch:'full' },
    
    {
        path: 'booking-list', loadComponent: () => import('./pages/bookings/booking-list/booking-list.component')
        .then(m => m.BookingListComponent), canActivate:[userGuard]
    },
    {
        path: 'booking-form', loadComponent: () => import('./pages/bookings/booking-form/booking-form.component')
        .then(m => m.BookingFormComponent), canActivate:[userGuard]
    },
    {
        path: 'vehicle-list', loadComponent: () => import('./pages/vehicles/vehicle-list/vehicle-list.component')
        .then(m => m.VehicleListComponent)
    },
    {
        path: 'vehicle-form', loadComponent: () => import('./pages/vehicles/vehicle-form/vehicle-form.component')
        .then(m => m.VehicleFormComponent), canActivate:[adminGuard]
    },
    {
        path: 'vehicle/{id}', loadComponent: () => import('./pages/vehicle-detail/vehicle-detail.component')
        .then(m => m.VehicleDetailComponent)
    },
    {
        path: 'maintenance-list', loadComponent: () => import('./pages/maintenance/maintenance-list/maintenance-list.component')
        .then(m => m.MaintenanceListComponent), canActivate:[adminGuard]
    },
    {
        path: 'maintenance-form', loadComponent: () => import('./pages/maintenance/maintenance-form/maintenance-form.component')
        .then(m => m.MaintenanceFormComponent), canActivate:[adminGuard]
    },
    {
        path: 'aboutus', loadComponent: () => import('./pages/about-us/about-us.component')
        .then(m => m.AboutUsComponent)
    }
];
