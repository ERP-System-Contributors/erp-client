package io.github.erp.internal.service;

/*-
 *  Server - Leases and assets management platform
 * Copyright © 2021 Edwin Njeru (mailnjeru@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import io.github.jhipster.service.filter.StringFilter;
import io.github.erp.internal.framework.service.DeletionUploadService;
import io.github.erp.service.FixedAssetNetBookValueQueryService;
import io.github.erp.service.FileUploadService;
import io.github.erp.service.dto.FixedAssetNetBookValueCriteria;
import io.github.erp.service.dto.FixedAssetNetBookValueDTO;
import io.github.erp.service.dto.FileUploadDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("fixedAssetNetBookValueDeletionFileUploadService")
public class FixedAssetNetBookValueDeletionFileUploadService  implements DeletionUploadService<FixedAssetNetBookValueDTO> {

    private final FileUploadService FileUploadService;
    private final FixedAssetNetBookValueQueryService fixedAssetNetBookValueQueryService;

    public FixedAssetNetBookValueDeletionFileUploadService(FileUploadService FileUploadService, FixedAssetNetBookValueQueryService fixedAssetNetBookValueQueryService) {
        this.FileUploadService = FileUploadService;
        this.fixedAssetNetBookValueQueryService = fixedAssetNetBookValueQueryService;
    }

    @Override
    public Optional<FileUploadDTO> findOne(long fileId) {
        return FileUploadService.findOne(fileId);
    }

    @Override
    public Optional<List<FixedAssetNetBookValueDTO>> findAllByUploadToken(String stringToken) {
        var criteria = new FixedAssetNetBookValueCriteria();
        StringFilter uploadToken = new StringFilter();
        uploadToken.setEquals(stringToken);
        criteria.setFileUploadToken(uploadToken);
        return Optional.of(fixedAssetNetBookValueQueryService.findByCriteria(criteria));
    }
}