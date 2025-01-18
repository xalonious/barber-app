import React, { useEffect, useState } from 'react';
import TeamMemberCard from '../components/TeamMemberCard';
import { fetchStaffMembers, StaffMember } from '../api/staff';
import '../styles/OnsTeam.css';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const OnsTeam: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const loadStaffMembers = async () => {
      try {
        const data = await fetchStaffMembers();
        setStaff(data);
        setLoadingError(false);
      } catch (error) {
        console.error('Error fetching staff members:', error);
        setLoadingError(true);
      } finally {
        setLoading(false); 
      }
    };

    loadStaffMembers();
  }, []);

  return (
    <div className="ons-team">
      <h2 className="team-title">Ons Team</h2>
      {loading ? (
        <Loading />
      ) : loadingError ? (
        <ErrorMessage message="Er was een probleem bij het laden van de teamleden. Controleer uw verbinding en probeer opnieuw." />
      ) : (
        <div className="staff-cards">
          {staff.map((member, index) => (
            <TeamMemberCard key={member.staffId} member={member} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OnsTeam;
