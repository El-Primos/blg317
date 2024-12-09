const buildQueryString = (filterItem) => {
    const { matchMode, value } = filterItem;

    if (value) {
        switch (matchMode) {
            case 'startsWith':
                return {
                    value: `'${value}%'`,
                    operator: 'LIKE',
                };
            case 'contains':
                return {
                    value: `'%${value}%'`,
                    operator: 'LIKE',
                };
            case 'notContains':
                return {
                    value: `'%${value}%'`,
                    operator: 'NOT LIKE',
                };
            case 'endsWith':
                return {
                    value: `'%${value}'`,
                    operator: 'LIKE',
                };
            case 'equals':
                return {
                    value: `'${value}'`,
                    operator: 'LIKE',
                };
            case 'notEquals':
                return {
                    value: `'${value}'`,
                    operator: 'NOT LIKE',
                };
            default:
                return null;
        }
    }
    return null;
};

const buildQueryInteger = (filterItem) => {
    const { matchMode, value } = filterItem;

    if (value) {
        switch (matchMode) {
            case 'equals':
                return {
                    value: value,
                    operator: '=',
                };
            case 'notEquals':
                return {
                    value: value,
                    operator: '<>',
                };
            case 'lt':
                return {
                    value: value,
                    operator: '<',
                };
            case 'tle':
                return {
                    value: value,
                    operator: '<=',
                };
            case 'gt':
                return {
                    value: value,
                    operator: '>',
                };
            case 'gte':
                return {
                    value: value,
                    operator: '>=',
                };
            default:
                return null;
        }
    }
    return null;
};

const buildQueryDate = (filterItem) => {
    const { matchMode, value } = filterItem;
    if (value) {
        const date = new Date(value);
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedDate = yyyy + '-' + mm + '-' + dd;

        switch (matchMode) {
            case 'dateIs':
                return {
                    value: `'${formattedDate} 00:00:00'`,
                    operator: '=',
                };

            case 'dateIsNot':
                return {
                    value: `'${formattedDate} 00:00:00'`,
                    operator: '<>',
                };

            case 'dateBefore':
                return {
                    value: `'${formattedDate} 00:00:00'`,
                    operator: '<',
                };

            case 'dateAfter':
                return {
                    value: `'${formattedDate} 00:00:00'`,
                    operator: '>',
                };
            default:
                return null;
        }
    }
    return null;
};

export default function lazyLoad(filters) {
    const queries = {};

    Object.keys(filters).forEach((key, index) => {
        const filterKey = Object.keys(filters)[index];
        const value = filters[key];

        switch (value.type) {
            case 'String': {
                const constraints = value.constraints
                    .map((filterItem) => {
                        return buildQueryString(filterItem);
                    })
                    .filter((item) => item !== null);

                if (constraints.length) {
                    queries[filterKey] = {
                        operator: value.operator,
                        constraints: constraints,
                    };
                }
                break;
            }
            case 'Integer': {
                const constraints = value.constraints
                    .map((filterItem) => {
                        return buildQueryInteger(filterItem);
                    })
                    .filter((item) => item !== null);

                if (constraints.length) {
                    queries[filterKey] = {
                        operator: value.operator,
                        constraints: constraints,
                    };
                }
                break;
            }
            case 'Date': {
                const constraints = value.constraints
                    .map((filterItem) => {
                        return buildQueryDate(filterItem);
                    })
                    .filter((item) => item !== null);

                if (constraints.length) {
                    queries[filterKey] = {
                        operator: value.operator,
                        constraints: constraints,
                    };
                }
                break;
            }
        }
    });

    return queries;
}
