// src/data/categories.js
import spaceImg from '../assets/space.svg';
import scienceImg from '../assets/science.svg';
import historyImg from '../assets/history.svg';
import geographyImg from '../assets/geography.svg';
import mathImg from '../assets/math.svg';
import technologyImg from '../assets/technology.svg';

export const categoriesData = {
  space: { name: 'Space', img: spaceImg, color: 'bg-sky-100', textColor: 'text-sky-800', buttonColor: 'bg-sky-500 hover:bg-sky-600' },
  science: { name: 'Science', img: scienceImg, color: 'bg-green-100', textColor: 'text-green-800', buttonColor: 'bg-green-500 hover:bg-green-600' },
  history: { name: 'History', img: historyImg, color: 'bg-amber-100', textColor: 'text-amber-800', buttonColor: 'bg-amber-500 hover:bg-amber-600' },
  geography: { name: 'Geography', img: geographyImg, color: 'bg-blue-100', textColor: 'text-blue-800', buttonColor: 'bg-blue-500 hover:bg-blue-600' },
  math: { name: 'Math', img: mathImg, color: 'bg-rose-100', textColor: 'text-rose-800', buttonColor: 'bg-rose-500 hover:bg-rose-600' },
  technology: { name: 'Technology', img: technologyImg, color: 'bg-indigo-100', textColor: 'text-indigo-800', buttonColor: 'bg-indigo-500 hover:bg-indigo-600' },
};