/* eslint no-console: 0 */

import AnalyticsRequest from './AnalyticsRequest';

/**
 * @private
 * @description
 * AnalyticsRequest properties mixin function
 *
 * @param {*} base The base class to mix onto
 * @return {module:analytics.AnalyticsRequestPropertiesMixin} The mixin class
 */
const AnalyticsRequestPropertiesMixin = base =>
    /**
     * @private
     * @description
     * AnalyticsRequest properties mixin
     *
     * @alias module:analytics.AnalyticsRequestPropertiesMixin
     */
    class extends base {
        /**
         * Sets the URL path for the request.
         * It appends the given path to the request's URL.
         *
         * @param {!String} path The path of the response
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withPath('aggregate');
         */
        withPath(path) {
            if (path) {
                this.path = path;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Sets the response format for the request.
         * It appends the file extension to the request's path.
         *
         * @param {String} [format=json] The format of the response
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withFormat('xml');
         */
        withFormat(format = 'json') {
            this.format = format;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the aggregationType query parameter to the request.
         *
         * @param {String} aggregationType The aggregationType value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withAggregationType('SUM');
         */
        withAggregationType(value) {
            const aggregationType = value.toUpperCase();

            const aggregationTypes = new Set([
                'AVERAGE',
                'AVERAGE_SUM_ORG_UNIT',
                'COUNT',
                'LAST',
                'LAST_AVERAGE_ORG_UNIT',
                'MIN',
                'MAX',
                'STDDEV',
                'SUM',
                'VARIANCE',
            ]);

            if (aggregationTypes.has(aggregationType)) {
                this.parameters.aggregationType = aggregationType;
            } else {
                console.warn(`d2.analytics.request.withAggregationType(): "${value}" not listed as possible value`);
                this.parameters.aggregationType = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the measureCriteria query parameter to the request.
         *
         * @param {!String} measureCriteria The measureCriteria value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withMeasureCriteria('GE:10;LT:50');
         */
        withMeasureCriteria(criteria) {
            if (criteria) {
                this.parameters.measureCriteria = criteria;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the preAggregationMeasureCriteria query parameter to the request.
         *
         * @param {!String} preAggregationMeasureCriteria The preAggregationMeasureCriteria value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withPreAggregationMeasureCriteria('GE:10;LT:50');
         */
        withPreAggregationMeasureCriteria(criteria) {
            if (criteria) {
                this.parameters.preAggregationMeasureCriteria = criteria;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the skipMeta query parameter to the request.
         *
         * @param {Boolean} [skipMeta=true] The skipMeta value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withSkipMeta();
         */
        withSkipMeta(flag = true) {
            this.parameters.skipMeta = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the skipData query parameter to the request.
         *
         * @param {Boolean} [skipData=true] The skipData value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withSkipData();
         */
        withSkipData(flag = true) {
            this.parameters.skipData = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the hierarchyMeta query parameter to the request.
         *
         * @param {Boolean} [hierarchyMeta=true] The hierarchyMeta value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withHierarchyMeta();
         */
        withHierarchyMeta(flag = true) {
            this.parameters.hierarchyMeta = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the ignoreLimit query parameter to the request.
         *
         * @param {Boolean} [ignoreLimit=true] The ignoreLimit value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withIgnoreLimit();
         */
        withIgnoreLimit(flag = true) {
            this.parameters.ignoreLimit = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the tableLayout query parameter to the request.
         *
         * @param {Boolean} [tableLayout=true] The tableLayout value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withTableLayout();
         */
        withTableLayout(flag = true) {
            this.parameters.tableLayout = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the hideEmptyRows query parameter to the request.
         *
         * @param {Boolean} [hideEmptyRows=true] The hideEmptyRows value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withHideEmptyRows();
         */
        withHideEmptyRows(flag = true) {
            this.parameters.hideEmptyRows = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the hideEmptyColumns query parameter to the request.
         *
         * @param {Boolean} [hideEmptyColumns=true] The hideEmptyColumns value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withHideEmptyColumns();
         */
        withHideEmptyColumns(flag = true) {
            this.parameters.hideEmptyColumns = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the showHierarchy query parameter to the request.
         *
         * @param {Boolean} [showHierarchy=true] The showHierarchy value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withShowHierarchy();
         */
        withShowHierarchy(flag = true) {
            this.parameters.showHierarchy = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the includeNumDen query parameter to the request.
         *
         * @param {Boolean} [includeNumDen=true] The includeNumDen value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withIncludeNumDen();
         */
        withIncludeNumDen(flag = true) {
            this.parameters.includeNumDen = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the displayProperty query parameter to the request.
         *
         * @param {!String} displayProperty The displayProperty value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withDisplayProperty('SHORTNAME');
         */
        withDisplayProperty(value) {
            const displayProperty = value.toUpperCase();

            const displayProperties = new Set([
                'NAME',
                'SHORTNAME',
            ]);

            if (displayProperties.has(displayProperty)) {
                this.parameters.displayProperty = displayProperty;
            } else {
                console.warn(`d2.analytics.request.withDisplayProperty(): "${value}" not listed as possible value`);
                this.parameters.displayProperty = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the displayProperty query parameter to the request.
         *
         * @param {!String} displayProperty The displayProperty value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withDisplayProperty('SHORTNAME');
         */
        withOutputIdScheme(scheme) {
            if (scheme) {
                this.parameters.outputIdScheme = scheme;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the inputIdScheme query parameter to the request.
         *
         * @param {!String} inputIdScheme The inputIdScheme value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withInputIdScheme('CODE');
         */
        withInputIdScheme(scheme) {
            if (scheme) {
                this.parameters.inputIdScheme = scheme;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the approvalLevel query parameter to the request.
         *
         * @param {!String} approvalLevel The approvalLevel value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withApprovalLevel('');
         */
        withApprovalLevel(level) {
            if (level) {
                this.parameters.approvalLevel = level;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the relativePeriodDate query parameter to the request.
         *
         * @param {!String} relativePeriodDate The relativePeriodDate value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withRelativePeriodDate('LAST_12_MONTHS');
         */
        withRelativePeriodDate(date) {
            if (date) {
                this.parameters.relativePeriodDate = date;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the userOrgUnit query parameter to the request.
         *
         * @param {!String} userOrgUnit The userOrgUnit value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withUserOrgUnit('O6uvpzGd5pu');
         */
        withUserOrgUnit(orgUnit) {
            if (orgUnit) {
                this.parameters.userOrgUnit = orgUnit;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the columns query parameter to the request.
         *
         * @param {!String} columns The dimensions identifiers (separated by ;)
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withColumns('dx;ou');
         */
        withColumns(dimensions) {
            if (dimensions) {
                this.parameters.columns = dimensions;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the rows query parameter to the request.
         *
         * @param {!String} rows The dimensions identifiers (separated by ;)
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withRows('pe');
         */
        withRows(dimensions) {
            if (dimensions) {
                this.parameters.rows = dimensions;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the startDate query parameter to the request.
         *
         * @param {!String} startDate The startDate value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withStartDate('2017-11-28');
         */
        withStartDate(date) {
            if (date) {
                this.parameters.startDate = date;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the endDate query parameter to the request.
         *
         * @param {!String} endDate The endDate value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withEndDate('2017-12-31');
         */
        withEndDate(date) {
            if (date) {
                this.parameters.endDate = date;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Sets the program for the request.
         * It appends the program id to the request's path.
         *
         * @param {!String} program The program id
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withProgram('eBAyeGv0exc');
         */
        withProgram(program) {
            if (program) {
                this.program = program;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the stage query parameter to the request.
         *
         * @param {!String} stage The stage value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withStage('Zj7UnCAulEk');
         */
        withStage(stage) {
            if (stage) {
                this.parameters.stage = stage;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the eventStatus query parameter to the request.
         *
         * @param {!String} eventStatus The eventStatus value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withEventStatus('COMPLETED');
         */
        withEventStatus(value) {
            const eventStatus = value.toUpperCase();

            const eventStatuses = new Set([
                'ACTIVE',
                'COMPLETED',
                'SCHEDULED',
                'OVERDUE',
                'SKIPPED',
            ]);

            if (eventStatuses.has(eventStatus)) {
                this.parameters.eventStatus = eventStatus;
            } else {
                console.warn(`d2.analytics.request.withEventStatus(): "${value}" not listed as possible value`);
                this.parameters.eventStatus = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the programStatus query parameter to the request.
         *
         * @param {!String} programStatus The programStatus value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withProgramStatus('COMPLETED');
         */
        withProgramStatus(value) {
            const programStatus = value.toUpperCase();

            const programStatuses = new Set([
                'ACTIVE',
                'COMPLETED',
                'CANCELLED',
            ]);

            if (programStatuses.has(programStatus)) {
                this.parameters.programStatus = programStatus;
            } else {
                console.warn(`d2.analytics.request.withProgramStatus(): "${value}" not listed as possible value`);
                this.parameters.programStatus = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the ouMode query parameter to the request.
         *
         * @param {!String} ouMode The ouMode value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withOuMode('CHILDREN');
         */
        withOuMode(value) {
            const ouMode = value.toUpperCase();

            const ouModes = new Set([
                'DESCENDANTS',
                'CHILDREN',
                'SELECTED',
            ]);

            if (ouModes.has(ouMode)) {
                this.parameters.ouMode = ouMode;
            } else {
                console.warn(`d2.analytics.request.withOuMode(): "${value}" not listed as possible value`);
                this.parameters.ouMode = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the asc query parameter to the request.
         *
         * @param {!String} value The dimensions to be sorted ascending
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withAsc('EVENTDATE');
         */
        withAsc(value) {
            if (value) {
                this.parameters.asc = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the desc query parameter to the request.
         *
         * @param {!String} value The dimensions to be sorted descending
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withDesc('OUNAME');
         */
        withDesc(value) {
            if (value) {
                this.parameters.desc = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the coordinatesOnly query parameter to the request.
         *
         * @param {Boolean} [coordinatesOnly=true] The coordinatesOnly value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withCoordinatesOnly();
         */
        withCoordinatesOnly(flag = true) {
            this.parameters.coordinatesOnly = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the page query parameter to the request.
         *
         * @param {!Number} [page=1] The page number
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withPage(2);
         */
        withPage(page = 1) {
            this.parameters.page = page;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the pageSize query parameter to the request.
         *
         * @param {!Number} [size=50] The number of items per page
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withPageSize(10);
         */
        withPageSize(size = 50) {
            this.parameters.pageSize = size;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the value query parameter to the request.
         *
         * @param {!String} value A data element or attribute identifier
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withValue('UXz7xuGCEhU');
         */
        withValue(value) {
            // must be a data element or attribute of numeric value type
            if (value) {
                this.parameters.value = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the sortOrder query parameter to the request.
         *
         * @param {!String} sortOrder The sortOrder value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withSortOrder('DESC');
         */
        withSortOrder(value) {
            const sortOrder = value.toUpperCase();

            const sortOrders = new Set([
                'ASC',
                'DESC',
            ]);

            if (sortOrders.has(sortOrder)) {
                this.parameters.sortOrder = sortOrder;
            } else {
                console.warn(`d2.analytics.request.withSortOrder(): "${value}" not listed as possible value`);
                this.parameters.sortOrder = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the limit query parameter to the request.
         *
         * @param {!Number} limit The maximum number of records to return
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withLimit('5000');
         */
        withLimit(value) {
            if (value) {
                const limit = (value > 10000) ? 10000 : value;

                this.parameters.limit = limit;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the outputType query parameter to the request.
         *
         * @param {!String} outputType The output type
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withOutputType('ENROLLMENT');
         */
        withOutputType(value) {
            const type = value.toUpperCase();

            const outputTypes = new Set([
                'EVENT',
                'ENROLLMENT',
                'TRACKED_ENTITY_INSTANCE',
            ]);

            if (outputTypes.has(type)) {
                this.parameters.outputType = type;
            } else {
                console.warn(`d2.analytics.request.withOutputType(): "${value}" not listed as possible value`);
                this.parameters.outputType = value;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the collapseDataDimensions query parameter to the request.
         *
         * @param {Boolean} [collapseDataDimensions=true] The collapseDataDimensions value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withCollapseDataDimensions();
         */
        withCollapseDataDimensions(flag = true) {
            this.parameters.collapseDataDimensions = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the skipRounding query parameter to the request.
         *
         * @param {Boolean} [skipRounding=true] The skipRounding value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withSkipRounding();
         */
        withSkipRounding(flag = true) {
            this.parameters.skipRounding = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the aggregateData query parameter to the request.
         *
         * @param {Boolean} [aggregateData=true] The aggregateData value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withAggregateData();
         */
        withAggregateData(flag = true) {
            this.parameters.aggregateData = flag;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the clusterSize query parameter to the request.
         *
         * @param {!Number} clusterSize The size of cluster in meters
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withClusterSize(1000);
         */
        withClusterSize(size) {
            if (size) {
                this.parameters.clusterSize = size;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the coordinateField query parameter to the request.
         *
         * @param {!String} [coordinateField=EVENT] The field to base geospatial event analytics on
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withCoordinateField('<attribute-id>');
         */
        withCoordinateField(field = 'EVENT') {
            // EVENT, <attribute-id>, <dataelement-id>
            this.parameters.coordinateField = field;
            return new AnalyticsRequest(this);
        }

        /**
         * Adds the bbox query parameter to the request.
         *
         * @param {!String} bbox The bounding box coordinates in the format "min lng, min lat, max lng, max lat"
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withBbox('11.1768827285209, 60.141691309755, 11.1694071634997, 60.287796722512');
         */
        withBbox(bbox) {
            if (bbox) {
                this.parameters.bbox = bbox;
            }

            return new AnalyticsRequest(this);
        }

        /**
         * Adds the includeClusterPoints query parameter to the request.
         *
         * @param {Boolean} [includeClusterPoints=true] The includeClusterPoints value
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .withIncludeClusterPoints();
         */
        withIncludeClusterPoints(flag = true) {
            this.parameters.includeClusterPoints = flag;
            return new AnalyticsRequest(this);
        }
    };

export default AnalyticsRequestPropertiesMixin;
