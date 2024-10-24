import React, { useContext, useState } from 'react';
import myContext from '../../context/data/myContext';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: 12,
        background: 'unset',
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

function Filter() {
    const context = useContext(myContext);
    const { mode, searchkey, setsearchkey, sliderlowervalue, setsliderlowervalue, slideruppervalue, setslideruppervalue, filterType, setFilterType, keyFilter, setKeyFilter, product } = context;

    const [rangeValue, setRangeValue] = useState([40, 200]);
    const [bpmDropdownOpen, setBpmDropdownOpen] = useState(false);

    const genre = [...new Set(product.map(item => item.genre))];
    const key = [...new Set(product.map(item => item.key))];

    const handleSliderChange = (event, newValue) => {
        setRangeValue(newValue);
        setsliderlowervalue(newValue[0]);
        setslideruppervalue(newValue[1]);
    };

    const toggleBpmDropdown = () => {
        setBpmDropdownOpen(!bpmDropdownOpen);
    };

    return (
        <div className="container mx-auto px-4 mt-6">
            <div className={`p-6 rounded-lg shadow-lg ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="relative mb-5">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.9 14.32l4.9 4.9a1 1 0 01-1.42 1.42l-4.9-4.9a7 7 0 111.42-1.42zm-6.9-6.82a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchkey}
                        onChange={(e) => setsearchkey(e.target.value)}
                        placeholder="Search tracks..."
                        className={`block w-full pl-10 pr-4 py-3 border rounded-md focus:ring focus:ring-opacity-50 text-sm ${mode === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-gray-500' : 'bg-gray-100 border-gray-300 focus:ring-indigo-500'}`}
                    />
                </div>

                <div className="flex items-center justify-between mb-6">
                    <p className="font-medium text-lg">Filters</p>
                    <button
                        onClick={() => {
                            setsearchkey("");
                            setFilterType('');
                            setKeyFilter('');
                            setRangeValue([40, 200]);
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${mode === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                        Reset Filter
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {/* Genre Dropdown */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Genre</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md focus:outline-none transition-all duration-200 ${mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' : 'bg-gray-100 border-gray-300 focus:ring-indigo-500 text-gray-900 hover:bg-gray-200'}`}
                        >
                            <option value="">All Genres</option>
                            {genre.map((g, index) => (
                                <option key={index} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Key Dropdown */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Key</label>
                        <select
                            value={keyFilter}
                            onChange={(e) => setKeyFilter(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md focus:outline-none transition-all duration-200 ${mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' : 'bg-gray-100 border-gray-300 focus:ring-indigo-500 text-gray-900 hover:bg-gray-200'}`}
                        >
                            <option value="">All Keys</option>
                            {key.map((k, index) => (
                                <option key={index} value={k}>{k}</option>
                            ))}
                        </select>
                    </div>

                    {/* Custom BPM Dropdown */}
                    <div className="relative">
                        <label className="block mb-2 text-sm font-medium">BPM</label>
                        <button
                            onClick={toggleBpmDropdown}
                            className={`w-full text-left px-3 py-2 border rounded-md focus:outline-none transition-all duration-200 ${mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-900'}`}
                        >
                            BPM Range: {rangeValue[0]} - {rangeValue[1]}
                        </button>
                        {bpmDropdownOpen && (
                            <div className={`absolute z-10 w-full mt-2 px-5 py-4 rounded-md shadow-lg transition-opacity duration-300 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
                                <Box sx={{ padding: '10px' }}>
                                    <PrettoSlider
                                        value={rangeValue}
                                        onChange={handleSliderChange}
                                        valueLabelDisplay="auto"
                                        min={40}
                                        max={200}
                                    />
                                    <div className="text-sm mt-2">Selected BPM Range: {rangeValue[0]} - {rangeValue[1]}</div>
                                </Box>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filter;
