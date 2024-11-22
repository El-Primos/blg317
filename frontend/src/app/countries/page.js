'use client';

import styles from './page.module.css';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';


function Countries() {
    const router = useRouter();
    const [countries, setCountries] = useState([]);
    const [teamCounts, setTeamCounts] = useState([]); // Correct state definition
    const [playerCounts, setPlayerCounts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [tempText, setTempText] = useState('');
    const [searchText, setSearchText] = useState('');

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleInputChange = (event) => {
        setTempText(event.target.value);
    };

    const searchFlags = () => {
        setCurrentPage(1);
        setSearchText(tempText.trim());
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/countries?page=${currentPage}&name=${searchText}`)
            .then((response) => response.json())
            .then((data) => {
                setTotalPages(data.total_pages);
                setCountries(data.countries);
            })
            .catch((error) => console.log(error));
    }, [currentPage, searchText]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/numberOfTeams')
            .then((response) => response.json())
            .then((data) => {
                //console.log(data); // Debugging
                setTeamCounts(data.numberOfTeams);
            }) 
            .catch((error) => console.log(error));
    }, []);

    const getTeamCount = (countryId) => {
        const countryData = teamCounts.find((team) => team.country_id === countryId);
        return countryData ? countryData.team_count : 0;
    };

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/numberOfPlayers')
            .then((response) => response.json())
            .then((data) => {
                //console.log(data); // Debugging
                setPlayerCounts(data.numberOfPlayers);
            }) 
            .catch((error) => console.log(error));
    }, []);

    const getPlayerCount = (countryId) => {
        const countryData = playerCounts.find((player) => player.country_id === countryId);
        return countryData ? countryData.player_count : 0; 
        //return countryData?.player_count ?? -1;
    };

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className='grid mt-1 mx-auto w-10 bg-primary-reverse'>
                    <div className='col-2'>
                        <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.replace('/');
                        }}
                        label='Home'
                    > </Button>  
                    </div>
                    <div className='col-8'>
                        <div className="text-center p-3 border-round-sm  font-bold">COUNTRIES</div>  
                    </div>
                    <div className='col-2'></div>
                </div>
                <div className={styles.search_bar}>
                    <input
                        type="text"
                        name="query"
                        placeholder="Search..."
                        value={`${tempText}`}
                        onChange={handleInputChange}
                    ></input>
                    <img
                        className={styles.search_icon}
                        src="/search-icon.png"
                        alt="search icon"
                        onClick={searchFlags}
                    ></img>
                </div>
            </div>
            <div className={styles.flag_grid}>
                {countries.map((country, index) => (
                    <div className={styles.flag_card} key={index}>
                        <img
                            src={country.flag_link}
                            alt={`Flag of ${country.name}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    'https://image.milimaj.com/i/milliyet/75/869x477/5c8d865a45d2a05010d80795.jpg';
                            }}
                        />
                        <p>{country.name}</p>
                        <div className={styles.country_info}>
                            <div className={styles.icon_container}>
                                <span>{getTeamCount(country.country_id)}</span>
                                <img src="/default_team.png" alt="Team Icon" className={styles.iconSize} />
                            </div>
    
                            <div className={styles.icon_container}>
                                <img src="/default_player.png" alt="Player Icon" className={styles.iconSize} />  
                                <span>{getPlayerCount(country.country_id)}</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button disabled={currentPage === 1} onClick={handlePreviousClick}>
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageClick(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button className={styles.button} disabled={currentPage === totalPages} onClick={handleNextClick}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Countries;
