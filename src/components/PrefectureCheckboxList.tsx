import React from 'react';

type Prefecture = {
    prefCode: number;
    prefName: string;
};

type PrefectureCheckboxListProps = {
    prefectures: Prefecture[];
    selectedPrefectures: number[];
    onCheckboxChange: (prefCode: number) => void;
};

const PrefectureCheckboxList: React.FC<PrefectureCheckboxListProps> = ({ prefectures, selectedPrefectures, onCheckboxChange}) => {
    return (
        <ul>
            {prefectures.map((prefecture) => (
                <li key={prefecture.prefCode}>
                    <input type="checkbox" id={`pref-${prefecture.prefCode}`} checked={selectedPrefectures.includes(prefecture.prefCode) || false}
                    onChange={() => onCheckboxChange(prefecture.prefCode)}
                    />
                    <label htmlFor={`pref-${prefecture.prefCode}`}>{prefecture.prefName}</label>
                </li>
            ))}
        </ul>
    );
};

export default PrefectureCheckboxList;