import React, { createContext, useContext, useState } from 'react';
import { generateRecommendations } from '../utils/recommendationEngine';

const GuestContext = createContext(null);


export function GuestProvider({ children }) {
  const [isGuest, setIsGuest] = useState(false);
  const [demoProfile, setDemoProfile] = useState({
    id: 'guest',
    full_name: 'Guest User',
    degree: 'B.Sc. Computer Science',
    university: 'Demo University',
    skills: ['JavaScript', 'React', 'SQL'],
    interests: ['Web development', 'AI'],
    bio: 'This is a demo profile to preview the app screens.'
  });

  const [demoSaved, setDemoSaved] = useState([
    { id: 'g1', title: 'Frontend Developer', salary_range: '$60k-$90k', summary: 'Build UI with React.' },
    { id: 'g2', title: 'Data Analyst', salary_range: '$50k-$80k', summary: 'Analyze data and create reports.' }
  ]);

  const value = {
    isGuest,
    enterGuest: () => setIsGuest(true),
    exitGuest: () => setIsGuest(false),
    demoProfile,
    setDemoProfile,
    demoSaved,
    setDemoSaved,
    demoRec: generateRecommendations(demoProfile)
  };

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export const useGuest = () => useContext(GuestContext);

export default GuestContext;
