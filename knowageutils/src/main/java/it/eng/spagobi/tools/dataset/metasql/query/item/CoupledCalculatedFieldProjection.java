/*
 * Knowage, Open Source Business Intelligence suite
 * Copyright (C) 2018 Engineering Ingegneria Informatica S.p.A.
 *
 * Knowage is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knowage is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

package it.eng.spagobi.tools.dataset.metasql.query.item;

import org.apache.log4j.Logger;

import it.eng.spagobi.tools.dataset.bo.IDataSet;
import it.eng.spagobi.tools.dataset.common.query.IAggregationFunction;

public class CoupledCalculatedFieldProjection extends Projection {

    private static final Logger logger = Logger.getLogger(CoupledCalculatedFieldProjection.class);

    private DataStoreCalculatedField aggregatedProjection;

    public CoupledCalculatedFieldProjection(IAggregationFunction aggregationFunction, DataStoreCalculatedField aggregatedProjection, IDataSet dataSet, String columnName, String alias) {
        super(aggregationFunction, dataSet, columnName, alias);
        this.aggregatedProjection = aggregatedProjection;
    }

    public DataStoreCalculatedField getAggregatedProjection() {
        return aggregatedProjection;
    }
}
