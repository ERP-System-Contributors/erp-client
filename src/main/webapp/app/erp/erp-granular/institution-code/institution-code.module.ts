///
/// Erp System - Mark X No 6 (Jehoiada Series) Client 1.7.4
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
import { InstitutionCodeComponent } from './list/institution-code.component';
import { InstitutionCodeDetailComponent } from './detail/institution-code-detail.component';
import { InstitutionCodeUpdateComponent } from './update/institution-code-update.component';
import { InstitutionCodeDeleteDialogComponent } from './delete/institution-code-delete-dialog.component';
import { InstitutionCodeRoutingModule } from './route/institution-code-routing.module';

@NgModule({
  imports: [SharedModule, InstitutionCodeRoutingModule],
  declarations: [
    InstitutionCodeComponent,
    InstitutionCodeDetailComponent,
    InstitutionCodeUpdateComponent,
    InstitutionCodeDeleteDialogComponent,
  ],
  entryComponents: [InstitutionCodeDeleteDialogComponent],
})
export class InstitutionCodeModule {}
