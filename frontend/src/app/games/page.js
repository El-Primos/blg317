'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import classNames from 'classnames'; // Import classNames
import 'styles/styles.scss';  // Absolute path based on baseUrl

function Games() {
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [totalGames, setTotalGames] = useState(0);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState({
        team_id: '',
        start_date: null,
        end_date: null,
        official_name: '',
    });

    const [games, setGames] = useState([]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleDateChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        setCurrentPage(1);
        fetchGames();
    };

    const fetchGames = () => {
        const queryParams = new URLSearchParams({
            page: currentPage,
            limit: limit,
            ...(filters.team_id && { team_id: filters.team_id }),
            ...(filters.start_date && { start_date: filters.start_date.toISOString().split('T')[0] }),
            ...(filters.end_date && { end_date: filters.end_date.toISOString().split('T')[0] }),
            ...(filters.official_name && { official_name: filters.official_name }),
        });

        fetch(`http://127.0.0.1:5000/api/games?${queryParams.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setGames(data.games);
                setTotalGames(data.total_games);
            })
            .catch((error) => console.error('Error fetching games:', error));
    };

    useEffect(() => {
        fetchGames(); // Fetch games when filters or currentPage changes
    }, [currentPage, limit]); // This hook will run whenever filters or currentPage change

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
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

    return (
        <div className="container">
            <div className="top">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-4 md:col-2">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center"
                            onClick={() => router.replace('/')}
                            label="Home"
                        />
                    </div>
                    <div className="col-4 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">GAMES</div>
                    </div>
                    <div className="col-4 md:col-2"></div>
                </div>

                <div className="flex flex-column align-items-center mt-3">
                    <div className="flex justify-content-around" style={{ width: '80%' }}>
                        <div className="col-12 md:col-3">
                            <InputText
                                name="team_id"
                                placeholder="Team ID"
                                value={filters.team_id}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-12 md:col-3">
                            <Calendar
                                name="start_date"
                                placeholder="Start Date"
                                value={filters.start_date}
                                onChange={(e) => handleDateChange('start_date', e.value)}
                                showIcon
                            />
                        </div>
                        <div className="col-12 md:col-3">
                            <Calendar
                                name="end_date"
                                placeholder="End Date"
                                value={filters.end_date}
                                onChange={(e) => handleDateChange('end_date', e.value)}
                                showIcon
                            />
                        </div>
                        <div className="col-12 md:col-3">
                            <InputText
                                name="official_name"
                                placeholder="Official Name"
                                value={filters.official_name}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                    <Button className="mt-3 bg-primary" label="Apply Filters" onClick={applyFilters} />
                </div>
            </div>

            <div className="datatable-wrapper mt-5">
                <div className="w-full text-center bg-primary-reverse font-semibold">
                    {filters.team_id ? `Games for Team ${filters.team_id}` : 'All Games'}
                </div>
                <DataTable
                    className="datatable"
                    value={games}
                    lazy
                    paginator
                    paginatorTemplate={dataTablePaginatorTamplate}
                    page={currentPage}
                    first={firstIndex}
                    rows={limit}
                    totalRecords={totalGames}
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
                    showGridlines
                    style={{ textAlign: 'center' , cursor: 'pointer'}}
                    // need fix
                    onRowClick={(rowData) => {
                        console.log("rowData content:")
                        console.log(rowData);  
                        router.push(`/games/${rowData.data.game_id}`); 
                    }}
                >         
                    <Column
                        field="date"
                        header="DATE"
                        body={(rowData) => formatDate(rowData.date)}
                        headerStyle={{ textAlign: 'center' }}
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        field="home_team_name"
                        header="HOME"
                        headerStyle={{ textAlign: 'center' }}
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        field="match_score"
                        header="MATCH"
                        body={(rowData) => `${rowData.home_team_score} - ${rowData.away_team_score}`}
                        headerStyle={{ textAlign: 'center' }}
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        field="away_team_name"
                        header="AWAY"
                        headerStyle={{ textAlign: 'center' }}
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        field="official_name"
                        header="OFFICIAL"
                        headerStyle={{ textAlign: 'center' }}
                        style={{ textAlign: 'center' }}
                    />        
                </DataTable>
            </div>
        </div>
    );
}

export default Games;
