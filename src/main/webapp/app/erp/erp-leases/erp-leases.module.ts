///
/// Erp System - Mark X No 5 (Jehoiada Series) Client 1.7.3
/// Copyright © 2021 - 2023 Edwin Njeru (mailnjeru@gmail.com)
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program. If not, see <http://www.gnu.org/licenses/>.
///

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: 'lease-contract',
          data: {
            pageTitle: 'ERP | leases',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./lease-contract/lease-contract.module').then(
              m => m.LeaseContractModule
            ),
        },
      {
          path: 'lease-model-metadata',
          data: {
            pageTitle: 'ERP | leases',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./lease-model-metadata/lease-model-metadata.module').then(
              m => m.LeaseModelMetadataModule
            ),
        },
        {
          path: 'lease-liability-schedule-item',
          data: {
            pageTitle: 'ERP | Schedule',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./lease-liability-schedule-item/lease-liability-schedule-item.module').then(
              m => m.LeaseLiabilityScheduleItemModule
            ),
        },
        {
          path: 'ifrs-16-lease-contract',
          data: {
            pageTitle: 'ERP | Lease Contract',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./ifrs-16-lease-contract/ifrs-16-lease-contract.module').then(
              m => m.IFRS16LeaseContractModule
            ),
        },
        {
          path: 'rou-model-metadata',
          data: {
            pageTitle: 'ERP | ROU Metadata',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-model-metadata/rou-model-metadata.module').then(
              m => m.RouModelMetadataModule
            ),
        },
        {
          path: 'rou-account-balance-report',
          data: {
            pageTitle: 'ERP | ROU A/C Balance',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-account-balance-report/rou-account-balance-report.module').then(
              m => m.RouAccountBalanceReportModule
            ),
        },
        {
          path: 'rou-account-balance-report-item',
          data: {
            pageTitle: 'ERP | ROU A/C Balance',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-account-balance-report-item/rou-account-balance-report-item.module').then(
              m => m.RouAccountBalanceReportItemModule
            ),
        },
        {
          path: 'rou-asset-list-report',
          data: {
            pageTitle: 'ERP | ROU Asset List Report',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-asset-list-report/rou-asset-list-report.module').then(
              m => m.RouAssetListReportModule
            ),
        },
        {
          path: 'rou-asset-list-report-item',
          data: {
            pageTitle: 'ERP | ROU Asset Items',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-asset-list-report-item/rou-asset-list-report-item.module').then(
              m => m.RouAssetListReportItemModule
            ),
        },
        {
          path: 'rou-asset-nbv-report',
          data: {
            pageTitle: 'ERP | ROU Asset NBV Report',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-asset-nbv-report/rou-asset-nbv-report.module').then(
              m => m.RouAssetNBVReportModule
            ),
        },
        {
          path: 'rou-asset-nbv-report-item',
          data: {
            pageTitle: 'ERP | ROU Asset NBV Items',
            authorities: ['ROLE_LEASE_MANAGER'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () =>
            import('./rou-asset-nbv-report-item/rou-asset-nbv-report-item.module').then(
              m => m.RouAssetNBVReportItemModule
            ),
        },
      ]
    )
  ]
})
export class ErpLeasesModule {
}
