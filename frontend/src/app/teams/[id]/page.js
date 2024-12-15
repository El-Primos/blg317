'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Image } from 'primereact/image';

export default function TeamInfo({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [teamRoster, setTeamRoster] = useState([]);
    const [teamInfo, setTeamInfo] = useState([]);
    const [last5Games, setLast5Games] = useState([]);
    useEffect(() => {
        setTeamRoster([]);
        setTeamInfo([]);
        fetch(`http://127.0.0.1:5000/api/teams/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setTeamRoster(data.activeRoster);
                setTeamInfo(data.teamInfo[0]);
                setLast5Games(data.last5Games);
            })
            .catch((error) => console.log(error));
    }, [id]);
    return (
        <div className="w-screen">
            <div className="w-screen">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-2 md:col-1">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/teams');
                            }}
                            icon="pi pi-angle-left"
                        >
                            {''}
                        </Button>
                    </div>
                    <div className="col-4 md:col-2">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        >
                            {' '}
                        </Button>
                    </div>
                    <div className="col-6 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">
                            {teamInfo.teamName?.toUpperCase()}
                        </div>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
            <div className="mt-4 w-10 mx-auto grid">
                <div className="col-12 lg:col-7">
                    <div className="flex w-full flex-wrap">
                        <div className="flex justify-content-center w-full">
                            <Image
                                src={teamInfo.logo}
                                alt={`Logo of ${teamInfo.teamName}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/null_team.png';
                                }}
                                width="250"
                            ></Image>
                        </div>
                        <div className="w-full text-center text-color">
                            {teamInfo.teamName}({teamInfo.foundedYear})
                        </div>
                        <div className="w-full grid text-center mt-2">
                            <div className="col-4 bg-primary-reverse text-weight-semibold">Owner</div>
                            <div className="col-7 col-offset-1 bg-primary-reverse">{teamInfo.owner}</div>
                        </div>
                        <div className="w-full grid text-center mt-2">
                            <div className="col-4 bg-primary-reverse text-weight-semibold">GM</div>
                            <div className="col-7 col-offset-1 bg-primary-reverse">{teamInfo.generalMan}</div>
                        </div>
                        <div className="w-full grid text-center mt-2">
                            <div className="col-4 bg-primary-reverse text-weight-semibold">Arena</div>
                            <div className="col-7 col-offset-1 bg-primary-reverse">{teamInfo.arenaName}</div>
                        </div>
                        <div className="w-full grid text-center mt-2">
                            <div className="col-4 bg-primary-reverse text-weight-semibold">Location</div>
                            <div className="col-7 col-offset-1 bg-primary-reverse">
                                {teamInfo.city}, {teamInfo.state}
                            </div>
                        </div>
                        <div className="w-full grid text-center mt-2">
                            <div className="col-4 bg-primary-reverse text-weight-semibold">Social Media Links</div>
                            <div className="col-7 col-offset-1 bg-primary-reverse flex justify-content-center">
                                <div className="w-4 flex justify-content-around">
                                    <i
                                        className="fa-brands fa-instagram"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => window.open(teamInfo.instagram, '_blank')}
                                    ></i>
                                    <i
                                        className="fa-brands fa-facebook"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => window.open(teamInfo.facebook, '_blank')}
                                    ></i>
                                    <i
                                        className="fa-brands fa-twitter"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => window.open(teamInfo.twitter, '_blank')}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-5">
                    {/* table */}
                    <div className="w-full text-center bg-primary-reverse font-semibold">Roster</div>
                    <DataTable 
                        value={teamRoster}
                        size="small" 
                        lazy 
                        stripedRows 
                        showGridlines
                        onRowClick={(rowData) => {
                            router.push(`/players/${rowData.data.playerID}`); 
                        }}>
                        <Column field="jerseyNumber" header="#"></Column>
                        <Column field="firstName" header="Name"></Column>
                        <Column field="lastName" header="Surname"></Column>
                        <Column field="position" header="Position"></Column>
                        <Column field="height" header="Height"></Column>
                    </DataTable>
                </div>
                <div className="col-12">
                    <div className="w-full text-center bg-primary-reverse font-semibold">
                        Last 5 Games of {teamInfo.teamName}
                    </div>
                    <DataTable
                        value={last5Games}
                        size="small"
                        stripedRows
                        showGridlines
                        style={{ textAlign: 'center' }}
                        onRowClick={(rowData) => {
                            router.push(`/games/${rowData.data.game_id}`); 
                        }}
                    >
                        <Column
                            field="date"
                            header="DATE"
                            headerStyle={{ textAlign: 'center' }}
                            style={{ textAlign: 'center' }}
                        ></Column>
                        <Column
                            field="home_team_name"
                            header="HOME"
                            headerStyle={{ textAlign: 'center' }}
                            style={{ textAlign: 'center' }}
                        ></Column>
                        <Column
                            field="match_score"
                            header="MATCH"
                            body={(rowData) => `${rowData.home_team_score} - ${rowData.away_team_score}`}
                            headerStyle={{ textAlign: 'center' }}
                            style={{ textAlign: 'center' }}
                        ></Column>
                        <Column
                            field="away_team_name"
                            header="AWAY"
                            headerStyle={{ textAlign: 'center' }}
                            style={{ textAlign: 'center' }}
                        ></Column>
                        <Column
                            field="official_name"
                            header="OFFICIAL"
                            headerStyle={{ textAlign: 'center' }}
                            style={{ textAlign: 'center' }}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
