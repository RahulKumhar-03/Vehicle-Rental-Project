import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './services/auth/auth.service';

export const routes: Routes = [
    {
        path: 'home',  loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent)
    },
    {   path:'', redirectTo: 'home', pathMatch:'full' },
    
    {
        path: 'booking-list', canActivate:[authGuard()], loadComponent: () => import('./pages/bookings/booking-list/booking-list.component')
        .then(m => m.BookingListComponent)
    },
    {
        path: 'booking-form', canActivate:[authGuard()], loadComponent: () => import('./pages/bookings/booking-form/booking-form.component')
        .then(m => m.BookingFormComponent)
    },
    {
        path: 'vehicle-list', loadComponent: () => import('./pages/vehicles/vehicle-list/vehicle-list.component')
        .then(m => m.VehicleListComponent)
    },
    {
        path: 'vehicle-form', canActivate:[adminGuard()], loadComponent: () => import('./pages/vehicles/vehicle-form/vehicle-form.component')
        .then(m => m.VehicleFormComponent)
    },
    {
        path: 'vehicle/{id}', loadComponent: () => import('./pages/vehicle-detail/vehicle-detail.component')
        .then(m => m.VehicleDetailComponent)
    },
    {
        path: 'maintenance-list', canActivate:[adminGuard()], loadComponent: () => import('./pages/maintenance/maintenance-list/maintenance-list.component')
        .then(m => m.MaintenanceListComponent)
    },
    {
        path: 'maintenance-form', canActivate:[adminGuard()], loadComponent: () => import('./pages/maintenance/maintenance-form/maintenance-form.component')
        .then(m => m.MaintenanceFormComponent)
    },
    {
        path: 'aboutus', loadComponent: () => import('./pages/about-us/about-us.component')
        .then(m => m.AboutUsComponent)
    }
];
