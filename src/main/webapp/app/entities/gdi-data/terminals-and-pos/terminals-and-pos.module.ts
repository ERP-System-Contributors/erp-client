///
/// Erp System - Mark IX No 3 (Iddo Series) Client 1.6.4
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
import { SharedModule } from 'app/shared/shared.module';
import { TerminalsAndPOSComponent } from './list/terminals-and-pos.component';
import { TerminalsAndPOSDetailComponent } from './detail/terminals-and-pos-detail.component';
import { TerminalsAndPOSUpdateComponent } from './update/terminals-and-pos-update.component';
import { TerminalsAndPOSDeleteDialogComponent } from './delete/terminals-and-pos-delete-dialog.component';
import { TerminalsAndPOSRoutingModule } from './route/terminals-and-pos-routing.module';

@NgModule({
  imports: [SharedModule, TerminalsAndPOSRoutingModule],
  declarations: [
    TerminalsAndPOSComponent,
    TerminalsAndPOSDetailComponent,
    TerminalsAndPOSUpdateComponent,
    TerminalsAndPOSDeleteDialogComponent,
  ],
  entryComponents: [TerminalsAndPOSDeleteDialogComponent],
})
export class TerminalsAndPOSModule {}
