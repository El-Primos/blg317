import React, { useState, useEffect, useRef, Fragment } from 'react';
import TeamModal from '@/components/modals/TeamModal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FilterOperator, FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import lazyLoad from '@/lib/lazyLoadFilters';

export default function TeamTable() {
    const toast = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [data, setData] = useState([]);
    const [filters, setFilters] = useState(null);
    const [lazyFilters, setLazyFilters] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    const [modalType, setModalType] = useState('');

    const [deleteItemModalVisible, setDeleteItemModalVisible] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
    const [itemToDelete, setItemToDelete] = useState('');

    useEffect(() => {
        setData([]);

        const queries = lazyFilters ? lazyLoad(lazyFilters) : {};

        fetch(`http://127.0.0.1:5000/api/admin/teams?page=${currentPage}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...queries }),
        })
            .then((response) => response.json())
            .then((data) => {
                setTotalRecords(data.totalTeams);
                setData(data.teams);
            })
            .catch((error) => console.log(error));
    }, [currentPage, limit, lazyFilters]);

    useEffect(() => {
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            team_id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            nickname: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            abbreviation: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            owner: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            general_manager: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            headcoach: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            city_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            arena_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            year_founded: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
        });
        setLazyFilters({
            team_id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            nickname: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            abbreviation: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            owner: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            general_manager: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            headcoach: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            city_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            arena_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            year_founded: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
        });
    };

    const clearFilter = () => {
        initFilters();
    };

    const deleteTeam = (team_id) => () => {
        fetch(`http://127.0.0.1:5000/api/admin/teams/${team_id}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
                else toast.current.show({ severity: 'error', summary: 'Error', detail: data.error, life: 3000 });
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setDeleteButtonDisabled(true);
                setDeleteItemModalVisible(false);
            });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <Button
                    className="mr-6"
                    icon="pi pi-plus"
                    label="Add Team"
                    outlined
                    onClick={() => {
                        setModalType('add');
                        setModalVisible(true);
                    }}
                />
                <Button className="mr-6" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            </div>
        );
    };

    const dataTablePaginatorTamplate = {
        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
        FirstPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-double-left"></span>
                </button>
            );
        },
        PrevPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-left"></span>
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-right"></span>
                </button>
            );
        },
        LastPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-double-right"></span>
                </button>
            );
        },
        PageLinks: (options) => {
            if (
                (options.view.startPage === options.page && options.view.startPage !== 0) ||
                (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
            ) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                </button>
            );
        },
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: '10', value: 10 },
                { label: '25', value: 25 },
                { label: '50', value: 50 },
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3">
                    {'Go to'}
                    <InputText
                        size="2"
                        className="ml-1"
                        value={reportPage}
                        disabled={options?.totalPages?.length === 0 || !options.totalPages}
                        onKeyDown={(e) => onPageInputKeyDown(e, options)}
                        onChange={(e) => setReportPage(e.target.value)}
                    />
                    {options?.totalRecords !== 0 ? (
                        <span className="mx-2">{`${options?.currentPage} / ${options?.totalPages}`}</span>
                    ) : (
                        ''
                    )}
                </span>
            );
        },
    };

    const actionsTemplate = (options) => {
        return (
            <div className="flex flex-row">
                <span
                    className="pi pi-pen-to-square mx-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        const links = data
                            .filter((team) => team.team_id === options.team_id)
                            .map((team) => ({
                                facebook: team.facebook,
                                instagram: team.instagram,
                                twitter: team.twitter,
                                logo_url: team.logo_url,
                            }));

                        setModalType('edit');
                        setModalData({ ...options, ...links[0] });
                        setModalVisible(true);
                    }}
                ></span>
                <span
                    className="pi pi-trash mx-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setItemToDelete(options);
                        setDeleteItemModalVisible(true);
                    }}
                ></span>
            </div>
        );
    };

    const deleteItemDialogFooter = (
        <Fragment>
            <div className="flex justify-content-center">
                <InputText
                    type="text"
                    onChange={(e) => {
                        if (itemToDelete.name === e.target.value) setDeleteButtonDisabled(false);
                        else setDeleteButtonDisabled(true);
                    }}
                    className="p-inputtext-lg p-d-block mb-5 col-10 text-center p-invalid"
                    placeholder="Type item name to confirm delete"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !deleteButtonDisabled) {
                            deleteTeam(itemToDelete.team_id);
                        }
                    }}
                />
            </div>
            <div className="flex justify-content-center">
                <Button
                    label="No"
                    icon="pi pi-times"
                    className="p-button-danger delete-button-no w-3"
                    onClick={() => setDeleteItemModalVisible(false)}
                />
                <Button
                    label="Yes"
                    disabled={deleteButtonDisabled}
                    icon="pi pi-check"
                    className="p-button-danger delete-button-yes w-3"
                    onClick={deleteTeam(itemToDelete.team_id)}
                />
            </div>
        </Fragment>
    );

    const onPageInputKeyDown = (event, options) => {
        if (event.key === 'Enter') {
            const page = parseInt(reportPage);
            if (page < 1 || page > options.totalPages) {
                console.log('page out of bounds');
            } else {
                const first = page ? options.rows * (page - 1) : 0;
                setCurrentPage(reportPage);
                setFirstIndex(first);
            }
        }
    };

    const onFilter = (e) => {
        const _filters = e.filters;
        setFilters(_filters);
        setLazyFilters(
            Object.keys(_filters).reduce((acc, filterKey) => {
                const lazyFilterValue = lazyFilters[filterKey] || {};
                acc[filterKey] = {
                    ..._filters[filterKey],
                    type: lazyFilterValue?.type,
                };
                return acc;
            }, {}),
        );
    };

    return (
        <div className="datatable-wrapper mt-5">
            <DataTable
                header={renderHeader}
                className="datatable"
                value={data}
                filters={filters}
                onFilter={(e) => onFilter(e)}
                lazy
                paginator
                paginatorTemplate={dataTablePaginatorTamplate}
                page={currentPage}
                first={firstIndex}
                rows={limit}
                totalRecords={totalRecords}
                rowsPerPageOptions={[10, 25, 50]}
                onPage={(e) => {
                    setLimit(e.rows);
                    setFirstIndex(e.first);
                    setReportPage(e.page + 1);
                    setCurrentPage(e.page + 1);
                }}
                size="small"
                scrollable
                scrollHeight="60vh"
                stripedRows
            >
                <Column field="team_id" filter dataType="numeric" header="#"></Column>
                <Column field="name" filter header="Team Name"></Column>
                <Column field="nickname" filter header="Nickname"></Column>
                <Column field="abbreviation" filter header="Abrv"></Column>
                <Column field="owner" filter header="Owner"></Column>
                <Column field="general_manager" filter header="General Manager"></Column>
                <Column field="headcoach" filter header="Headcoach"></Column>
                <Column field="city_name" filter header="City Name"></Column>
                <Column field="arena_name" filter header="Arena Name"></Column>
                <Column field="year_founded" filter dataType="numeric" header="Founded Year"></Column>
                <Column body={(rowData) => actionsTemplate(rowData)}></Column>
            </DataTable>
            <TeamModal
                {...(modalType === 'edit' ? modalData : {})}
                visible={modalVisible}
                setVisible={setModalVisible}
                type={modalType}
            />
            <Dialog
                visible={deleteItemModalVisible}
                style={{ width: '40rem' }}
                modal
                closable={false}
                footer={deleteItemDialogFooter}
                onHide={() => setDeleteItemModalVisible(false)}
            >
                <div className="flex align-items-center justify-content-center text-xl">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'tomato' }} />
                    {itemToDelete && (
                        <span>
                            {'To delete item, please type the name' + ' '}
                            <b>{itemToDelete.name}</b>
                        </span>
                    )}
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
}
